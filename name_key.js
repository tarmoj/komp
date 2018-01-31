/*

Autogenerating Music Exercises for education program "Muusika Kompositsiooniõpetus" https://et.wikibooks.org/wiki/Muusika_kompositsiooni%C3%B5petus/N%C3%84IDISKURSUS._G%C3%9CMNAASIUM
Commissioned by Estonian Ministry of Education and Research, Tallinn University,  in the frame of Digital Learning Resources project DigiÕppeVaramu https://htk.tlu.ee/oppevara/


Copyright 2018, by Tarmo Johannes trmjhnns@gmail.com

License: MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

// Original: Harmoonia 2&3 Antud on võtmemärgid. Kirjuta duur/moll-helirea nimetus. 

function nameKey(majorMinor, containerNode, canvasClassName) {		
	// variables
	var keyIndex = -1;
	var answered = false;
	
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName;
	this.majorMinor = majorMinor === undefined ?  "major" : majorMinor;
	var translation = this.majorMinor === "major" ? "duur" : "moll";
	
	
	
	var majorKeys = [  // up to how many accidentals?
		{vtKey:"C", name: "C", type: "major"},
		{vtKey:"G", name: "G", type: "major"},
		{vtKey:"D", name: "D", type: "major"},
		{vtKey:"A", name: "A", type: "major"},
		{vtKey:"E", name: "E", type: "major"},
		{vtKey:"B", name: "H", type: "major"},
		{vtKey:"F#", name: "Fis", type: "major"},
		{vtKey:"C#", name: "Cis", type: "major"},
		
		{vtKey:"F", name: "F", type: "major"},
		{vtKey:"Bb", name: "B", type: "major"},
		{vtKey:"Eb", name: "Es", type: "major"},
		{vtKey:"Ab", name: "As", type: "major"},
		{vtKey:"Db", name: "Des", type: "major"},
		{vtKey:"Gb", name: "Ges", type: "major"},
		{vtKey:"Cb", name: "Ces", type: "major"}
		
	];
	
	var minorKeys = [  // up to how many accidentals?
		{vtKey:"C", name: "a", type: "minor"},
		{vtKey:"G", name: "e", type: "minor"},
		{vtKey:"D", name: "h", type: "minor"},
		{vtKey:"A", name: "fis", type: "minor"},
		{vtKey:"E", name: "cis", type: "minor"},
		{vtKey:"B", name: "gis", type: "minor"},
		{vtKey:"F#", name: "dis", type: "minor"},
		{vtKey:"C#", name: "ais", type: "minor"},
		
		{vtKey:"F", name: "d", type: "minor"},
		{vtKey:"Bb", name: "g", type: "minor"},
		{vtKey:"Eb", name: "c", type: "minor"},
		{vtKey:"Ab", name: "f", type: "minor"},
		{vtKey:"Db", name: "b", type: "minor"},
		{vtKey:"Gb", name: "es", type: "minor"},
		{vtKey:"Cb", name: "as", type: "minor"}
		
	];
	
	var possibleKeys = (this.majorMinor === "major") ? majorKeys : minorKeys;
	
	
	
	// Create or set necessary HTML elements
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Määra helistik";
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "Antud on võtmemärgid. Kirjuta <b>" + translation + "</b>-helirea nimetus"; 
	
	//TODO: check what happens if  response is already there from previous exercise...
	var responseHTML = 'See on <select class="response"> <option value="">---</option>';
	for (var a=0; a<possibleKeys.length; a++) {
		responseHTML += '<option value="' + possibleKeys[a].name + '">' + possibleKeys[a].name + '</option>'; 
	}
	
	responseHTML += '</select> ' + translation;
	this.containerNode.getElementsByClassName("question")[0].innerHTML = responseHTML;
	
	var exercise = new MusicExercise(this.containerNode,this.canvasClassName, 150, undefined, undefined, undefined, "nosound"); // relatively narrow canvas 
	
	
	// set necessary methods in exercise	
	exercise.time = ""; // no time signature	
	
	exercise.generate = function() {
		
		var tryThis = Math.floor(Math.random()*possibleKeys.length);
		while (tryThis===keyIndex)  {// avoid repeating
			tryThis = Math.floor(Math.random()*possibleKeys.length);
		}
		keyIndex = tryThis;
		console.log("Selected key: ", possibleKeys[keyIndex].name);
		
		exercise.key = possibleKeys[keyIndex].vtKey;
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
		if (this.containerNode.getElementsByClassName("response")[0].value.toLowerCase() === possibleKeys[keyIndex].name.toLowerCase() ) {
			feedback = "<b>Õige!</b>";
			exercise.score += 1;
		} else {
			feedback = "<b>Vale!</b> Õige oli: " + possibleKeys[keyIndex].name + " " + translation; 
		}
		
		this.containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
		this.containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback; 
		answered = true;	
	}
	
	return exercise;
		
}
