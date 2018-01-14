// Music exercises for "MUUSIKA KOMPOSITSIOONIÕPETUS"
// TODO: proper credits, copyright

 
// harjutus 1.2.2 "Helikõrgus 15 harjutus. Helikõrgus. Enharmonism. Antud on helikõrgus tähtnimetusega, silpnimetusega, noodijoonestikul. Kirjuta enharmoonilised helid 
//  Find enharmonic notes, display one, ask other

function enharmonism(nameOrSyllable, containerNode, canvasClassName) {		
	// variables
	var selectedNotes = [];
	var answered = false;
	var askFor = "", correctAnswer = "";
	
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName;
	nameOrSyllable = (nameOrSyllable === undefined) ? "name" : nameOrSyllable;
	
	// Create or set necessary HTML elements
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Enharmonism";
	var translation1 = nameOrSyllable === "name" ? "tähtnimetusena" : "silpnimetusena"
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "Antud on heliõrgus " + translation1 + ". Leia sellele enharmooniliselt vastav noot (dubldieese ja dublbemolle pole kasutatud.)"; 
	this.containerNode.getElementsByClassName("question")[0].innerHTML =	'Noodile  X vastab: '; 
	
	var exercise = new MusicExercise(this.containerNode,this.canvasClassName, 150); // relatively narrow canvas 
	
	var oldResponse = this.containerNode.getElementsByClassName("response")[0];
	var response = document.createElement("input");
	response.type = "text";
	response.size = "4";
	//response.innerHTML ='<input type="text" size=4"></input><br>';		
	response.className = "response";
	
	if (oldResponse === null || oldResponse === undefined) {
		console.log("Creating new response element");
		this.containerNode.getElementsByClassName("responseDiv")[0]. appendChild(response)
	} else {
		console.log("Replacing response element");
		this.containerNode.getElementsByClassName("responseDiv")[0].replaceChild(response, oldResponse);
	}
	
	// set necessary methods in exercise	
	exercise.time = ""; // no time signature
	
	var enharmonicNotes = [ ["C/5","B#/4"], ["C@/5", "B/4"], ["E#/4", "F/4"], ["F@/4", "E/4"]]; // later find names and syllables by vtNote
	
	
	exercise.generate = function() {
		var tryThis = enharmonicNotes[Math.floor(Math.random()*enharmonicNotes.length)];
		while (tryThis === selectedNotes) { // to avoid getting the same duration twice in a row
			//console.log("Got the same, retrying");
			tryThis = enharmonicNotes[Math.floor(Math.random()*enharmonicNotes.length)];
		}
		
		 		
		var dice = Math.random(); // which one of those to display first
		if (dice>0.5) {
			selectedNotes = [tryThis[0], tryThis[1]]; // randomize the order
		} else {
			selectedNotes = [tryThis[1], tryThis[0]];
		}
		
		console.log("Selected notes: ", selectedNotes);
		
		if (nameOrSyllable === "syllable") {
			askFor = findNoteByVtNote(selectedNotes[0], violinClefNotes).syllable;
			correctAnswer = findNoteByVtNote(selectedNotes[1], violinClefNotes).syllable;
		} else {
			askFor = findNoteByVtNote(selectedNotes[0], violinClefNotes).name;
			correctAnswer = findNoteByVtNote(selectedNotes[1], violinClefNotes).name;
		}
		askFor = removeLastDigit(askFor); // remove octave number, if present
		correctAnswer = removeLastDigit(correctAnswer);
		
		
		console.log(askFor, correctAnswer);
		
		this.containerNode.getElementsByClassName("question")[0].innerHTML = 'Noodile <b>' + askFor +
 		'</b> vastab enharmooniliselt: ' ;
		
		// TODO: kuva esimene noot
		exercise.notes = ":4 " + selectedNotes[0];
		
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
		var answer = this.containerNode.getElementsByClassName("response")[0].value;
		if (answer === correctAnswer) {
			feedback = "<b>Õige!</b>"
			exercise.score += 1;
		} else {
			feedback = "<b>Vale!</b> Õige oli: "+ correctAnswer; 
		}
		
		this.containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
		this.containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback; 
		exercise.notes += " :4 " + selectedNotes[1]; // show also the other
		exercise.draw(); // redraw without rectangle
		answered = true;	
	}
	
	return exercise;
		
}
