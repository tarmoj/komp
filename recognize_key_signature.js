// Music exercises for "MUUSIKA KOMPOSITSIOONIÕPETUS"
// TODO: proper credits, copyright   
    
//    Harmoonia, harjutus 1.8.1  Antud on helistiku nimetus. Kirjuta võtmemärgid. Siin -  kuvatakse 6 märki, vali õige

var subExercise = [];

function testMe(index) {"I was called from ", index;};
	

function recognizeKeySignature() {
	// variables
	var keysToShow = 4;
	var maxAccidentals = 7; // for later use
	
	// TODO: add user control up to how many 
	// maybe better array of objects {estMajor: "B duur", estMinor {"g moll"},  }
	var possibleKeys = ["C","G","G","D","Bb", "A", "Eb", "E", "Ab", "B", "Db", "F#", "Gb", "C#", "Cb"];
	var selectedKey = "";
	var maxAccidentals = 4;
	var answered = false;
	
	// Create or set necessary HTML elements
	document.getElementById("exerciseTitle").innerHTML = "Määra helistik. NB! POOLELI!";
	document.getElementById("description").innerHTML = "Antud on helistik. Vali, millised on selle helistiku võtmemärgid."; 
	
	
	
	
	
	// set necessary methods in exercise
	exercise = new MusicExercise("mainCanvas",0); // no width
	exercise.time = ""; // no time signature
	//exercise.
	
	function checkResponse() { // must be separate function here since must be placed int object as listener's callback
		console.log(selectedKey);
		console.log(this.key);
			
		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		}
		exercise.attempts += 1;
		var feedback = "";
		
		if (this.key == selectedKey) {
			feedback = "Õige!";
			exercise.score +=1;
			// TODO taust punaseks vms?
		} else {
			feedback = "Vale! See on hoopis: " + this.key;
		}
		
		// TODO vastamine hiireklikiga joonisel
		
		
		document.getElementById("attempts").innerHTML = exercise.attempts;
		document.getElementById("score").innerHTML = exercise.score;
		document.getElementById("feedback").innerHTML = feedback; 
		exercise.draw(); // redraw without rectangle
		answered = true;
	
	
	}
	
	//var subExercise = [];
	var container = [];
	for (var i=0;i<keysToShow;i++) {
		container[i] = document.createElement("span");
		var id = "key"+(i+1)
		container[i].id = id;
		exercise.canvas.appendChild(container[i]);
		subExercise[i] = new MusicExercise(id, 150);
		subExercise[i].index = i;
		subExercise[i].time = "";
		subExercise[i].clickActions = checkResponse;
		//subExercise[i].handleClick = function() {console.log(this.canvas.id);};
		//subExercise[i].renderer.getContext().svg.addEventListener('click', subExercise[i].handleClick;// renew the listener
		
	
		
	}
	
	document.getElementById("attempts").innerHTML = "0";
	document.getElementById("score").innerHTML = "0";
	
	
	
	
	exercise.generate = function() {
		var possibleKeys = ["C","G","G","D","Bb", "A", "Eb", "E", "Ab", "B", "Db", "F#", "Gb", "C#", "Cb"];
		
		
		/*var key  = possibleKeys[Math.floor(Math.random()*possibleKeys.length)];
		while (key === selectedKey) { // to avoid getting the same duration twice in a row
			//console.log("Got the same, retrying");
			key = possibleKeys[Math.floor(Math.random()*possibleKeys.length)];
		}
		selectedKey = key;*/ 
		// TODO: kindlusta, et kõik oleks erinevad!
		for (i=0; i<keysToShow; i++) {
			subExercise[i].key = possibleKeys[Math.floor(Math.random()*possibleKeys.length)];
		}
		
		selectedKey = subExercise[Math.floor(Math.random()*keysToShow)].key;
		console.log("Selected: ",selectedKey);
		
		// TODO: eesti keelde!
		document.getElementById("question").innerHTML =	"Milline neist on: <b>" + selectedKey + "</b> (Klõpsa noodijoonestikul)";
		
		
		answered = false; // necessary to set a flag to check if the quetion has answered already in checkResponse
	
	}
	
	exercise.draw = function() {
			subExercise.forEach(function(e) {e.draw()});
	}
	
	exercise.generate();		
	exercise.draw();
	
	document.getElementById("renewButton").onclick = function() {
		exercise.generate(); 
		exercise.draw();
	}
	
	exercise.checkResponse = function() { // nothing here, real check by key clicks
		alert("Klõpsa õigele noodikrjale."); 
	}
		
}
