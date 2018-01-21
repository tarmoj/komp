// Music exercises for "MUUSIKA KOMPOSITSIOONIÕPETUS"
// TODO: proper credits, copyright


// AKORD h 1. harjutus. Viiulivõti. Antud on helikõrgus ja intervalli nimetus. Ehita intervall üles 

//var exercise; should it be declared in the script part of main html?? 


// possibleNotes for treble and bass cled defined in possible_notes.js -  must be included in main html

function buildInterval(clef, direction, containerNode, canvasClassName) { 
	if (direction===undefined) direction = "up";
	if (clef===undefined) clef = "treble";
	
	var answered = false;
	var intervalIndex = -1, noteIndex = -1, currentNoteIndex = -1;
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName;
	
	var intervals = new IntervalClass();
	var notes = new NoteClass();
	
	
	// set necessary methods in exercise
	var exercise = new MusicExercise(this.containerNode, this.canvasClassName, 150,10,10,1.5); // bigger scale for note input
 	exercise.time = "";
 	exercise.key = "";
	exercise.timeToThink = 30; // more time for doing the test
	
	
	var possibleIntervals = intervals.possibleIntervals;
	var possibleNotes = [];
	var possibleBaseNotes = [];
	//var lowLimit= 10, highLimit = 35; // to set range from which to take the random note to build interval from
	if (clef==="bass" ) { // && direction == "up"
		exercise.clef ="bass"
		possibleNotes = bassClefNotes;
		if (direction.toLowerCase()==="up") {
			possibleBaseNotes =  ["F/2", "G/2", "A/2", "B/2", "C/3", "D/3"];
		} else {
			possibleBaseNotes =  ["F/3", "G/3", "A/3", "B/3", "C/4"];
		}
	} else {
		exercise.clef = "treble"
		possibleNotes = notes.violinClefNotes;
		if (direction.toLowerCase()==="up") {
			possibleBaseNotes =  ["C/4", "D/4", "E/4", "F/4", "G/4", "A/4"]; 
		} else {
			possibleBaseNotes =  ["C/5", "D/5", "E/5", "F/5", "G/5", "A/5"];
		}
	}
	
	
	// Create or set necessary HTML elements
	var directionTranslation = (direction==="up") ? "üles" : " alla" ;
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Intervallide ehitamine: " + directionTranslation + ", "  + ( (clef==="bass") ? "bassivõti." : "viiulivõti." );
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "Antud on helikõrgus ja intervalli nimetus. Ehita intervall, klõpsates noodijoonestikule.<br>Alteratsioonimärkide lisamiseks vajuta + või - nupule või kasuta vatavaid klahve arvutklaviatuuril."; 
	
	
	
	function handleAccidental(plusMinus) {  // -1 to lower half tone, +1 to raise halftone
		//console.log("handleAccidental", plusMinus);
		if (currentNoteIndex > 0) {
			currentNoteIndex += plusMinus;
			if (currentNoteIndex>=possibleNotes.length-1)
				currentNoteIndex = possibleNotes.length-1;
			if (currentNoteIndex<0)
				currentNoteIndex = 0;
			console.log(currentNoteIndex, possibleNotes[currentNoteIndex].vtNote)
			exercise.notes = ":w " + intervals, makeChord([possibleNotes[noteIndex], possibleNotes[currentNoteIndex]]);
			exercise.draw();
			
		} else {
			alert("Klõpsa esmalt noodi asukohale noodijoonestikul!")
		}
		
	}
	

	document.body.addEventListener('keypress', function (e) { // TODO: how to remove when this function is not used? 
		// TODO: redo on keypressed -  otherwise different reults in different browsers
		e = e || window.event;
		var charCode = e.keyCode || e.which;		
		if ( charCode === 45 && currentNoteIndex >= 0) { // minus key
			handleAccidental(-1);
		}
		if (charCode === 43 && currentNoteIndex >= 0 ) { // plus key
			handleAccidental(1);
		}
		
	}, false);
	
	var diesisButton = document.createElement("button");
    diesisButton.innerHTML = "+";
    diesisButton.onclick = function(){handleAccidental(1)};
    exercise.canvas.appendChild(diesisButton);
	
	var bemolleButton = document.createElement("button");
    bemolleButton.innerHTML = "-";
    bemolleButton.onclick = function(){handleAccidental(-1)};
    exercise.canvas.appendChild(bemolleButton);
	
	
	exercise.generate = function() {
				
		intervalIndex = Math.floor(Math.random()* possibleIntervals.length);
		
		var baseNote = possibleBaseNotes[Math.floor(Math.random()* possibleBaseNotes.length)];
		console.log("Basenote: ", baseNote );
		
		//find according noteIndex from possibleNotes: TODO: add this as function to possible_notes.js, that perhaps should be part of baseclass...
		noteIndex = -1;
		for (var i=0;i<possibleNotes.length;i++) {
			if (possibleNotes[i].vtNote === baseNote) {
				noteIndex = i;
				break;
			}
		}
		
		if (noteIndex==-1) {
			console.log("Generation failed. Could not find ", baseNote, "in possibleNotes");
			return;
		}
		
		console.log("Selected: ", possibleIntervals[intervalIndex].longName, "from ", possibleNotes[noteIndex].name);
		this.containerNode.getElementsByClassName("question")[0].innerHTML =	'<br>Sisesta noodijoonestikule <b>' +possibleIntervals[intervalIndex].longName + " " + directionTranslation +  '</b>.<br>Kui oled noodi sisetanud noodijoonestikule, vajuta Vasta:' ;
		
		
		exercise.notes = ":w " + possibleNotes[noteIndex].vtNote; // the note the interval is built from
		currentNoteIndex = -1; 	
		answered = false; // necessary to set a flag to check if the quetion has answered already in checkResponse
	
	}
	
	
	
	exercise.clickActions = function(x,y) {
		// console.log(x,y);		

		var line = exercise.artist.staves[0].note.getLineForY(y);
		
		// find note by line
		line =  Math.round(line*2)/2; // round to neares 0.5
		for (var i= 0; i<possibleNotes.length;i++) {
			if (possibleNotes[i].hasOwnProperty("line") ) {
				//console.log(i, possibleNotes[i].line, line)
				if (possibleNotes[i].line === line) {
					//console.log("FOUND ", i, possibleNotes[i].vtNote);
					currentNoteIndex = i;
					exercise.notes = ":w " + intervals.makeChord([possibleNotes[currentNoteIndex], possibleNotes[noteIndex]]);
					exercise.draw();
					break;
				}
			}
		}
	}
	
	exercise.renew();		
	
	exercise.responseFunction = function() {
		if (currentNoteIndex < 0) {
			alert("Sisesta noot noodijoonestikule!")
			return;
		}
		
		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		}
		
		exercise.attempts += 1;
		var feedback = "";
		var correct = false;
		
		var currentInterval = intervals.getInterval(possibleNotes[noteIndex], possibleNotes[currentNoteIndex]);
		
		if (possibleIntervals[intervalIndex].shortName === currentInterval.interval.shortName && ( currentInterval.direction === direction || currentInterval.direction === "same") ) { 
			feedback += "<b>Intervall õige! </b>"
			correct = true;
		} else {
			var directionString = "";
			if (currentInterval.direction==="up") directionString = "üles";
			if (currentInterval.direction==="down") directionString = "alla";
			// nothing if same
			feedback += "<b>Vale.</b> Sinu sisestatud intervall  on hoopis: <b>" + currentInterval.interval.longName + "  " + directionString + "</b>"; 
			correct = false;
		}
		
		if (correct) {
			exercise.score += 1;
		}
		
		this.containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
		this.containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback; 		
		answered = true;
		
	}
	
	return exercise;

}
