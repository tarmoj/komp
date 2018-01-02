// Music exercises for "MUUSIKA KOMPOSITSIOONIÕPETUS"
// TODO: proper credits, copyright

 
// harjutus 1.2.2 "Helivältus. Kirjuta helivältuse nimetus. Antud on helivältus noodikirja märgina (noot või paus). Kirjuta helivältuse nimetus"

function nameDuration(containerNode) {		
	// variables
	var duration = -1;
	var answered = false;
	
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	
	// Create or set necessary HTML elements
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Määra helivältus";
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "Antud on helivältus noodikirja märgina (noot või paus). Leia,  mis vältus see on"; 
	this.containerNode.getElementsByClassName("question")[0].innerHTML =	"Mis vältus see on?";
	
	var exercise = new MusicExercise(this.containerNode,"mainCanvas", 100); // relatively narrow canvas 
	
	var oldResponse = this.containerNode.getElementsByClassName("response")[0];
	var response = document.createElement("select");
	response.className = "response";
	response.innerHTML ='<option value="0" selected>----</option>' +
		'<option value="2">Poolnoot/-paus</option>' +
		'<option value="1">Veerandnoot/-paus</option>' +
		'<option value="0.5">Kaheksandik</option>' +
		'<option value="0.25">Kuueteistkümnendik</option>';		
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
		var isRest = ( Math.random() >=0.5 ); // 50/50% if notr or rest
		console.log("show rest: ", isRest);
		
		// create VexFlow string of notes
		
		var parseString = " :"+flexDuration ;
		parseString += (isRest) ?  " ##" : " B/4"; // add rest or note (B) 
		
		console.log("Generated notes: ", parseString);
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
		if (parseFloat(this.containerNode.getElementsByClassName("response")[0].value)===duration) {
			feedback = "Õige!"
			exercise.score += 1;
		} else {
			var durationString = "";
			switch (duration) {
				case 2:  durationString = "Poolnoot"; break;
				case 1:  durationString = "Veerandnoot"; break;
				case 0.5:  durationString = "Kaheksandik"; break;
				case 0.25:  durationString = "Kuueteistkümnendik"; break;
				default: durationString = "?"; break;
			}
			feedback = "Vale! Õige oli: "+durationString; 
		}
		
		this.containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
		this.containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback; 
		exercise.draw(); // redraw without rectangle
		answered = true;	
	}
	
	return exercise;
		
}
