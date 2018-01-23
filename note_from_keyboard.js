/*

Autogenerating Music Exercises for education program "Muusika Kompositsiooniõpetus" https://et.wikibooks.org/wiki/Muusika_kompositsiooni%C3%B5petus/N%C3%84IDISKURSUS._G%C3%9CMNAASIUM
Commissioned by Estonian Ministry of Education and Research, Tallinn University,  in the frame of Digital Learning Resources project DigiÕppeVaramu https://htk.tlu.ee/oppevara/


Copyright 2018, by Tarmo Johannes trmjhnns@gmail.com

License: MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

//Original exercise: 10. harjutus. Helikõrgus. Viiulivõti. Antud on helikõrgus klaviatuuril. Kirjuta helikõrgus tähtnimetusega, silpnimetusega, noodijoonestikul. (Column + MusGen)


function noteFromKeyboard(clef, containerNode, canvasClassName) { 
	
	var answered = false;
	var noteIndex = -1, currentNoteIndex = -1, selectedMidiNote = -1;
	var correctNames = [], correctSyllables = []; // must be array since there are several enharmonic possibilities for black keys
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName;
	var notes = new NoteClass();
	
	
	// set necessary methods in exercise
	var exercise = new MusicExercise(this.containerNode, this.canvasClassName, 150,10,10,1.5); // bigger scale for note input
 	exercise.time = "";
 	exercise.key = "";
	exercise.timeToThink = 30; // more time for doing the test
	
	
	// set clef
	var possibleNotes;
	if (clef==="bass") {
		exercise.clef ="bass"
		possibleNotes = notes.bassClefNotes;
	} else {
		exercise.clef = "treble"
		possibleNotes = notes.violinClefNotes;
	}
	
	// Create or set necessary HTML elements
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Helikõrgus klaviatuurilt: " + ( (clef==="bass") ? "Bassivõti." : " Viiulivõti." );
	this.containerNode.getElementsByClassName("description")[0].innerHTML = " Antud on helikõrgus klaviatuuril. Kirjuta helikõrgus tähtnimetusega, silpnimetusega, noodijoonestikul.<br>Alteratsioonimärkide lisamiseks vajuta + või - nupule või kasuta vastavaid klahve arvutklaviatuuril."; 
	//this.containerNode.getElementsByClassName("question")[0].innerHTML =	"See noot on silpnimetusega: / Kliki noodijoonestukul kohale, kus peaks asuma noot. Kasuta +/- nuppe, et lisada diees või bemoll";
	
	
	
	// add diesis and bemoll button to mainCanvas
	
	function handleAccidental(plusMinus) {  // -1 to lower half tone, +1 to raise halftone
		//console.log("handleAccidental", plusMinus);
		if (currentNoteIndex > 0) {
			currentNoteIndex += plusMinus;
			if (currentNoteIndex>=possibleNotes.length-1)
				currentNoteIndex = possibleNotes.length-1;
			if (currentNoteIndex<0)
				currentNoteIndex = 0;
			console.log(currentNoteIndex, possibleNotes[currentNoteIndex].vtNote)
			exercise.notes = possibleNotes[currentNoteIndex].vtNote;
			exercise.draw();
		} else {
			alert("Klõpsa esmalt noodi asukohale noodijoonestikul!")
		}
		
	}
	

	document.body.addEventListener('keypress', function (e) { 
		e = e || window.event;
		var charCode = e.keyCode || e.which;		
		if ( charCode === 45 && currentNoteIndex >= 0) { // minus key
			handleAccidental(-1);
		}
		if (charCode === 43 && currentNoteIndex >= 0 ) { // plus key
			handleAccidental(1);
		}
		
	}, false);
	
	var diesisButton = document.createElement("button");
    diesisButton.innerHTML = "+";
    diesisButton.onclick = function(){handleAccidental(1)};
    exercise.canvas.appendChild(diesisButton);
	
	var bemolleButton = document.createElement("button");
    bemolleButton.innerHTML = "-";
    bemolleButton.onclick = function(){handleAccidental(-1)};
    exercise.canvas.appendChild(bemolleButton);
	
	var pianoDiv = document.createElement("div"); // piano keyboard
	pianoDiv.style.marginTop = "5px";
	exercise.canvas.appendChild(pianoDiv);

	var startingOctave = (clef==="bass") ? 2 : 4; 
	var piano = new Piano(pianoDiv,startingOctave, 2, 500); // 2 octavas from low C
	piano.createPiano();
	var lowestKey = (clef==="bass") ? 36 : 60;
	var highestKey = (clef==="bass") ? 59 : 83;
	
	
	
	exercise.generate = function() {
		
		var randomNote = lowestKey + Math.round(Math.random()*(highestKey-lowestKey));
		while (randomNote == selectedMidiNote) { // avoid getting the same
			randomNote = lowestKey + Math.round(Math.random()*(highestKey-lowestKey));
		}
		selectedMidiNote = randomNote;
		piano.activateKey(piano.findKeyByMidiNote(selectedMidiNote));
		console.log("Selected MIDI note: ", selectedMidiNote)
		correctNames = []; correctSyllables = [];
		
		for (var i=0;i<possibleNotes.length;i++) {
			if (possibleNotes[i].midiNote === selectedMidiNote) {
				correctNames.push( notes.removeLastDigit(possibleNotes[i].name.toLowerCase()))
				correctSyllables.push ( notes.removeLastDigit(possibleNotes[i].syllable.toLowerCase()) )
			}
		}
		console.log("Found ", correctNames.length, " matching notes.")
		
		this.containerNode.getElementsByClassName("question")[0].innerHTML =	'Klaviatuuril märgitud noodi tähtnimetus on: <select class="noteName"><option>---</option></select>,  silpnimetus: <select class="syllable"><option>---</option></select><br>Kui oled noodi kirjutanud ka noodijoonestikule, vajuta Vasta:' ;
		
		var select1 = this.containerNode.getElementsByClassName('noteName')[0];
		for(var ii = 0; ii < 7*3; ii++) {
			var option = document.createElement('option');
			var noteName = notes.removeLastDigit(possibleNotes[ii].name.toLowerCase()); // remove octave (1 or 2), if present
			option.innerHTML = noteName;
			option.value = noteName;
			select1.appendChild(option);
		}
		
		
		var select2 = this.containerNode.getElementsByClassName('syllable')[0];
		for(var j = 0; j < 7*3; j++) {
			var option2 = document.createElement('option');
			var syllable = notes.removeLastDigit(possibleNotes[j].syllable.toLowerCase()); // remove octave (1 or 2), if present
			option2.innerHTML = syllable;
			option2.value = syllable;
			select2.appendChild(option2);
		}
		
		exercise.notes = ""; // nothing drawn	
		currentNoteIndex = -1; 	
		answered = false; // necessary to set a flag to check if the quetion has answered already in checkResponse
	
	}
	
	
	
	exercise.clickActions = function(x,y) { // to draw a note on the staff
		// console.log(x,y);		
		var line = exercise.artist.staves[0].note.getLineForY(y);
		
		// find note by line
		line =  Math.round(line*2)/2; // round to neares 0.5
		for (var i= 0; i<possibleNotes.length;i++) {
			if (possibleNotes[i].hasOwnProperty("line") ) {
				//console.log(i, possibleNotes[i].line, line)
				if (possibleNotes[i].line === line) {
					//console.log("FOUND ", i, possibleNotes[i].vtNote);
					exercise.notes =  possibleNotes[i].vtNote;
					currentNoteIndex = i;
					exercise.draw();
					break;
					
				}
			}
			
		}
	}
	
	exercise.renew = function() {
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = "";
		piano.deactivateAllKeys(); // must be before generate, otherwise deactivates selected key.
        this.generate();
        this.draw();
	}
	
	exercise.renew();		
	
	exercise.responseFunction = function() {
		if (currentNoteIndex < 0) {
			alert("Sisesta noot noodijoonestikule!")
			return;
		}
		
		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		}
		
		
		
		exercise.attempts += 1;
		var feedback = "";
		var correct = false;
		
		var noteIndex = 0;
		
		if ( correctNames.indexOf( this.containerNode.getElementsByClassName("noteName")[0].value) >= 0 ) { 
			feedback += "Tähtnimetus <b>õige!</b> "
			correct = true;
		} else {
			feedback += "Tähtnimetus <b>vale</b>! See on hoopis " + correctNames.join("/") + ". ";			
			correct = false;
		}
		
		if ( correctSyllables.indexOf( this.containerNode.getElementsByClassName("syllable")[0].value) >= 0 ) { 
			feedback += "Silpnimetus <b>õige!</b> "
			correct = correct && true;
		} else {
			feedback += "Silpnimetus <b>vale!</b> See on hoopis " + correctSyllables.join("/") + ". ";			
			correct = correct && false;
		}
		
		if (possibleNotes[currentNoteIndex].midiNote === selectedMidiNote) {
			feedback += "Noot noodijoonestikul on <b>õige!</b> "
			correct = correct && true;;
		} else {
			feedback += "Noot noodijoonestikul on <b>vale!</b> "; 
			exercise.notes += " " + piano.findKeyByMidiNote(selectedMidiNote).dataset.vtnote;
			exercise.draw(); // redraw with right note
			correct = correct && false;
		}
		
		
		if (correct) {
			exercise.score += 1;
		}
		
		this.containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
		this.containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback; 		
		answered = true;
		
	}
	
	return exercise;
	
}
