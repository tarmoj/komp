/*

Autogenerating Music Exercises for education program "Muusika Kompositsiooniõpetus" https://et.wikibooks.org/wiki/Muusika_kompositsiooni%C3%B5petus/N%C3%84IDISKURSUS._G%C3%9CMNAASIUM
Commissioned by Estonian Ministry of Education and Research, Tallinn University,  in the frame of Digital Learning Resources project DigiÕppeVaramu https://htk.tlu.ee/oppevara/


Copyright 2018, by Tarmo Johannes trmjhnns@gmail.com

License: MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/


// original exercise:  Antud noot ühes võtmes, kirjutada teises võtmes

function changeClef(clef, containerNode, canvasClassName) {  // clef -  the clef to rewrite to
	var answered = false;
	var noteIndex = -1, currentNoteIndex = -1;
	var selectedVtNote = "";
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName;
	var notes = new NoteClass();
	var staff1="", staff2="";
	var fromClef = "", toClef = ""; 
	var possibleNotes, extraNotes, translation; 
	
	if (clef === "bass") {
		fromClef = "treble";
		toClef = "bass";
		translation = "bassi";
		possibleNotes = notes.bassClefNotes;
		extraNotes = [ // higher than C4, without accidentals
			{vtNote:"D/4", name:"d1", syllable:"re1", line: -1.5, midiNote: 62, degree: 1},
			{vtNote:"E/4", name:"e1", syllable:"mi1", line: -2, midiNote: 64, degree: 2},
			{vtNote:"F/4", name:"f1", syllable:"fa1", line: -2.5, midiNote: 65, degree: 3},
			{vtNote:"G/4", name:"g1", syllable:"sol1", line: -3, midiNote: 67, degree: 4},
			{vtNote:"A/4", name:"a1", syllable:"la1", line: -3.5, midiNote: 69, degree: 5},
			{vtNote:"B/4", name:"h1", syllable:"si1", line: -4, midiNote: 71, degree: 6},
			{vtNote:"C/5", name:"c2", syllable:"do2", line: -4.5, midiNote: 72, degree: 0},
		];
	} else {
		fromClef = "bass";
		toClef = "treble";
		translation = "viiuli";
		possibleNotes = notes.violinClefNotes;
		extraNotes = [ // lower than C4, without accidentals
			{vtNote:"B/3", name:"h", syllable:"si", line: 5.5, midiNote: 59, degree: 6},
			{vtNote:"A/3", name:"a", syllable:"la", line: 6, midiNote: 57, degree: 5},
			{vtNote:"G/3", name:"g", syllable:"sol", line: 6.5, midiNote: 55, degree: 4},
			{vtNote:"F/3", name:"f", syllable:"fa", line: 7, midiNote: 53, degree: 3},
			{vtNote:"E/3", name:"e", syllable:"mi", line: 7.5, midiNote: 52, degree: 2},
			{vtNote:"D/3", name:"d", syllable:"re", line: 8, midiNote: 50, degree: 1},
			{vtNote:"C/3", name:"c", syllable:"do", line: 8.5, midiNote: 48, degree: 0}
		];

	}
	
	possibleNotes = possibleNotes.concat(extraNotes);
	

	// set necessary methods in exercise
	// TODO: create two staves, use exercise.draw(string) to set the vtString with two staves
	// somehow enter notes only to the other stave
	// ONLY white notes, 
	var exercise = new MusicExercise(this.containerNode, this.canvasClassName, 0); // no renderer, create subexercises 
 	exercise.time = "";
	exercise.timeToThink = 30; // more time for doing the test
		
	// create 2 subexercises to show two differe staves with clefs
	var span1 = document.createElement("span");
	span1.className = "span1";
	exercise.canvas.appendChild(span1);
	var span2 = document.createElement("span");
	span2.className = "span2";
	span2.style.display = "inline-block"; // necessary to give hight of the parent to get y coordinate right
	span2.style.height = "100%";
	exercise.canvas.appendChild(span2);
	
	var subExercise1 = new MusicExercise(this.containerNode, "span1", 100,10,10,1.5);	
	var subExercise2 = new MusicExercise(this.containerNode, "span2", 100,10,10,1.5);
	subExercise1.time = "";
	subExercise1.clef = fromClef;
	subExercise2.time = "";
	subExercise2.clef = toClef;
	
	// Create or set necessary HTML elements
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = (clef==="bass") ? "Viiulivõtmest bassivõtmesse" : "Bassivõtmest viiulivõtmesse.";
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "Antud on helikõrgus noodijoonestikul "+ (clef==="bass" ? "viiulivõtmes" : "bassivõtmes") + ". Kirjuta helikõrgus noodijoonestikul " + (clef==="bass" ? "bassivõtmes" : "viiulivõtmes") + "."; 
	
	
	
	exercise.draw = function() {
		subExercise1.draw();
		subExercise2.draw();
	}
	
	exercise.generate = function() {		
		// would make sense to use vextab/fexflow objects
		// but redfining here goes quicker than looking for the right class
		var noteNames = ["C","D","E", "F", "G","A","B" ];
		var octave = (Math.random()>0.5) ? 3 : 4 ;
		
		var tryThis =  noteNames[Math.floor(Math.random()*noteNames.length)] + "/" + octave.toString();
		while (tryThis===selectedVtNote) {
			tryThis =  noteNames[Math.floor(Math.random()*noteNames.length)] + "/" + octave.toString();
		}
		selectedVtNote = tryThis;
		
		console.log("Selected: ", selectedVtNote );
		
		subExercise1.notes = selectedVtNote;
		subExercise2.notes = "";
		
		this.containerNode.getElementsByClassName("question")[0].innerHTML =	'Kirjuta kuvatud noot ' + translation + 'võtmes. Seejärel vajuta "Vasta".' ;
		
		
		currentNoteIndex = -1; 	
		answered = false; // necessary to set a flag to check if the quetion has answered already in checkResponse
	
	}
	
	
	
	subExercise2.clickActions = function(x,y) {
		console.log(x,y);		

		var line = subExercise2.artist.staves[0].note.getLineForY(y); //NB! staff=1 since second staff is for input
		
		// find note by line
		line =  Math.round(line*2)/2; // round to neares 0.5
		for (var i= 0; i<possibleNotes.length;i++) {
			if (possibleNotes[i].hasOwnProperty("line") ) {
				//console.log(i, possibleNotes[i].line, line)
				if (possibleNotes[i].line === line) {
					console.log("FOUND ", i, possibleNotes[i].vtNote);
					subExercise2.notes =  possibleNotes[i].vtNote;
					currentNoteIndex = i;
					subExercise2.draw();
					break;
				}
			}
		}
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
				
		var syllable = notes.removeLastDigit(possibleNotes[currentNoteIndex].syllable.toLowerCase());
		
		if ( possibleNotes[currentNoteIndex].vtNote === selectedVtNote ) { 
			feedback += "<b>Õige!</b> "
			correct = true;
		} else {
			feedback += "<b>Vale!</b> Õige noot kuvatud sisetatud noodi kõrval.";
			subExercise2.notes += selectedVtNote;
			subExercise2.draw();
			correct = false;
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
