// Music exercises for "MUUSIKA KOMPOSITSIOONIÕPETUS"
// TODO: proper credits, copyright


// This is basically copy of drawNote() -  bad coding, there should be some inheritance of one base class or similar. Do it later.
// check for classes in JS5 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes


// 1.3.9. harjutus. Helikõrgus. Viiulivõti. Antud on helikõrgus noodijoonestikul. Kirjuta helikõrgus tähtnimetusega, silpnimetusega, klaviatuuril. (Column + MusGen)


//var exercise must be defined in html.

// violinClefNotes and bassClefNotes are defined in possible_notes.js -  must be included in main html


function noteFromNotation(clef) { // draws a note, user must answer the letter name and syllable name of the note and press it on piano keyboard
	
	var answered = false;
	var noteIndex = -1, currentNoteIndex = -1;
	
	// set necessary methods in exercise
	exercise = new MusicExercise("mainCanvas",150,10,10,1.5); // bigger scale for note input
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
	document.getElementById("exerciseTitle").innerHTML = "Mis noot see on? " + ( (clef==="bass") ? "Bassivõti." : " Viiulivõti." );
	document.getElementById("description").innerHTML = "Antud on helikõrgus noodijoonestikul. Kirjuta helikõrgus tähtnimetusega, silpnimetusega, klaviatuuril"; 
	//TODO: luba ka pause, mitte ainult noodid -  kas vaja?
	//document.getElementById("question").innerHTML =	"Mis noot see on? Sisesa tähtnimetus, silpnimetus, asukoht klaviatuuril.";
	
	
	var pianoDiv = document.createElement("div"); // piano keyboard
	pianoDiv.id="piano-container";
	pianoDiv.style.marginTop = "5px";
	exercise.canvas.appendChild(pianoDiv);

	var piano = new Piano("piano-container"); // 1 octava from middle C by default
	piano.createPiano();
	
	function removeLastDigit(word) { // to turn notenames like "ces2" into "ces"
		if (!isNaN(parseInt(word[word.length-1]))) { // last character is number
			word = word.slice(0, -1); // remove last character
		}
		return word; 
	}
	
	exercise.generate = function() {
				
		noteIndex = Math.floor(Math.random()*possibleNotes.length); 
		console.log("Selected", possibleNotes[noteIndex].name, possibleNotes[noteIndex].syllable);
		
		document.getElementById("question").innerHTML =	'Noodijoonestikul kuvatud noodi tähtnimetus on: <select id="noteName"><option>---</option></select>,  silpnimetus: <select id="syllable"><option>---</option></select><br>Kui oled noodi leidnud ka klaviatuuril, vajuta Vasta:' ;
		
		var select1 = document.getElementById('noteName');
		for(var i = 0; i < 7*3; i++) {
			let option = document.createElement('option');
			let noteName = removeLastDigit(possibleNotes[i].name.toLowerCase()); // remove octave (1 or 2), if present
			option.innerHTML = noteName;
			option.value = noteName;
			select1.appendChild(option);
		}
		
		
		var select2 = document.getElementById('syllable');
		for(var i = 0; i < 7*3; i++) {
			let option = document.createElement('option');
			let syllable = removeLastDigit(possibleNotes[i].syllable.toLowerCase()); // remove octave (1 or 2), if present
			option.innerHTML = syllable;
			option.value = syllable;
			select2.appendChild(option);
		}
		
		
		
		exercise.notes = possibleNotes[noteIndex].vtNote; // nothing drawn	
		currentNoteIndex = -1; 	
		answered = false; // necessary to set a flag to check if the quetion has answered already in checkResponse
	
	}
	
	exercise.renew = function() {
		document.getElementById("feedback").innerHTML = "";
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
		
		let syllable = removeLastDigit(possibleNotes[noteIndex].syllable.toLowerCase());
		let noteName = removeLastDigit(possibleNotes[noteIndex].name.toLowerCase());
		
		if (document.getElementById("noteName").value === noteName ) { 
			feedback += "Tähtnimetus õige! "
			correct = true;
		} else {
			feedback += "Tähtnimetus vale! See on hoopis " + noteName + ". ";			
			correct = false;
		}
		
		if (document.getElementById("syllable").value === syllable ) { 
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
		
		document.getElementById("attempts").innerHTML = exercise.attempts;
		document.getElementById("score").innerHTML = exercise.score;
		document.getElementById("feedback").innerHTML = feedback; 		
		answered = true;
		
	}
	

}
