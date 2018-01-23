/*

Autogenerating Music Exercises for education program "Muusika Kompositsiooniõpetus" https://et.wikibooks.org/wiki/Muusika_kompositsiooni%C3%B5petus/N%C3%84IDISKURSUS._G%C3%9CMNAASIUM
Commissioned by Estonian Ministry of Education and Research, Tallinn University,  in the frame of Digital Learning Resources project DigiÕppeVaramu https://htk.tlu.ee/oppevara/


Copyright 2018, by Tarmo Johannes trmjhnns@gmail.com

License: MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/


// original exercise:  1.3.7. Helikõrgus. Viiulivõti. Antud on helikõrgus tähtnimetusega. Kirjuta helikõrgus silpnimetusega, noodijoonestikul, klaviatuuril. 


function noteFromNoteName(clef, containerNode, canvasClassName) { 
	var answered = false;
	var noteIndex = -1, currentNoteIndex = -1;
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
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Kirjuta helikõrgus tähtnime järgi. " + ( (clef==="bass") ? "Bassivõti." : " Viiulivõti." );
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "Antud on helikõrgus tähtnimetusega. Kirjuta helikõrgus silpnimetusega, noodijoonestikul, klaviatuuril.<br>Alteratsioonimärkide lisamiseks vajuta + või - nupule või kasuta vatavaid klahve arvutklaviatuuril."; 
	
	function handleAccidental(plusMinus) {  // -1 to lower half tone, +1 to raise halftone
		console.log("handleAccidental", plusMinus, );
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

	var piano = new Piano(pianoDiv); // 1 octava from middle C by default
	piano.createPiano();
	
	
	exercise.generate = function() {		
		noteIndex = Math.floor(Math.random()*possibleNotes.length); 
		console.log("Selected", possibleNotes[noteIndex].name, possibleNotes[noteIndex].syllable, noteIndex);
		
		this.containerNode.getElementsByClassName("question")[0].innerHTML =	'<br>Sisesta noodijoonestikule <b>' +possibleNotes[noteIndex].name + '</b><br>Noot <b><big>' + notes.removeLastDigit(possibleNotes[noteIndex].name.toLowerCase())  + '</b></big> on silpnimetusega: <select class="syllable"><option>---</option></select><br>Kui oled noodi sisetanud noodijoonestikule, vajuta Vasta:' ;
		
		var select = this.containerNode.getElementsByClassName('syllable')[0];
		for(var i = 0; i < 7*3; i++) {
			var option = document.createElement('option');
			var syllable = notes.removeLastDigit(possibleNotes[i].syllable.toLowerCase()); // remove octave (1 or 2), if present
			option.innerHTML = syllable;
			option.value = syllable;
			select.appendChild(option);
		}
		
		exercise.notes = ""; // nothing drawn	
		currentNoteIndex = -1; 	
		answered = false; // necessary to set a flag to check if the quetion has answered already in checkResponse
	
	}
	
	
	
	exercise.clickActions = function(x,y) {
		// console.log(x,y);		

		var line = exercise.artist.staves[0].note.getLineForY(y);
		
		// find note by line
		line =  Math.round(line*2)/2; // round to neares 0.5
		for (var i= 0; i<possibleNotes.length;i++) {
			if (possibleNotes[i].hasOwnProperty("line") ) {
				//console.log(i, possibleNotes[i].line, line)
				if (possibleNotes[i].line === line) {
					console.log("FOUND ", i, possibleNotes[i].vtNote);
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
		piano.deactivateAllKeys();
        exercise.generate();
        exercise.draw();
	}
	
	exercise.renew();		
	
	exercise.responseFunction = function() {
		if (currentNoteIndex < 0) {
			alert("Sisesta noot noodijoonestikule!")
			return;
		}
		
		if (!piano.pressedKey.active) {
			alert("Klahv klaviatuuril valimata!")
			return;
		}
		
		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		}
		
		exercise.attempts += 1;
		var feedback = "";
		var correct = false;
				
		var syllable = notes.removeLastDigit(possibleNotes[noteIndex].syllable.toLowerCase());
		
		if (this.containerNode.getElementsByClassName("syllable")[0].value === syllable ) { 
			feedback += "Silpnimetus <b>õige!</b> "
			correct = true;
		} else {
			feedback += "Silpnimetus <b>vale!</b> See on hoopis " + syllable + ". ";			
			correct = false;
		}
		
		if (currentNoteIndex === noteIndex) {
			feedback += "Noot noodijoonestikul on <b>õige!</b> "
			correct = correct && true;;
		} else {
			feedback += "Noot noodijoonestikul on <b>vale!</b> "; 
			exercise.notes += " " + possibleNotes[noteIndex].vtNote;
			exercise.draw(); // redraw with right note
			correct = correct && false;
		}
		
		console.log(piano.pressedKey.dataset.midinote, possibleNotes[noteIndex].midiNote)
		
		if ( piano.pressedKey.dataset.midinote%12 === possibleNotes[noteIndex].midiNote%12) { // check pich class, igonre octave
			feedback += "Noot klaviatuuril on <b>õige!</b> "
			piano.fillKey(piano.pressedKey, "green");
			correct = correct && true;
		} else {
			feedback += "Noot klaviatuuril <b>vale!</b> "; 
			piano.fillKey(piano.pressedKey, "red");
			piano.fillKey(piano.findKeyByMidiNote(possibleNotes[noteIndex].midiNote%12), "blue")
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
