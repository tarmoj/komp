// Music exercises for "MUUSIKA KOMPOSITSIOONIÕPETUS"
// TODO: proper credits, copyright


// This is basically copy of drawNote() -  bad coding, there should be some inheritance of one base class or similar. Do it later.
// check for classes in JS5 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes


// 1.3.9. harjutus. Helikõrgus. Viiulivõti. Antud on helikõrgus noodijoonestikul. Kirjuta helikõrgus tähtnimetusega, silpnimetusega, klaviatuuril. (Column + MusGen)




function noteFromNotation(clef, containerNode, canvasClassName) {
	
	var answered = false;
	var noteIndex = -1, currentNoteIndex = -1;
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName;
	var notes = new NoteClass();
	
	// set necessary methods in exercise
	var exercise = new MusicExercise(this.containerNode, this.canvasClassName,150,10,10,1.5); // bigger scale for note input
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
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Mis noot see on? " + ( (clef==="bass") ? "Bassivõti." : " Viiulivõti." );
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "Antud on helikõrgus noodijoonestikul. Kirjuta helikõrgus tähtnimetusega, silpnimetusega, klaviatuuril"; 

	
	var pianoDiv = document.createElement("div"); // piano keyboard
	pianoDiv.style.marginTop = "5px";
	exercise.canvas.appendChild(pianoDiv);

	var piano = new Piano(pianoDiv); // 1 octava from middle C by default
	piano.createPiano();
	
	exercise.generate = function() {
				
		noteIndex = Math.floor(Math.random()*possibleNotes.length); 
		console.log("Selected", possibleNotes[noteIndex].name, possibleNotes[noteIndex].syllable);
		
		this.containerNode.getElementsByClassName("question")[0].innerHTML =	'Noodijoonestikul kuvatud noodi tähtnimetus on: <select class="noteName"><option>---</option></select>,  silpnimetus: <select class="syllable"><option>---</option></select><br>Kui oled noodi leidnud ka klaviatuuril, vajuta Vasta:' ;
		
		var select1 = this.containerNode.getElementsByClassName('noteName')[0];
		for (var i = 0; i < 7*3; i++) {
			var option = document.createElement('option');
			var noteName = notes.removeLastDigit(possibleNotes[i].name.toLowerCase()); // remove octave (1 or 2), if present
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
		
		
		
		exercise.notes = possibleNotes[noteIndex].vtNote; 
		currentNoteIndex = -1; 	
		answered = false; // necessary to set a flag to check if the quetion has answered already in checkResponse
	
	}
	
	exercise.renew = function() {
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = "";
        this.generate();
        this.draw();
		piano.deactivateAllKeys();
	}
	
	exercise.renew();		
	
	exercise.responseFunction = function() {
		
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
		
		// TODO: eemalda silbilt oktavinumber
		
		var syllable = notes.removeLastDigit(possibleNotes[noteIndex].syllable.toLowerCase());
		var noteName = notes.removeLastDigit(possibleNotes[noteIndex].name.toLowerCase());
		
		if (this.containerNode.getElementsByClassName("noteName")[0].value === noteName ) { 
			feedback += "Tähtnimetus õige! "
			correct = true;
		} else {
			feedback += "Tähtnimetus vale! See on hoopis " + noteName + ". ";			
			correct = false;
		}
		
		if (this.containerNode.getElementsByClassName("syllable")[0].value === syllable ) { 
			feedback += "Silpnimetus õige! "
			correct = true;
		} else {
			feedback += "Silpnimetus vale! See on hoopis " + syllable + ". ";			
			correct = false;
		}
		
		if ( piano.pressedKey.dataset.midinote%12 === possibleNotes[noteIndex].midiNote%12) { // check pich class, igonre octave
			feedback += "Noot klaviatuuril on õige! "
			piano.fillKey(piano.pressedKey, "green");
			correct = correct && true;
		} else {
			feedback += "Noot klaviatuuril vale! "; 
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
