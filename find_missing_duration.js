/*

Autogenerating Music Exercises for education program "Muusika Kompositsiooniõpetus" https://et.wikibooks.org/wiki/Muusika_kompositsiooni%C3%B5petus/N%C3%84IDISKURSUS._G%C3%9CMNAASIUM
Commissioned by Estonian Ministry of Education and Research, Tallinn University,  in the frame of Digital Learning Resources project DigiÕppeVaramu https://htk.tlu.ee/oppevara/


Copyright 2018, by Tarmo Johannes trmjhnns@gmail.com

License: MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

// Original exercise: Helivältus. Harjutus. Lisa puuduv vältus

function findMissingDuration(containerNode, canvasClassName) {
	
	// variables
	var hiddenNote = -1, hiddenDuration = -1;
	var answered = false;
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName
	
	// Create or set necessary HTML elements
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Lisa puuduv helivältus";
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "Antud on teatud taktimõõdus takt, milles on peidetud üks helivältus (noot või paus). Lisa puuduv helivältus (noot või paus) // VÕI: arva ära peidetud vältus."; 
	//TODO: luba ka pause, mitte ainult noodid -  kas vaja?
	this.containerNode.getElementsByClassName("question")[0].innerHTML =	"Mis on peidetud noodi vältus?";

		
	// create exercise as local variable, then return it in the end of function
	var exercise = new MusicExercise(this.containerNode, this.canvasClassName); 
	
	var oldResponse = this.containerNode.getElementsByClassName("response")[0];
	var response = document.createElement("select"); 
	
	
	response.id = "response"; 
	response.className = "response";
	response.innerHTML ='<option value="0" selected>----</option>' +
		'<option value="2">Poolnoot</option>' +
		'<option value="1">Veerandnoot</option>' +
		'<option value="0.5">Kaheksandiknoot</option>' +
		'<option value="0.25">Kuueteistkümnendiknoot</option>';
		
	if (oldResponse === null || oldResponse===undefined) {
		console.log("Creating new response element");
		this.containerNode.getElementsByClassName("responseDiv")[0].appendChild(response)
	} else {
		console.log("Replacing response element");
		this.containerNode.getElementsByClassName("responseDiv")[0].replaceChild(response, oldResponse);
	}

	
	
	exercise.generate = function() {
	
		var totalDuration = 0, barLength = 4; // barLength in beats
		var durations;
		var allowedDurations = [2, 1, 0.5, 0.25]; 
	
		do {  // create a rhythm that equals to barLength
			totalDuration = 0;
			durations = [];
			while (totalDuration<=barLength) {                                
				var duration = allowedDurations[Math.floor(Math.random()*allowedDurations.length)];
				
				if ((totalDuration + duration)>barLength) {
					break;
				}
				//console.log("Duration: ", duration);
				durations.push(duration);
				totalDuration += duration;
			}
		} while (totalDuration!=barLength);  // bad code, avoid loop, rather add up random notes and fill the rest with suitable values
		//console.log("Generted durations:", durations); 
		
		
		// create VexFlow string of notes
		hiddenNote = Math.floor(Math.random()*durations.length);
		hiddenDuration = durations[hiddenNote];
		//console.log("Hide the note (index), with duration", hiddenNote, hiddenDuration);
		var parseString = "";
		for (var i=0; i<durations.length; i++) {
			var flexDuration = (4/durations[i]).toString();
			//console.log(_duration,flexDuration);
			parseString += " :"+flexDuration + " B/4 ";
		}
		//console.log("Generated notes: ", parseString);
		exercise.notes = parseString;
		answered = false; // necessary to set a flag to check if the quetion has answered already in checkResponse
	
	}
	
	exercise.hide = function() {
		
		var notes = exercise.getNotes(0); 
		if (hiddenNote>notes.length) {
			console.log("There is not that many notes!", hiddenNote)
			return;
		}
		var note = exercise.artist.staves[0].note_notes[hiddenNote];
		var context = exercise.renderer.getContext();		
		context.rect(note.getAbsoluteX()-10, note.stave.getYForTopText()-10, note.width+20, note.stave.height+10, { fill: 'darkgreen' });
	}
	
	exercise.renew = function() {
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = "";
		exercise.generate();		
		exercise.draw();
		exercise.hide();
	}
	
	exercise.renew();
	
	exercise.responseFunction = function() {

		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		}
		exercise.attempts += 1;
		var feedback = "";
		if (parseFloat(this.containerNode.getElementsByClassName("response")[0].value) === hiddenDuration) {
			feedback = "<b>Õige!</b>"
			exercise.score += 1;
		} else {
			var durationString = "";
			switch (hiddenDuration) {
				case 2:  durationString = "Poolnoot"; break;
				case 1:  durationString = "Veerandnoot"; break;
				case 0.5:  durationString = "Kaheksandiknoot"; break;
				case 0.25:  durationString = "Kuueteistkümnendiknoot"; break;
				default: durationString = "?"; break;
			}
			feedback = "<b>Vale!</b> Õige oli: "+durationString; 
		}
		
		this.containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
		this.containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback; 
		exercise.draw(); // redraw without rectangle
		answered = true;
	
	}
	
	return exercise;
	
}
