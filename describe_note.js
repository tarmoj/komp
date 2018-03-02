/*

Autogenerating Music Exercises for education program "Muusika Kompositsiooniõpetus" https://et.wikibooks.org/wiki/Muusika_kompositsiooni%C3%B5petus/N%C3%84IDISKURSUS._G%C3%9CMNAASIUM
Commissioned by Estonian Ministry of Education and Research, Tallinn University,  in the frame of Digital Learning Resources project DigiÕppeVaramu https://htk.tlu.ee/oppevara/


Copyright 2018, by Tarmo Johannes trmjhnns@gmail.com

License: MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/


// Original exercise: 3.5 Helikõrgus    Viiulivõti/Bassivõti. Antud on helikõrgus noodijoonestikul. Kirjelda helikõrguse asukohta noodijoonestikul (mitmendal joonel või mitmendas vahes) ja anna helikõrguse tähtnimetus ja silpnimetus.


function describeNote(clef, containerNode, canvasClassName) {
// variables
	var duration = -1;
	var answered = false;
	var selectedNoteIndex = -1;
	if (clef===undefined) clef = "treble";
	var translation = clef === "treble" ? "viiulivõti" : "bassivõti";
	
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName;
	
	// Create or set necessary HTML elements
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Kirjelda helikõrguse asukohta: " + translation;
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "Antud on helikõrgus noodijoonestikul. Kirjelda helikõrguse asukohta noodijoonestikul (mitmendal joonel või mitmendas vahes) ja anna helikõrguse tähtnimetus ja silpnimetus."; 
	this.containerNode.getElementsByClassName("question")[0].innerHTML =	"Kirjelda noodi asukohta. Mis noot see on?";
	
	var answerString = "";
	var positions = [ // array to describe the note posistions as strings (in Estonian now)
		{position:0,positionString:"joonel"}, 
		{position:1,positionString:"vahes"},
		{position:-1,positionString:"joone all"},
		{position:2,positionString:"joone peal"},
		{position:-10,positionString:"alumisel abijoonel"},
		{position:-11,positionString:"alumise abijoone all"},
		{position:10,positionString:"ülemisel abijoonel"},
		{position:11,positionString:"ülemise abijoone peal"}
		
	];
	var trebleClefNotes = [  // lineOrSpace: 1...5; position: 0 - on the line, 1 -in the space, -1 - under line, 2 - on the line (like g2), -10 - on lower ledger line, -11 under lower ledger line; 10 - on upper ledeger line, 11 - above upper ledger line
		{vtNote:"A/3", name:"a", syllable:"la", lineOrSpace: 2, position:-10 },
		{vtNote:"B/3", name:"h", syllable:"si", lineOrSpace: 1, position:-11 },
		{vtNote:"C/4", name:"c", syllable:"do", lineOrSpace: 1, position:-10 },
		//{vtNote:"C#/4", name:"cis", syllable:"do-diees", line: -1, position:-1 },
		{vtNote:"D/4", name:"d", syllable:"re", lineOrSpace: 1, position:-1 },
		{vtNote:"E/4", name:"e", syllable:"mi", lineOrSpace: 1, position:0 },
		{vtNote:"F/4", name:"f", syllable:"fa", lineOrSpace: 1, position:1 },
		{vtNote:"G/4", name:"g", syllable:"sol", lineOrSpace: 2, position:0 },
		{vtNote:"A/4", name:"a", syllable:"la", lineOrSpace: 2, position:1 },
		{vtNote:"B/4", name:"h", syllable:"si", lineOrSpace: 3, position:0 },
		
		{vtNote:"C/5", name:"c", syllable:"do", lineOrSpace: 3, position:1 },
		{vtNote:"D/5", name:"d", syllable:"re", lineOrSpace: 4, position:0 },
		{vtNote:"E/5", name:"e", syllable:"mi", lineOrSpace: 4, position:1 },
		{vtNote:"F/5", name:"f", syllable:"fa", lineOrSpace: 5, position:0 },
		{vtNote:"G/5", name:"g", syllable:"sol", lineOrSpace: 5, position:2 },
		{vtNote:"A/5", name:"a", syllable:"la", lineOrSpace: 1, position:10 },
		{vtNote:"B/5", name:"h", syllable:"si", lineOrSpace: 1, position:11 },
		{vtNote:"C/6", name:"c", syllable:"do", lineOrSpace: 2, position:10 },
		
	];
	
	var bassClefNotes = [  // lineOrSpace: 1...5; position: 0 - on the line, 1 -in the space, -1 - under line, 2 - on the line (like g2), -10 - on lower ledger line, -11 under lower ledger line; 10 - on upper ledeger line, 11 - above upper ledger line
		{vtNote:"C/2", name:"c", syllable:"do", lineOrSpace: 2, position:-10 },
		{vtNote:"D/2", name:"d", syllable:"re", lineOrSpace: 1, position:-11 },
		{vtNote:"E/2", name:"e", syllable:"mi", lineOrSpace: 1, position:-10 },
		{vtNote:"F/2", name:"f", syllable:"fa", lineOrSpace: 1, position:-1 },
		{vtNote:"G/2", name:"g", syllable:"sol", lineOrSpace: 1, position:0 },
		{vtNote:"A/2", name:"a", syllable:"la", lineOrSpace: 1, position:1 },
		{vtNote:"B/2", name:"h", syllable:"si", lineOrSpace: 2, position:0 },
		{vtNote:"C/3", name:"c", syllable:"do", lineOrSpace: 2, position:1 },
		{vtNote:"D/3", name:"d", syllable:"re", lineOrSpace: 3, position:0 },		
		{vtNote:"E/3", name:"e", syllable:"mi", lineOrSpace: 3, position:1 },
		{vtNote:"F/3", name:"f", syllable:"fa", lineOrSpace: 4, position:0 },
		{vtNote:"G/3", name:"g", syllable:"sol", lineOrSpace: 4, position:1 },
		{vtNote:"A/3", name:"a", syllable:"la", lineOrSpace: 5, position:0 },
		{vtNote:"B/3", name:"h", syllable:"si", lineOrSpace: 5, position:2 },
		{vtNote:"C/4", name:"c", syllable:"do", lineOrSpace: 1, position:10 },
		{vtNote:"D/4", name:"d", syllable:"re", lineOrSpace: 1, position:11 },
		{vtNote:"E/4", name:"e", syllable:"mi", lineOrSpace: 2, position:10 },
		
	];
	
	var notes = clef === "bass" ? bassClefNotes : trebleClefNotes;
	
	function getPositionString(index) {
		var result = notes[index].lineOrSpace + ". ";
		for (var i = 0; i < positions.length; i++) {  // do not use array.find for support of older browsers
			if (positions[i].position === notes[index].position) { 
				result += positions[i].positionString;
				break;
			} 
		}
		//console.log("See noot asub: ", result);
		return result;
	}
	
	// set necessary methods in exercise
	var exercise = new MusicExercise(this.containerNode, this.canvasClassName, 100); // relatively narrow canvas
	exercise.time = ""; // no time signature
	exercise.timeToThink = 25
	exercise.clef = clef;
	
	
	var oldResponse = this.containerNode.getElementsByClassName("response")[0];
	var response = document.createElement("div");
	response.className = "response";
	response.innerHTML = '<br>See noot asub: <select class="lineOrSpace">' +
		'<option value="1">1.</option>' + 
		'<option value="2">2.</option>' +
		'<option value="3">3.</option>' +
		'<option value="4">4.</option>' +
		'<option value="5">5.</option>' +
	'</select>' +
	'<select class="position">' +
		'<option value="0">joonel</option>' +
		'<option value="1">vahes</option>' +
		'<option value="-1">joone all</option>'+  // as d4
		'<option value="2">joone peal</option>' + // as g5
		'<option value="-10">alumisel abijoonel</option>' +
		'<option value="-11">alumise abijoone all</option>' + // as b3
		'<option value="10">ülemisel abijoonel</option>' + // as a5,c6
		'<option value="11">ülemise abijoone peal</option>' + // as b5
	'</select>'; 
	
	// generate options of notenames and syllables
	var select1HTML = "<option>---</option>";
	for (var i = 0; i < 7; i++) { // use 7 steps from bassclefnotes since those begin with c
		var noteName = bassClefNotes[i].name; 
		select1HTML += '<option value="' + noteName + '">' + noteName + '</option>';
	}	
	
	var select2HTML = "<option>---</option>";
	for(var j = 0; j < 7; j++) {
		var syllable = bassClefNotes[j].syllable; 
		select2HTML += '<option value="' + syllable + '">' + syllable + '</option>';
	}	
	
	response.innerHTML += '<br> Noodi nimi tähtnimetusega <select class="noteName">'  + select1HTML + '</select>, ' +
		'silpnimetusega <select class="syllable">' +  select2HTML + '</select><br>';
	
	if (oldResponse === null || oldResponse===undefined) {
		console.log("Creating new response element");
		this.containerNode.getElementsByClassName("responseDiv")[0].appendChild(response)
	} else {
		console.log("Replacing response element");
		this.containerNode.getElementsByClassName("responseDiv")[0].replaceChild(response, oldResponse);
	}
	
	
	exercise.generate = function() {
	
		selectedNoteIndex = Math.floor(Math.random()*notes.length );
				
		while (!exercise.isNewQuestion(selectedNoteIndex)) {
			selectedNoteIndex = Math.floor(Math.random()*notes.length );
			console.log("Found this amoung questions already! Taking new.");
		}
		if (exercise.testIsRunning()) {
			exercise.questions.push(selectedNoteIndex); 
		} else {
			exercise.questions[0] = selectedNoteIndex;
		}
		
		exercise.notes = notes[selectedNoteIndex].vtNote;
		getPositionString(selectedNoteIndex); // late to checkResponse
		
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
		if (parseInt(this.containerNode.getElementsByClassName("lineOrSpace")[0].value) === notes[selectedNoteIndex].lineOrSpace &&
			parseInt(this.containerNode.getElementsByClassName("position")[0].value) === notes[selectedNoteIndex].position) {
			feedback = "Asukoht <b>õige</b>!";
			correct = true;
		} else {
			feedback = "Asukoht <b>vale!</b> Õige asukoht: <b>" + getPositionString(selectedNoteIndex) + "</b>";
			correct = false;
		}
		
		if (this.containerNode.getElementsByClassName("noteName")[0].value.toLowerCase()===notes[selectedNoteIndex].name.toLowerCase()) {
			feedback += " Tähtnimetus <b>õige</b>!";
			correct = correct && true;
		} else {
			feedback += " Tähtnimetus <b>vale</b>! Õige on: <b>"+ notes[selectedNoteIndex].name + "</b>";
			correct = correct && false;
		}
		
		if (this.containerNode.getElementsByClassName("syllable")[0].value.toLowerCase()===notes[selectedNoteIndex].syllable.toLowerCase()) {
			feedback += " Silpnimetus <b>õige</b>!";
			correct = correct && true;
		} else {
			feedback += " Silpnimetus <b>vale</b>! Õige on: <b>"+ notes[selectedNoteIndex].syllable + "</b>";
			correct = correct && false;
		}
		
		if (correct) {
			exercise.score += 1;
		}
		
		this.containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
		this.containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback; 
		answered = true;
		
		if (exercise.testIsRunning) { // add info to test report
			exercise.testReport +=  exercise.currentQuestion.toString() +  '. Küsitud noot: '    + notes[selectedNoteIndex].name  + '. Vastus: '  
				// leave out the position since very troublesome to construct the correct string
				//+ this.containerNode.getElementsByClassName("lineOrSpace")[0].value + " "
				//+ this.containerNode.getElementsByClassName("position")[0].value  + " "
				+ this.containerNode.getElementsByClassName("noteName")[0].value + " "
				+ this.containerNode.getElementsByClassName("syllable")[0].value;
			
			exercise.testReport += ".<br>Tagasiside: " + feedback + "<br>";	
		}
	
	}
	
	return exercise;

}
