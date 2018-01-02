// Music exercises for "MUUSIKA KOMPOSITSIOONIÕPETUS"
// TODO: proper credits, copyright   
    
//    Harmoonia, harjutus 1.8.1  Antud on helistiku nimetus. Kirjuta võtmemärgid. Siin -  kuvatakse 6 märki, vali õige

var subExercise = [];
	

function recognizeKeySignature(containerNode) {
	// variables
	var keysToShow = 4; // TODO: add user control up to how many keys to show
	//var maxAccidentals = 7; // for later use
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	
	
	
	var keys = [
		{vtKey:"C", major: "C-duur", minor: "a-moll"},
		{vtKey:"G", major: "G-duur", minor: "e-moll"},
		{vtKey:"D", major: "D-duur", minor: "h-moll"},
		{vtKey:"A", major: "A-duur", minor: "fis-moll"},
		{vtKey:"E", major: "E-duur", minor: "cis-moll"},
		{vtKey:"B", major: "H-duur", minor: "gis-moll"},
		{vtKey:"F#", major: "Fis-duur", minor: "dis-moll"},
		{vtKey:"C#", major: "Cis-duur", minor: "ais-moll"},
		{vtKey:"F", major: "F-duur", minor: "d-moll"},
		{vtKey:"Bb", major: "B-duur", minor: "g-moll"},
		{vtKey:"Eb", major: "Es-duur", minor: "c-moll"},
		{vtKey:"Ab", major: "As-duur", minor: "f-moll"},
		{vtKey:"Db", major: "Des-duur", minor: "b-moll"},
		{vtKey:"Gb", major: "Ges-duur", minor: "es-moll"},
		{vtKey:"Cb", major: "Ces-duur", minor: "as-moll"}		
	];
	
	function getKeyName(vtKey, isMajor) {
		var result = "Not found";
		for (var i=0; i<keys.length; i++) {
			if (keys[i].vtKey===vtKey) {
				result = (isMajor) ? keys[i].major : keys[i].minor; 
			}
		}
		return result;
	}
	
	
	var selectedKey = {};
	var selectedKeyIndex = -1;
	var correctCanvas = -1;
	var selectedKeysIsMajor = true;
	var answered = false;
	
	// Create or set necessary HTML elements
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Määra helistik.";
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "Antud on helistik. Vali, millised on selle helistiku võtmemärgid."; 
	
	
	
	
	
	// set necessary methods in exercise
	var exercise = new MusicExercise(this.containerNode,"mainCanvas",0); // no width, not staff, player etc
	exercise.time = ""; // no time signature
	
	function checkResponse() { // must be separate function here since must be placed into object as listener's callback
		console.log(selectedKey, this.key);
		
		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		}
		exercise.attempts += 1;
		var feedback = "";
		
		if (this.key == keys[selectedKeyIndex].vtKey) {
			feedback = "Õige!";
			exercise.score +=1;
			//this.artist.staves[0].note.context.attributes.fill = "green";
			this.renderer.ctx.attributes.fill = "green";
		} else {
			console.log("Is major: ", selectedKeysIsMajor);
			var keyName = getKeyName(this.key, selectedKeysIsMajor);
			feedback = "Vale! See on hoopis: " +   keyName;
			this.artist.staves[0].note.context.attributes.fill = "red"
		}
		
		this.containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
		this.containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback; 
		exercise.draw(); // redraw with colours
		answered = true;
		
		if (exercise.testIsRunning() ) {
			exercise.nextQuestion(); 
		}
	
	
	}
	
	//var subExercise = [];
	var container = [];
	for (var i=0;i<keysToShow;i++) {
		container[i] = document.createElement("span");
		var className = "key"+(i+1)
		container[i].className = className;
		exercise.canvas.appendChild(container[i]);
		subExercise[i] = new MusicExercise(this.containerNode,className, 150); 
		//subExercise[i].index = i;
		subExercise[i].time = "";
		subExercise[i].clickActions = checkResponse; // this way it possible to use this.- properties in the function
		
	}
	
	this.containerNode.getElementsByClassName("attempts")[0].innerHTML = "0";
	this.containerNode.getElementsByClassName("score")[0].innerHTML = "0";
	
	
	
	
	exercise.generate = function() {		
		var keyIndexes = []; // indexes
		
		// TODO: kindlusta, et kõik oleks erinevad!
		for (i=0; i<keysToShow; i++) {
			var index = Math.floor(Math.random()* keys.length)
			while (keyIndexes.indexOf(index)>=0) { // avoid repeating of same key
				console.log("We have this key already, taking new.");
				index = Math.floor(Math.random()* keys.length);
			}
			subExercise[i].key = keys[index].vtKey;
			subExercise[i].renderer.ctx.attributes.fill = "black"; // delete green and red, if applied
			keyIndexes[i] = index;
		}
		
		selectedKeyIndex = keyIndexes[Math.floor(Math.random()*keyIndexes.length)]; // one of the keys shown
		selectedKey = keys[selectedKeyIndex].vtKey;
		console.log("Selected: ",selectedKey);
		
		// TODO: võimalda ka minoore, või siis
		selectedKeysIsMajor = (Math.random()>0.5); // randomly 50-50
		var keyName =  getKeyName(selectedKey, selectedKeysIsMajor);
		this.containerNode.getElementsByClassName("question")[0].innerHTML =	"Milline neist on: <b>" + keyName + "</b> (Klõpsa noodijoonestikul)";
		
		
		answered = false; // necessary to set a flag to check if the quetion has answered already in checkResponse
	
	}
	
	exercise.draw = function() {
			subExercise.forEach(function(e) {e.draw()});
	}
	
	exercise.renew();		
	
	
	exercise.checkResponse = function() { // nothing here, real check in checkResponse()
		alert("Klõpsa õigele noodikrjale."); 
	}
	
	return exercise;
		
}
