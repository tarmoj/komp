/*

Autogenerating Music Exercises for education program "Muusika Kompositsiooniõpetus" https://et.wikibooks.org/wiki/Muusika_kompositsiooni%C3%B5petus/N%C3%84IDISKURSUS._G%C3%9CMNAASIUM
Commissioned by Estonian Ministry of Education and Research, Tallinn University,  in the frame of Digital Learning Resources project DigiÕppeVaramu https://htk.tlu.ee/oppevara/


Copyright 2018, by Tarmo Johannes trmjhnns@gmail.com

License: MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/


// Original exercise: Helikõrgus. Viiulivõti/Bassivõti. Antud on helikõrgus noodijoonestikul. Kirjuta helikõrgus tähtnimetusega ja oktavi nimetus




function octaveFromNotation(clef, containerNode, canvasClassName) {
	
	var answered = false;
	var noteIndex = -1;
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName;
	var notes = new NoteClass();
	
	// set necessary methods in exercise
	var exercise = new MusicExercise(this.containerNode, this.canvasClassName,150,10,10,1); 
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
	
	var possibleOctaves = ["subkontraoktav", "kontraoktav", "suur oktav", "väike oktav", "esimene oktav", "teine oktav", "kolmas oktav", "neljas oktav", "viies oktav"]; // index matches with the vextab octave number
	
	// Create or set necessary HTML elements
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Mis oktavis see noot on? " + ( (clef==="bass") ? "Bassivõti." : " Viiulivõti." );
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "Antud on helikõrgus noodijoonestikul. Kirjuta helikõrgus tähtnimetusega ja oktavi nimetus"; 
	
	this.containerNode.getElementsByClassName("question")[0].innerHTML =	'Noodijoonestikul kuvatud noodi tähtnimetus on: <select class="noteName"><option>---</option></select>,  oktav: <select class="octave"><option>---</option></select> ' ;
	
	exercise.generate = function() {
				
		var tryThis = Math.floor(Math.random()*possibleNotes.length);
		while (tryThis === noteIndex) { // avoid twice the same
			tryThis = Math.floor(Math.random()*possibleNotes.length);
		}
		noteIndex = tryThis;
		//console.log("Selected", possibleNotes[noteIndex].name, possibleNotes[noteIndex].syllable);
		
		//TODO: not so good code - better to do it not every time in generate but costruct the innerHTML
		var select1 = this.containerNode.getElementsByClassName('noteName')[0];
		for (var i = 0; i < 7*3; i++) {
			var option = document.createElement('option');
			var noteName = notes.removeLastDigit(possibleNotes[i].name.toLowerCase()); // remove octave (1 or 2), if present
			option.innerHTML = noteName;
			option.value = noteName;
			select1.appendChild(option);
		}
		
		
		var select2 = this.containerNode.getElementsByClassName('octave')[0];
		for(var j = 0; j < possibleOctaves.length; j++) {
			var option2 = document.createElement('option');
			var oct = possibleOctaves[j]; 
			option2.innerHTML = oct;
			option2.value = oct;
			select2.appendChild(option2);
		}
		
		
		
		exercise.notes = possibleNotes[noteIndex].vtNote; 
		answered = false; // necessary to set a flag to check if the quetion has answered already in checkResponse
	
	}
	
	exercise.renew();		
	
	exercise.responseFunction = function() {
			
		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		}
		
		exercise.attempts += 1;
		var feedback = "";
		var correct = false;
		
		var octNumber = parseInt(possibleNotes[noteIndex].vtNote.split("/")[1]);
		var octString = possibleOctaves[octNumber]; // the names in array correspond to the VT octave numbers 
		
		var noteName = notes.removeLastDigit(possibleNotes[noteIndex].name.toLowerCase());
		
		if (this.containerNode.getElementsByClassName("noteName")[0].value === noteName ) { 
			feedback += "Tähtnimetus <b>õige!</b> "
			correct = true;
		} else {
			feedback += "Tähtnimetus <b>vale!</b> See on hoopis " + noteName + ". ";			
			correct = false;
		}
		
		if (this.containerNode.getElementsByClassName("octave")[0].value === octString ) { 
			feedback += "Oktav <b>õige!</b> "
			correct = true;
		} else {
			feedback += "Oktav <b>vale!</b> See on hoopis " + octString + ". ";			
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
