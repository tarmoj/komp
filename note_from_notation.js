// Music exercises for "MUUSIKA KOMPOSITSIOONIÕPETUS"
// TODO: proper credits, copyright


// This is basically copy of drawNote() -  bad coding, there should be some inheritance of one base class or similar. Do it later.
// check for classes in JS5 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes


// 1.3.9. harjutus. Helikõrgus. Viiulivõti. Antud on helikõrgus noodijoonestikul. Kirjuta helikõrgus tähtnimetusega, silpnimetusega, klaviatuuril. (Column + MusGen)


//var exercise must be defined in html.


function noteFromNotation(clef) { // draws a note, user must answer the letter name and syllable name of the note and press it on piano keyboard
	
	var answered = false;
	var noteIndex = -1, currentNoteIndex = -1;
	
	var violinClefNotes = [   // line - line number in staff: 0 upper, 4 - lower, 5 - lower ledger line. Used to draw the note
		{vtNote:"C@/4", name:"ces1", syllable:"do-bemoll1", midiNote: 59},
		{vtNote:"C/4", name:"c1", syllable:"do1", line: 5, midiNote: 60},
		{vtNote:"C#/4", name:"cis1", syllable:"do-diees1", midiNote: 61},
		
		{vtNote:"D@/4", name:"des1", syllable:"re-bemoll1", midiNote: 61},
		{vtNote:"D/4", name:"d1", syllable:"re1", line: 4.5, midiNote: 62},
		{vtNote:"D#/4", name:"dis1", syllable:"re-diees1", midiNote: 63},
		
		{vtNote:"E@/4", name:"es1", syllable:"mi-bemoll1", midiNote: 63},
		{vtNote:"E/4", name:"e1", syllable:"mi1", line: 4, midiNote: 64},
		{vtNote:"E#/4", name:"eis1", syllable:"mi-diees1", midiNote: 65},
		
		{vtNote:"F@/4", name:"fes1", syllable:"fa-bemoll1", midiNote:64},
		{vtNote:"F/4", name:"f1", syllable:"fa1", line: 3.5, midiNote:65},
		{vtNote:"F#/4", name:"fis1", syllable:"fa-diees1", midiNote:66},
		
		{vtNote:"G@/4", name:"ges1", syllable:"sol-bemoll1", midiNote: 66},
		{vtNote:"G/4", name:"g1", syllable:"sol1", line: 3, midiNote: 67},
		{vtNote:"G#/4", name:"gis1", syllable:"sol-diees1", midiNote: 68},
		
		{vtNote:"A@/4", name:"as1", syllable:"la-bemoll1", midiNote: 68},
		{vtNote:"A/4", name:"a1", syllable:"la1", line: 2.5, midiNote: 69},
		{vtNote:"A#/4", name:"ais1", syllable:"la-diees1", midiNote: 70},
		
		{vtNote:"B@/4", name:"b1", syllable:"si-bemoll1", midiNote: 70},
		{vtNote:"B/4", name:"h1", syllable:"si1", line: 2, midiNote: 71},
		{vtNote:"B#/4", name:"his1", syllable:"si-diees1", midiNote: 72},
		
		
		{vtNote:"C@/5", name:"ces2", syllable:"do-bemoll2", midiNote: 71},
		{vtNote:"C/5", name:"c2", syllable:"do2", line: 1.5, midiNote: 72},
		{vtNote:"C#/5", name:"cis2", syllable:"do-diees2", midiNote: 73},
		
		{vtNote:"D@/5", name:"des2", syllable:"re-bemoll2", midiNote: 73},
		{vtNote:"D/5", name:"d2", syllable:"re2", line: 1, midiNote: 74},
		{vtNote:"D#/5", name:"dis2", syllable:"re-diees2", midiNote: 75},
		
		{vtNote:"E@/5", name:"es2", syllable:"mi-bemoll2", midiNote: 75},
		{vtNote:"E/5", name:"e2", syllable:"mi2", line: 0.5, midiNote: 76},
		{vtNote:"E#/5", name:"eis2", syllable:"mi-diees2", midiNote: 77},
		
		{vtNote:"F@/5", name:"fes2", syllable:"fa-bemoll2", midiNote: 76},
		{vtNote:"F/5", name:"f2", syllable:"fa2", line: 0, midiNote: 77},
		{vtNote:"F#/5", name:"fis2", syllable:"fa-diees2", midiNote: 78},
		
		{vtNote:"G@/5", name:"ges2", syllable:"sol-bemoll2", midiNote: 78},
		{vtNote:"G/5", name:"g2", syllable:"sol2", line: -0.5, midiNote: 79},
		{vtNote:"G#/5", name:"gis2", syllable:"sol-diees2", midiNote: 80},
		
		{vtNote:"A@/5", name:"as2", syllable:"la-bemoll2", midiNote: 80},
		{vtNote:"A/5", name:"a2", syllable:"la2", line: -1, midiNote: 81},
		{vtNote:"A#/5", name:"ais2", syllable:"la-diees2", midiNote: 82},
		
		{vtNote:"B@/5", name:"b2", syllable:"si-bemoll2", midiNote: 82},
		{vtNote:"B/5", name:"h2", syllable:"si2", line: -1.5, midiNote: 83},
		{vtNote:"B#/5", name:"his2", syllable:"si-diees2", midiNote: 84},
		
		{vtNote:"C@/6", name:"ces3", syllable:"do-bemoll3", midiNote: 83},
		{vtNote:"C/6", name:"c3", syllable:"do3", line: -2, midiNote: 84},
		{vtNote:"C#/6", name:"cis3", syllable:"do-diees3", midiNote: 85},
		
		
	];
	
	var bassClefNotes = [   // line - line number in staff: 0 upper, 4 - lower, 5 - lower ledger line. Used to draw the note
		{vtNote:"C@/2", name:"Ces", syllable:"Do-bemoll", midiNote: 35},
		{vtNote:"C/2", name:"C", syllable:"Do", line: 6, midiNote: 36},
		{vtNote:"C#/2", name:"C", syllable:"Do-diees", midiNote: 37},
		
		{vtNote:"D@/2", name:"Des", syllable:"Re-bemoll", midiNote: 37},
		{vtNote:"D/2", name:"D", syllable:"Re", line: 5.5, midiNote: 38},
		{vtNote:"D#/2", name:"Dis", syllable:"Re-diees", midiNote: 39},
		
		{vtNote:"E@/2", name:"Es", syllable:"Mi-bemoll1", midiNote: 39},
		{vtNote:"E/2", name:"E", syllable:"Mi", line: 5, midiNote: 40},
		{vtNote:"E#/2", name:"Eis", syllable:"Mi-diees", midiNote: 41},
		
		{vtNote:"F@/2", name:"Fes", syllable:"Fa-bemoll", midiNote:40},
		{vtNote:"F/2", name:"F", syllable:"Fa", line: 4.5, midiNote:41},
		{vtNote:"F#/2", name:"Fis", syllable:"Fa-diees", midiNote:42},
		
		{vtNote:"G@/2", name:"Ges", syllable:"Sol-bemoll", midiNote: 42},
		{vtNote:"G/2", name:"G", syllable:"Sol", line: 4, midiNote: 43},
		{vtNote:"G#/2", name:"Gis", syllable:"Sol-diees", midiNote: 44},
		
		{vtNote:"A@/2", name:"As", syllable:"La-bemoll", midiNote: 44},
		{vtNote:"A/2", name:"A", syllable:"La", line: 3.5, midiNote: 45},
		{vtNote:"A#/2", name:"Ais", syllable:"La-diees", midiNote: 46},
		
		{vtNote:"B@/2", name:"B", syllable:"Si-bemoll1", midiNote: 46},
		{vtNote:"B/2", name:"H", syllable:"Si", line: 3, midiNote: 47},
		{vtNote:"B#/2", name:"His", syllable:"Si-diees", midiNote: 48},
		
		
		{vtNote:"C@/3", name:"ces", syllable:"do-bemoll", midiNote: 47},
		{vtNote:"C/3", name:"c", syllable:"do", line: 2.5, midiNote: 48},
		{vtNote:"C#/3", name:"cis", syllable:"do-diees", midiNote: 49},
		
		{vtNote:"D@/3", name:"des", syllable:"re-bemoll", midiNote: 49},
		{vtNote:"D/3", name:"d", syllable:"re", line: 2, midiNote: 50},
		{vtNote:"D#/3", name:"dis", syllable:"re-diees", midiNote: 51},
		
		{vtNote:"E@/3", name:"es", syllable:"mi-bemoll", midiNote: 51},
		{vtNote:"E/3", name:"e", syllable:"mi", line: 1.5, midiNote: 52},
		{vtNote:"E#/3", name:"eis", syllable:"mi-diees", midiNote: 53},
		
		{vtNote:"F@/3", name:"fes", syllable:"fa-bemoll", midiNote: 52},
		{vtNote:"F/3", name:"f", syllable:"fa", line: 1, midiNote: 53},
		{vtNote:"F#/3", name:"fis", syllable:"fa-diees", midiNote: 54},
		
		{vtNote:"G@/3", name:"ges", syllable:"sol-bemoll", midiNote: 54},
		{vtNote:"G/3", name:"g", syllable:"sol", line: 0.5, midiNote: 55},
		{vtNote:"G#/3", name:"gis", syllable:"sol-diees", midiNote: 56},
		
		{vtNote:"A@/3", name:"as", syllable:"la-bemoll", midiNote: 56},
		{vtNote:"A/3", name:"a", syllable:"la", line: 0, midiNote: 57},
		{vtNote:"A#/3", name:"ais", syllable:"la-diees", midiNote: 58},
		
		{vtNote:"B@/3", name:"b", syllable:"si-bemoll", midiNote: 58},
		{vtNote:"B/3", name:"h", syllable:"si", line: -0.5, midiNote: 59},
		{vtNote:"B#/3", name:"his", syllable:"si-diees", midiNote: 60},
		
		{vtNote:"C@/4", name:"ces1", syllable:"do-bemoll1", midiNote: 59},
		{vtNote:"C/4", name:"c1", syllable:"do1", line: -1, midiNote: 60},
		{vtNote:"C#/4", name:"cis1", syllable:"do-diees1", midiNote: 61},
		
		
	];
	
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
