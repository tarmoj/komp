// Music exercises for "MUUSIKA KOMPOSITSIOONIÕPETUS"
// TODO: proper credits, copyright

 
// harjutus Harmoonia 2/3 Antud on võtmemärgid. Kirjuta duur/moll-helirea nimetus. 

function nameKey(majorMinor, containerNode, canvasClassName) {		
	// variables
	var keyIndex = -1;
	var answered = false;
	
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName;
	this.majorMinor = majorMinor === undefined ?  "major" : majorMinor;
	var translation = this.majorMinor === "major" ? "duur" : "moll";
	
	// Create or set necessary HTML elements
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Määra helistik";
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "Antud on võtmemärgid. Kirjuta <b>" + translation + "</b>-helirea nimetus"; 
	
	//TODO: check what happens if  response is already there from previous exercise...
	var responseHTML = '<input type="text" class="response" size=4></input> ';
	this.containerNode.getElementsByClassName("question")[0].innerHTML = "See on " + responseHTML +  " " + translation ;
	
	var exercise = new MusicExercise(this.containerNode,this.canvasClassName, 150); // relatively narrow canvas 
	
	
	
	var majorKeys = [  // up to how many accidentals?
		{vtKey:"C", name: "C", type: "major"},
		{vtKey:"G", name: "G", type: "major"},
		{vtKey:"D", name: "D", type: "major"},
		{vtKey:"A", name: "A", type: "major"},
		{vtKey:"E", name: "E", type: "major"},
		{vtKey:"B", name: "H", type: "major"},
		{vtKey:"F#", name: "Fis", type: "major"},
		{vtKey:"C#", name: "Cis", type: "major"},
		//ec
		
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
		//ec
		
	];
	
	var possibleKeys = this.majorMinor === "major" ? majorKeys : minorKeys;
	
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
