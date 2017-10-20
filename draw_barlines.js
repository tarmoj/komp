// Music exercises for "MUUSIKA KOMPOSITSIOONIÕPETUS"
// TODO: proper credits, copyright


// harjutus  1.2.4. Helivältus. Lisa taktijooned. Antud on taktimõõt ja rida helivältusi. Kirjuta taktijooned vastavalt taktimõõdule õigesse kohta. (Column + MusGen)

//var exercise; should it be declared in the script part of main html?? 
	
function drawBarlines() { // generates 2 bars in given time, hides barlines, on click draws a line an cecks if it is correct (between right notes)
	// variables
	var answered = false;
	var time = "3/4"; // later random or  set by user, better random
	
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
	
		// TODO: generate time signatur first
		var time = "3/4"
		exercise.time = time;
		
		exercise.notes = generateBar(3,4) + " | "  + generateBar(3,4);
		answered = false; // necessary to set a flag to check if the quetion has answered already in checkResponse
	
	}
	
	exercise.hide = function() {
		var barLineIndex = -1;
		var notes = exercise.getNotes(0); 
		var previousX = 0, nextX = 0; // to main scope
		var barlineObjects = []; // move to global
		for (var i=0; i<notes.length; i++) {
			if (notes[i].duration==="b") {
				console.log("fond barline on index", i)
				var bl = exercise.renderer.ctx.svg.getElementsByClassName("vf-stavenote")[i-1].nextSibling; // next to previous vf-stavenote
				console.log(bl);
				barlineObjects.push(bl); // later work it through below, since there can be several barlines
				
				bl.setAttribute("stroke","none"); // hide the barline
				bl.setAttribute("fill","none");
				// for hiding maybe: exercise.artist.staves[0].tab_notes[4].setGhost(true)
				// but seems it is not valid for barlines... and does not work...
				
				// TO HIDE: find the svg element exercise.renderer.ctx.svg.childNodes ->  findChildren vf-stavenote, peale seda rect mis eelneva ja järgneva vahel, muuda selle fill ja stroke -> none või transparent; taastamiseks "black"
				
				// CANNOT HIDE YET, vexflow seems to offer no way, look for SVG (find Chid vms)
				// OR correct porperty of the notes[i] object // can be also tabnote, perhaps
				if (i>0 && i<notes.length-1 ) {
					previousX = notes[i-1].getAbsoluteX();
					nextX = notes[i+1].getAbsoluteX();
				}
				// go through svg elements, find the rect for barline and set it to invisible
				//maybe: exercise.renderer.ctx.svg.getElementsByClassName("vf-stavenote")[barLineIndex-1].nextSibling
		
				
			}
			
		}
		
		
// 		if (hiddenNote>notes.length) {
// 			console.log("There is not that many notes!", hiddenNote)
// 			return;
// 		}
// 		var note = exercise.artist.staves[0].note_notes[hiddenNote];
// 		var context = exercise.renderer.getContext();
// 		//context.setFillStyle("darkgreen"); // <- for canvas
// 		//context.fillRect(note.getAbsoluteX()-10, note.stave.getYForTopText()-10, note.width+20, note.stave.height+10);
// 		context.rect(note.getAbsoluteX()-10, note.stave.getYForTopText()-10, note.width+20, note.stave.height+10, { fill: 'darkgreen' });
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
		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		}
		exercise.attempts += 1;
		var feedback = "";
		if (parseFloat(document.getElementById("response").value)===hiddenDuration) {
			feedback = "Õige!"
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
			feedback = "Vale! Õige oli: "+durationString; // TODO 0.25-> Kuueteistkümnendik jne
		}
		
		
		document.getElementById("attempts").innerHTML = exercise.attempts;
		document.getElementById("score").innerHTML = exercise.score;
		document.getElementById("feedback").innerHTML = feedback; 
		exercise.draw(); // redraw without rectangle
		answered = true;
	
	}
	

}
