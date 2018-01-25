/*

Autogenerating Music Exercises for education program "Muusika Kompositsiooniõpetus" https://et.wikibooks.org/wiki/Muusika_kompositsiooni%C3%B5petus/N%C3%84IDISKURSUS._G%C3%9CMNAASIUM
Commissioned by Estonian Ministry of Education and Research, Tallinn University,  in the frame of Digital Learning Resources project DigiÕppeVaramu https://htk.tlu.ee/oppevara/


Copyright 2018, by Tarmo Johannes trmjhnns@gmail.com

License: MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
 
// Original exercise: Helikõrgus. Enharmonism. Antud on helikõrgus tähtnimetusega, silpnimetusega, noodijoonestikul. Kirjuta enharmoonilised helid 

//  Find enharmonic notes, display one, ask other

function enharmonism(nameOrSyllable, containerNode, canvasClassName) {		
	// variables
	var selectedNotes = [];
	var answered = false;
	var askFor = "", correctAnswer = "";
	var notes = new NoteClass();
	
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName;
	nameOrSyllable = (nameOrSyllable === undefined) ? "name" : nameOrSyllable;
	
	// Create or set necessary HTML elements
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Enharmonism";
	var translation1 = nameOrSyllable === "name" ? "tähtnimetusena" : "silpnimetusena"
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "Antud on heliõrgus " + translation1 + ". Leia sellele enharmooniliselt vastav noot (dubldieese ja dublbemolle pole kasutatud.)"; 
	this.containerNode.getElementsByClassName("question")[0].innerHTML =	'Noodile  X vastab: '; 
	
	
	var exercise = new MusicExercise(this.containerNode,this.canvasClassName, 150); // relatively narrow canvas 
	
	var oldResponse = this.containerNode.getElementsByClassName("response")[0];
	var response = document.createElement("select");
	response.className = "response";
	var responseHTML = "<option>---</option>";
	
	for (var i = 0; i < 7*3; i++) {
			var option;
			if (nameOrSyllable === "syllable") {
				option = notes.removeLastDigit(notes.bassClefNotes[i].syllable.toLowerCase()); // remove octave (1 or 2), if present. Bassnotes since they start from Ć
			} else {
				option = notes.removeLastDigit(notes.bassClefNotes[i].name.toLowerCase());
			}
			responseHTML += '<option value="' + option + '">' + option + '</option>'
		}
	
	response.innerHTML = responseHTML;
	
	
	if (oldResponse === null || oldResponse === undefined) {
		console.log("Creating new response element");
		this.containerNode.getElementsByClassName("responseDiv")[0]. appendChild(response)
	} else {
		console.log("Replacing response element");
		this.containerNode.getElementsByClassName("responseDiv")[0].replaceChild(response, oldResponse);
	}
	
	// set necessary methods in exercise	
	exercise.time = ""; // no time signature
	
	var enharmonicNotes = [ ["C#/4","D@/4"], ["D#/4","E@/4"], ["F#/4","G@/4"], ["G#/4","A@/4"], ["A#/4","B@/4"],  ["C/5","B#/4"], ["C@/5", "B/4"], ["E#/4", "F/4"], ["F@/4", "E/4"]]; // later find names and syllables by vtNote
	
	
	exercise.generate = function() {
		var tryThis = enharmonicNotes[Math.floor(Math.random()*enharmonicNotes.length)];
		while (tryThis[0] === selectedNotes[0]) { // to avoid getting the same duration twice in a row
			//console.log("Got the same, retrying");
			tryThis = enharmonicNotes[Math.floor(Math.random()*enharmonicNotes.length)];
		}
		
		 		
		var dice = Math.random(); // which one of those to display first
		if (dice>0.5) {
			selectedNotes = [tryThis[0], tryThis[1]]; // randomize the order
		} else {
			selectedNotes = [tryThis[1], tryThis[0]];
		}
		
		//console.log("Selected notes: ", selectedNotes);
		
		if (nameOrSyllable === "syllable") {
			askFor = notes.findNoteByVtNote(selectedNotes[0], notes.violinClefNotes).syllable; // clef here hardcoded to be violin clef
			correctAnswer = notes.findNoteByVtNote(selectedNotes[1], notes.violinClefNotes).syllable;
		} else {
			askFor = notes.findNoteByVtNote(selectedNotes[0], notes.violinClefNotes).name;
			correctAnswer = notes.findNoteByVtNote(selectedNotes[1], notes.violinClefNotes).name;
		}
		askFor = notes.removeLastDigit(askFor); // remove octave number, if present // if it were bass clef, also toLowerCase
		correctAnswer = notes.removeLastDigit(correctAnswer);
		
		
		//console.log(askFor, correctAnswer);
		
		this.containerNode.getElementsByClassName("question")[0].innerHTML = 'Noodile <b>' + askFor +
 		'</b> vastab enharmooniliselt: ' ;
		
		exercise.notes = ":4 " + selectedNotes[0]; // display first note
		
		answered = false;
	
	}
	
	exercise.renew();		
	
	exercise.responseFunction = function() {		
		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		}
		exercise.attempts += 1;
		var feedback = "";
		var answer = this.containerNode.getElementsByClassName("response")[0].value;
		if (answer === correctAnswer) {
			feedback = "<b>Õige!</b>"
			exercise.score += 1;
		} else {
			feedback = "<b>Vale!</b> Õige oli: "+ correctAnswer; 
		}
		
		this.containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
		this.containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback; 
		exercise.notes += " :4 " + selectedNotes[1]; // show also the other
		exercise.draw(); // redraw without rectangle
		answered = true;	
	}
	
	return exercise;
		
}
