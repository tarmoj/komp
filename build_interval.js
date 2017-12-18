// Music exercises for "MUUSIKA KOMPOSITSIOONIÕPETUS"
// TODO: proper credits, copyright


// AKORD h 1. harjutus. Viiulivõti. Antud on helikõrgus ja intervalli nimetus. Ehita intervall üles 

//var exercise; should it be declared in the script part of main html?? 


// possibleNotes for treble and bass cled defined in possible_notes.js -  must be included in main html

function buildInterval(clef, direction) { // generates 2 bars in given time, hides barlines, on click draws a line an cecks if it is correct (between right notes)
	if (direction===undefined) direction = "up";
	if (clef===undefined) clef = "treble";
	
	var answered = false;
	var intervalIndex = -1, noteIndex = -1, currentNoteIndex = -1;
	
	
	// descrtion of intervals
	var possibleIntervals = [
		{ shortName: "p1", longName: "puhas priim", semitones: 0 },
		{ shortName: "v2", longName: "väikes sekund", semitones: 1 },
		{ shortName: "s2", longName: "suur sekund", semitones: 2 },
		{ shortName: "v3", longName: "väike terts", semitones: 3 },
		{ shortName: "s3", longName: "suur terts", semitones: 4 },
		{ shortName: "p4", longName: "puhas kvart", semitones: 5 },
		{ shortName: "p4", longName: "suurendatud kvart", semitones: 6 },
		{ shortName: "p5", longName: "puhas kvint", semitones: 7 },
		{ shortName: "v6", longName: "väike sekst", semitones: 8 },
		{ shortName: "s6", longName: "suur sekst", semitones: 9 },
		{ shortName: "v7", longName: "väike septim", semitones: 10 },
		{ shortName: "s7", longName: "suur septim", semitones: 11 },	
		{ shortName: "p8", longName: "puhas oktav", semitones: 12 },
		
	];
	
	function findIntervalBySemitones(semitones) {
		// takend that there is 1 interval by number of semitones. It can be different - for example diminished fifth and augmented fourth; TODO: then return an array, not first found item		
		if (semitones>12) {
			alert("Liiga suur intervall")
			return NaN;
		}
		for (var i= 0; i<possibleIntervals.length; i++) { 
			if (semitones === possibleIntervals[i].semitones) {
				return possibleIntervals[i];
			}
		}
		return NaN;
	}
	
	// set necessary methods in exercise
	exercise = new MusicExercise("mainCanvas",150,10,10,1.5); // bigger scale for note input
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
	document.getElementById("exerciseTitle").innerHTML = "Intervallide ehitamine: " + directionTranslation + ", "  + ( (clef==="bass") ? "bassivõti." : "viiulivõti." );
	document.getElementById("description").innerHTML = "Antud on helikõrgus ja intervalli nimetus. Ehita intervall, klõpsates noodijoonestikule.<br>Alteratsioonimärkide lisamiseks vajuta + või - nupule või kasuta vatavaid klahve arvutklaviatuuril."; 
	
	
	
	function handleAccidental(plusMinus) {  // -1 to lower half tone, +1 to raise halftone
		console.log("handleAccidental", plusMinus, );
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
		document.getElementById("question").innerHTML =	'<br>Sisesta noodijoonestikule <b>' +possibleIntervals[intervalIndex].longName + " " + directionTranslation +  '</b>.<br>Kui oled noodi sisetanud noodijoonestikule, vajuta Vasta:' ;
		
		
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
					console.log("FOUND ", i, possibleNotes[i].vtNote);
					currentNoteIndex = i;
					// The order of notes must be correct -  otherwis accidentals rendered wrong
					// BETTER: check midiNotes, sort by that
					// see about sort https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
					if (direction==="up") {
						exercise.notes = ":w (" +  possibleNotes[noteIndex].vtNote + "." + possibleNotes[currentNoteIndex].vtNote + ")"; // enter as chord of whole notes
					} else {
						exercise.notes = ":w (" +  possibleNotes[currentNoteIndex].vtNote + "." + possibleNotes[noteIndex].vtNote + ")";
					}
					
					//exercise.notes = ":w (" +  possibleNotes[noteIndex].vtNote + "." + possibleNotes[i].vtNote + ")" 

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
		
		var currentInterval = Math.abs(possibleNotes[noteIndex].midiNote - possibleNotes[currentNoteIndex].midiNote);
		console.log("Entered interval in halftones: ", currentInterval )
		
		if (possibleIntervals[intervalIndex].semitones === currentInterval) {
			feedback += "Intervall õige! "
			correct = true;
		} else {
			feedback += "Vale. Sinu sisestatud intervall  on hoopis: <b>" + findIntervalBySemitones(currentInterval).longName + "</b> (arvestades võimalikke enharmoonilisi teisendamisi)"; 
			correct = false;
		}
		
		if (correct) {
			exercise.score += 1;
		}
		
		document.getElementById("attempts").innerHTML = exercise.attempts;
		document.getElementById("score").innerHTML = exercise.score;
		document.getElementById("feedback").innerHTML = feedback; 		
		answered = true;
		
	}
	

}
