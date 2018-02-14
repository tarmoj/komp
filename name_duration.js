/*

Autogenerating Music Exercises for education program "Muusika Kompositsiooniõpetus" https://et.wikibooks.org/wiki/Muusika_kompositsiooni%C3%B5petus/N%C3%84IDISKURSUS._G%C3%9CMNAASIUM
Commissioned by Estonian Ministry of Education and Research, Tallinn University,  in the frame of Digital Learning Resources project DigiÕppeVaramu https://htk.tlu.ee/oppevara/


Copyright 2018, by Tarmo Johannes trmjhnns@gmail.com

License: MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

 
// Original exercise: 1.2.2 "Helivältus. Kirjuta helivältuse nimetus. Antud on helivältus noodikirja märgina (noot või paus). Kirjuta helivältuse nimetus"

function nameDuration(containerNode, canvasClassName) {		
	// variables
	var duration = -1;
	var answered = false;
	
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName;
	
	// Create or set necessary HTML elements
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Määra helivältus";
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "Antud on helivältus noodikirja märgina (noot või paus). Leia,  mis vältus see on"; 
	this.containerNode.getElementsByClassName("question")[0].innerHTML =	"Mis vältus see on?";
	
	var exercise = new MusicExercise(this.containerNode,this.canvasClassName, 100, undefined, undefined, undefined, "nosound"); // relatively narrow canvas 
	
	var oldResponse = this.containerNode.getElementsByClassName("response")[0];
	var response = document.createElement("select");
	response.className = "response";
	response.innerHTML ='<option value="0" selected>----</option>' +
		'<option value="2">Poolnoot/-paus</option>' +
		'<option value="1">Veerandnoot/-paus</option>' +
		'<option value="0.5">Kaheksandiknoot/-paus</option>' +
		'<option value="0.25">Kuueteistkümnendiknoot/-paus</option>';		
	if (oldResponse === null || oldResponse === undefined) {
		console.log("Creating new response element");
		this.containerNode.getElementsByClassName("responseDiv")[0]. appendChild(response)
	} else {
		console.log("Replacing response element");
		this.containerNode.getElementsByClassName("responseDiv")[0].replaceChild(response, oldResponse);
	}
	
	// set necessary methods in exercise	
	exercise.time = ""; // no time signature	
	
	exercise.generate = function() {
		var allowedDurations = [2, 1, 0.5, 0.25];
		var tryThis = allowedDurations[Math.floor(Math.random()*allowedDurations.length)];
		while (tryThis === duration) { // to avoid getting the same duration twice in a row
			//console.log("Got the same, retrying");
			tryThis = allowedDurations[Math.floor(Math.random()*allowedDurations.length)];
		}
		duration = tryThis; 
		var flexDuration = (4/duration).toString();
		var isRest = ( Math.random() >=0.5 ); // 50/50% if note or rest
		//console.log("show rest: ", isRest);
		
		// create VexFlow string of notes
		
		var parseString = " :"+flexDuration ;
		parseString += (isRest) ?  " ##" : " B/4"; // add rest or note (B) 
		
		//console.log("Generated notes: ", parseString);
		exercise.notes = parseString;
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
		var durationString = "";
		switch (duration) {
			case 2:  durationString = "Poolnoot"; break;
			case 1:  durationString = "Veerandnoot"; break;
			case 0.5:  durationString = "Kaheksandik"; break;
			case 0.25:  durationString = "Kuueteistkümnendik"; break;
			default: durationString = "?"; break;
		}
		if (parseFloat(this.containerNode.getElementsByClassName("response")[0].value)===duration) {
			feedback = "<b>Õige!</b>"
			exercise.score += 1;
		} else {
			feedback = "<b>Vale!</b> Õige oli: "+durationString; 
		}
		
		this.containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
		this.containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback; 
		exercise.draw(); // redraw without rectangle
		answered = true;
		
		if (exercise.testIsRunning) { // add info to test report
			exercise.testReport +=  exercise.currentQuestion.toString() +  '. Küsitud: '    + durationString  + '. Vastus (löökides): '  + this.containerNode.getElementsByClassName("response")[0].value;
			exercise.testReport += "<br>Tagasiside: " + feedback + "<br>";	
		}	
	}
	
	return exercise;
		
}
