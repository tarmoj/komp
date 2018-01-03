// Music exercises for "MUUSIKA KOMPOSITSIOONIÕPETUS"
// TODO: proper credits, copyright


//10. harjutus. Helikõrgus. Viiulivõti. Antud on helikõrgus klaviatuuril. Kirjuta helikõrgus tähtnimetusega, silpnimetusega, noodijoonestikul. (Column + MusGen)


//var exercise; should it be declared in the script part of main html?? 


// possibleNotes for treble and bass cled defined in possible_notes.js -  must be included in main html

function noteFromKeyboard(clef, containerNode) { // generates 2 bars in given time, hides barlines, on click draws a line an cecks if it is correct (between right notes)
	
	var answered = false;
	var noteIndex = -1, currentNoteIndex = -1, selectedMidiNote = -1;
	var correctNames = [], correctSyllables = []; // must be array since there are several enharmonic possibilities for black keys
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	
	
	// set necessary methods in exercise
	var exercise = new MusicExercise(this.containerNode, "mainCanvas",150,10,10,1.5); // bigger scale for note input
 	exercise.time = "";
 	exercise.key = "";
	exercise.timeToThink = 30; // more time for doing the test
	
	
	// set clef
	var possibleNotes;
	if (clef==="bass") {
		exercise.clef ="bass"
		possibleNotes = bassClefNotes;
	} else {
		exercise.clef = "treble"
		possibleNotes = violinClefNotes;
	}
	
	// Create or set necessary HTML elements
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Helikõrgus klaviatuurilt: " + ( (clef==="bass") ? "Bassivõti." : " Viiulivõti." );
	this.containerNode.getElementsByClassName("description")[0].innerHTML = " Antud on helikõrgus klaviatuuril. Kirjuta helikõrgus tähtnimetusega, silpnimetusega, noodijoonestikul.<br>Alteratsioonimärkide lisamiseks vajuta + või - nupule või kasuta vatavaid klahve arvutklaviatuuril."; 
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
	

	document.body.addEventListener('keypress', function (e) { // TODO: how to remove when this function is not used? 
		// TODO: redo on keypressed -  otherwise different reults in different browsers
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
	
	function removeLastDigit(word) { // to turn notenames like "ces2" into "ces"
		if (!isNaN(parseInt(word[word.length-1]))) { // last character is number
			word = word.slice(0, -1); // remove last character
		}
		return word; 
	}
	
	
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
				correctNames.push( removeLastDigit(possibleNotes[i].name.toLowerCase()))
				correctSyllables.push ( removeLastDigit(possibleNotes[i].syllable.toLowerCase()) )
			}
		}
		console.log("Found ", correctNames.length, " matching notes.")
		
		this.containerNode.getElementsByClassName("question")[0].innerHTML =	'Klaviatuuril märgitud noodi tähtnimetus on: <select class="noteName"><option>---</option></select>,  silpnimetus: <select class="syllable"><option>---</option></select><br>Kui oled noodi kirjutanud ka noodijoonestikule, vajuta Vasta:' ;
		
		var select1 = this.containerNode.getElementsByClassName('noteName')[0];
		for(var ii = 0; ii < 7*3; ii++) {
			var option = document.createElement('option');
			var noteName = removeLastDigit(possibleNotes[ii].name.toLowerCase()); // remove octave (1 or 2), if present
			option.innerHTML = noteName;
			option.value = noteName;
			select1.appendChild(option);
		}
		
		
		var select2 = this.containerNode.getElementsByClassName('syllable')[0];
		for(var j = 0; j < 7*3; j++) {
			var option2 = document.createElement('option');
			var syllable = removeLastDigit(possibleNotes[j].syllable.toLowerCase()); // remove octave (1 or 2), if present
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
		//var syllable = removeLastDigit(possibleNotes[noteIndex].syllable.toLowerCase());
		
		if ( correctNames.indexOf( this.containerNode.getElementsByClassName("noteName")[0].value) >= 0 ) { 
			feedback += "Tähtnimetus õige! "
			correct = true;
		} else {
			feedback += "Tähtnimetus vale! See on hoopis " + correctNames.join("/") + ". ";			
			correct = false;
		}
		
		if ( correctSyllables.indexOf( this.containerNode.getElementsByClassName("syllable")[0].value) >= 0 ) { 
			feedback += "Silpnimetus õige! "
			correct = correct && true;
		} else {
			feedback += "Silpnimetus vale! See on hoopis " + correctSyllables.join("/") + ". ";			
			correct = correct && false;
		}
		
		if (possibleNotes[currentNoteIndex].midiNote === selectedMidiNote) {
			feedback += "Noot noodijoonestikul on õige! "
			correct = correct && true;;
		} else {
			feedback += "Noot noodijoonestikul on vale! "; 
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
