// Music exercises for "MUUSIKA KOMPOSITSIOONIÕPETUS"
// TODO: proper credits, copyright


//  1.2.5. Helivältus. Antud on takt ja helivältused. Määra taktimõõt.

	
function findTime(containerNode, canvasClassName) { // generates 1 bar, find suitable time signature
	
	// variables
	var answered = false;
	var selectedTime = ""; 
	//var barlineObject;
	
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName;

	var possibleTimes= ["3/8", "2/4", "3/4", "5/8", "4/4", "5/4", "6/4", "7/8"];
	
	// Create or set necessary HTML elements
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Määra taktimõõt";
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "Antud on takt ja helivältused. Määra taktimõõt."; 
	//TODO: luba ka pause, mitte ainult noodid -  kas vaja?
	this.containerNode.getElementsByClassName("question")[0].innerHTML =	"Sisesta taktimõõt (nt 3/8, 4/4 vms): " + 
	'<input class="response" type="text" style="width:50px"></input>' ;
	
	// set necessary methods in exercise
	var exercise = new MusicExercise(this.containerNode,this.canvasClassName);
	exercise.timeToThink = 20;
	
	function generateBar(numerator, denomenator) { // return vextab string

		var totalDuration = 0; 
		var barLength = numerator/denomenator * 4; // barLength in beats, 6/8 -> 3 beats, grouping like in 6/8 not possible
		console.log(numerator, denomenator, barLength);
		var durations;
		
		do {  // create a rhythm that equals to barLength
			totalDuration = 0;
			durations = [];
			var allowedDurations = [1, 0.5, 0.25]; 
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
		console.log("Generted durations:", durations); // BETTER: create separate function for creating rhytms for a bar
		
		
		// create VexTab string of notes
		var parseString = "";
		var possibleNotes = ["C","D","E","F","G"]; // etc all 12?
		for (var i=0; i<durations.length; i++) {
			var flexDuration = (4/durations[i]).toString();
			//console.log(_duration,flexDuration);
			parseString += " :"+flexDuration + " " + possibleNotes[Math.floor(Math.random()*possibleNotes.length)] +"/4 ";
			
		}
		console.log("Generated notes: ", parseString);
		return parseString; 
		
	}
	
	
	exercise.generate = function() {
				
		exercise.time = ""; // no time signature shown
		this.containerNode.getElementsByClassName("response")[0].value = ""; 
		
		selectedTime = possibleTimes[Math.floor(Math.random()*possibleTimes.length)];
		var numerator = selectedTime.split("/")[0];
		var denomenator =  selectedTime.split("/")[1];
		
		exercise.notes =  generateBar(parseInt(numerator),parseInt(denomenator)) + "=|=";
		answered = false; // necessary to set a flag to check if the quetion has answered already in checkResponse
	
	}
	
	
	exercise.renew();		
	
	exercise.responseFunction = function() {
		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		}
		exercise.attempts += 1;
		var response = this.containerNode.getElementsByClassName("response")[0].value.trim();
		
		if (response === selectedTime) {
			feedback = "<b>Õige!</b>";
			exercise.score += 1;
		} else {
			feedback = "<b>Vale!</b> Õige taktimõõt on :" + selectedTime;
		}
		
		this.containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
		this.containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback; 
		exercise.time = selectedTime; // show right time
		exercise.draw(); // redraw without rectangle
		answered = true;
	}
	
	return exercise;
}
