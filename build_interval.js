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
	
	// descrtion of intervals
	var possibleIntervals = [
		{ shortName: "p1", longName: "puhas priim", semitones: 0, degrees: 0 }, // degrees (astmeid) -  difference in scale degrees (Ces/C/Cis - 0,  Des/D/Dis - 1 etc)
		{ shortName: "v2", longName: "väikes sekund", semitones: 1, degrees: 1 },
		{ shortName: "s2", longName: "suur sekund", semitones: 2, degrees: 1 },
		{ shortName: "v3", longName: "väike terts", semitones: 3, degrees: 2 },
		{ shortName: "s3", longName: "suur terts", semitones: 4, degrees: 2 },
		{ shortName: "p4", longName: "puhas kvart", semitones: 5, degrees: 3 },
		{ shortName: ">4", longName: "suurendatud kvart", semitones: 6, degrees: 3 }, // vähendatud kvint?
		{ shortName: "<5", longName: "vähendatud kvint", semitones: 6, degrees: 4 },
		{ shortName: "p5", longName: "puhas kvint", semitones: 7, degrees: 4 },
		{ shortName: "v6", longName: "väike sekst", semitones: 8, degrees: 5 },
		{ shortName: "s6", longName: "suur sekst", semitones: 9, degrees: 5 },
		{ shortName: "v7", longName: "väike septim", semitones: 10, degrees: 6 },
		{ shortName: "s7", longName: "suur septim", semitones: 11, degrees: 6 },	
		{ shortName: "p8", longName: "puhas oktav", semitones: 12, degrees:  7 },
		
	];
	
	var noInterval = {shortName: "none", longName: "määratlemata", semitones: -1, degrees: -1}; // to be used if nothing found
	
	function findIntervalBySemitones(semitones, degrees) {
		//  degrees -  numbers of scale degrees between the notes
		if (semitones>12) {
			alert("Liiga suur intervall, oktavit ignoreeritaks");
			interval = interval % 12;
		}
		var intervals = [];
		
		for (var i= 0; i<possibleIntervals.length; i++) { 
			if (semitones === possibleIntervals[i].semitones) {
				intervals.push(possibleIntervals[i]); // several intervals can be with same semitones  distance
			}
		}
		
		if (intervals.length === 0) {
			return noInterval;
		}
		
		if (degrees === undefined) {
			return intervals[0]; // first found interval if degrees is not set
		} else {
			for (var j=0; j<intervals.length; j++ ) {
				if (intervals[j].degrees === degrees) {
					return intervals[j];
				}
			}
		}
		
		return noInterval;
	}
	
	function findIntervalByShortName(shortName) {
		for (var i= 0; i<possibleIntervals.length; i++) {
			if (shortName === possibleIntervals[i].shortName) {
				return possibleIntervals[i];
			}
		}
		return noInterval;
	}
	
	function getInterval(note1, note2) { // return interval object and direction
		var semitones = note2.midiNote - note1.midiNote;
		var direction; 
		if (semitones>0) 
			direction = "up";
		else if (semitones==0) 
			direction = "same";
		else
			direction = "down";
		// we need also info about octaves
		var oct1 = Math.floor(note1.midiNote / 12) - 1; // 4 for first octava etc
		var oct2 = Math.floor(note2.midiNote / 12) - 1;
		console.log("oct1, oct2", oct1, oct2,  note2.degree+oct1*7,note1.degree+oct2*7 )
		var degrees = Math.abs((note2.degree+oct2*7) - (note1.degree+oct1*7)); // put the degrees int onw scale, so the difference gives the distance of degrees
		/*if ((note2.degree + note1.degree) >6 ) { // if goves to other octave
			degrees = 7 - degrees;
		}*/ 
		
		var interval = findIntervalBySemitones(Math.abs(semitones), degrees);
		console.log("semitones, degrees, interval, direction", semitones, degrees, interval.longName, direction )
		return {interval: interval, direction: direction};
	}
	
	// set necessary methods in exercise
	var exercise = new MusicExercise(this.containerNode, this.canvasClassName, 150,10,10,1.5); // bigger scale for note input
 	exercise.time = "";
 	exercise.key = "";
	exercise.timeToThink = 30; // more time for doing the test
	
	
	// set clef
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
		possibleNotes = violinClefNotes;
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
			
			// The order of notes must be correct (check for DOWN) -  otherwis accidentals rendered wrongli
			if (direction==="up") {
				exercise.notes = ":w (" +  possibleNotes[noteIndex].vtNote + "." + possibleNotes[currentNoteIndex].vtNote + ")";
			} else {
				exercise.notes = ":w (" +  possibleNotes[currentNoteIndex].vtNote + "." + possibleNotes[noteIndex].vtNote + ")";
			}
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
	
	function makeChord(noteArray) { // noteArray - array of type possibleNotes, to have midiNotes to sort those
		// sort, return vtString (<note>.<note>.<et>)
		if (noteArray.length<2) {
			console.log("Not enough notes for chord");
			return "";
		}
		noteArray.sort(function(a,b) { return a.midiNote - b.midiNote; }  )
		var vtString = "("; // make vextab chord notation
		for (var i=0; i<noteArray.length; i++) {
			if (i>0) vtString += "."; // separator between chord notes 
			vtString += noteArray[i].vtNote;
		}
		vtString += ")"
		console.log("Sorted chord: ", vtString);
		return vtString;
		
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
					exercise.notes = ":w " + makeChord([possibleNotes[currentNoteIndex], possibleNotes[noteIndex]]);
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
		
		var currentInterval = getInterval(possibleNotes[noteIndex], possibleNotes[currentNoteIndex]);
		
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


