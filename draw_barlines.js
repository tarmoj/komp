// Music exercises for "MUUSIKA KOMPOSITSIOONIÕPETUS"
// TODO: proper credits, copyright


// harjutus  1.2.4. Helivältus. Lisa taktijooned. Antud on taktimõõt ja rida helivältusi. Kirjuta taktijooned vastavalt taktimõõdule õigesse kohta. (Column + MusGen)

//var exercise; should it be declared in the script part of main html?? 
	
function drawBarlines() { // generates 2 bars in given time, hides barlines, on click draws a line an cecks if it is correct (between right notes)
	// variables
	var answered = false;
	var time = "3/4"; // later random or  set by user, better random
	var previousX = 0, nextX = 0; // position of notes before and after barline
	var barlineObject;
	
	// Create or set necessary HTML elements
	document.getElementById("exerciseTitle").innerHTML = "Lisa taktijooned";
	document.getElementById("description").innerHTML = "Antud taktimõõt, taktijooned on peidetud. Kus need peaks asuma?"; 
	//TODO: luba ka pause, mitte ainult noodid -  kas vaja?
	document.getElementById("question").innerHTML =	"Kliki noodijoonestukul kohale, kus peaks asuma taktijoon.";
	
// 	var oldResponse = document.getElementById("response");
// 	var response = document.createElement("select"); 
// 	
// 	response.id = "response";
// 	response.innerHTML =''; 
// 		
// 	if (oldResponse === null) {
// 		console.log("Creating new response element");
// 		document.getElementById("responseDiv"). appendChild(response)
// 	} else {
// 		console.log("Replacing response element");
// 		document.getElementById("responseDiv").replaceChild(response, oldResponse);
// 	}
	
	// set necessary methods in exercise
	exercise = new MusicExercise("mainCanvas");
	exercise.attempts = 0; exercise.score = 0;
	document.getElementById("attempts").innerHTML = "0";
	document.getElementById("score").innerHTML = "0";
	
	function generateBar(numerator, denomenator) { // return vextab string
		
		// pitches -  take random pitches??
		var totalDuration = 0; 
		var barLength = numerator/denomenator * 4; // barLength in beats, 6/8 -> 3 beats
		var durations;
		
		do {  // create a rhythm that equals to barLength
			totalDuration = 0;
			durations = [];
			var allowedDurations = [2, 1, 0.5, 0.25];  // TODO: if 3/8, avoid 2-beats etc
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
		
		
		// create VexFlow string of notes
		
		var parseString = "";
		var possibleNotes = ["C","D","E","F","G"]; // etc all 12
		for (let duration of durations) {
			var flexDuration = (4/duration).toString();
			//console.log(_duration,flexDuration);
			parseString += " :"+flexDuration + " " + possibleNotes[Math.floor(Math.random()*possibleNotes.length)] +"/4 ";
			
		}
		console.log("Generated notes: ", parseString);
		return parseString; 
		
	}
	
	
	exercise.generate = function() {
	
		// generate time signatur first
		var beats = Math.floor(Math.random()*4 + 4); //3/4 .. 7/4
		var time =  beats.toString() +  "/4"
		exercise.time = time;
		
		//TODO: ühtlane paigutus 
		exercise.notes = generateBar(beats,4) + " | "  + generateBar(beats,4);
		answered = false; // necessary to set a flag to check if the quetion has answered already in checkResponse
	
	}
	
	exercise.hide = function() {
		var barLineIndex = -1;
		var notes = exercise.getNotes(0); 
		
		for (var i=0; i<notes.length; i++) {
			if (notes[i].duration==="b") {
				console.log("found barline on index", i)
				barlineObject = exercise.renderer.ctx.svg.getElementsByClassName("vf-stavenote")[i-1].nextSibling; // next to previous vf-stavenote
				
				// hide:
				barlineObject.setAttribute("stroke","none"); // NB! multiple barlines currently not supported!!!
				barlineObject.setAttribute("fill","none");
				
				
				// get positions of previous and next note
				if (i>0 && i<notes.length-1 ) {
					previousX = notes[i-1].getAbsoluteX();
					nextX = notes[i+1].getAbsoluteX();
				}
				
			}
			
		}		
	}
	
	exercise.clickActions = function(x,y) {
		console.log(x,y);
		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		}
		
		exercise.attempts += 1;
		var feedback = "";
		var color = "black";
		
		if (x>= previousX && x<=nextX) {
			feedback = "Õige!"
			exercise.score += 1;
			color = "green";
		} else {
			feedback = "Vale koht!";
			color = "red";
		}
		
		// draw barline where it was clicked with green or red color
		var context = exercise.renderer.getContext();
		var note = exercise.artist.staves[0].note;
		var drawX = x- exercise.canvasX;
		var drawY = barlineObject.y.baseVal.value;
		var height = barlineObject.height.baseVal.value;
		
		context.rect(drawX, drawY, 2, height, { stroke: color,  fill: color});
		
		// and show original barline in blue
		barlineObject.setAttribute("stroke","blue"); 
		barlineObject.setAttribute("fill","blue");
		
		document.getElementById("attempts").innerHTML = exercise.attempts;
		document.getElementById("score").innerHTML = exercise.score;
		document.getElementById("feedback").innerHTML = feedback; 
		//exercise.draw(); // redraw without rectangle
		answered = true;
	}
	
	exercise.generate();		
	exercise.draw();
	exercise.hide();
	
	document.getElementById("renewButton").onclick = function() {
		document.getElementById("feedback").innerHTML = "";
		exercise.generate(); 
		exercise.draw();
		exercise.hide();
	}
	
	exercise.checkResponse = function() {
		//TODO: kontrolli, kas uuendatud, muidu tõstab ainult skoori...
		alert("Kliki noodijoonestikul kohele, kus peaks olema taktijoon");
	
	}
	

}
