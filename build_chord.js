// Music exercises for "MUUSIKA KOMPOSITSIOONIÕPETUS"
// TODO: proper credits, copyright


// AKORD h 5  Viiulivõti/Bassivõti. Antud on helikõrgus ja akordi nimetus. Ehita akord üles/alla. (Column + MusGen)


// possibleNotes for treble and bass clef defined in possible_notes.js -  must be included in main html

function buildChord(clef, direction, containerNode, canvasClassName) { 
	if (direction===undefined) direction = "up";
	if (clef===undefined) clef = "treble";
	
	var answered = false;
	var chordIndex = -1, noteIndex = -1;
	var chord = []; //notes of the chord index 0 always basenote, 1 - second note, 2 -  third note etc
	var currentNoteIndex = [-1,-1,-1,-1];
	var activeNote = 1; // if activeNote==1, insert or change the second note
	
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName;
	
	var intervals = new IntervalClass();
	
	var possibleChords = intervals.possibleChords;
	
	//TODO: move to IntervalClass
	
	
	
	
	// set necessary methods in exercise
	var exercise = new MusicExercise(this.containerNode, this.canvasClassName, 150,10,10,1.5); // bigger scale for note input
 	exercise.time = "";
 	exercise.key = "";
	exercise.timeToThink = 30; // more time for doing the test
	
	
	var possibleChords = intervals.possibleChords;
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
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Akordide ehitamine: " + directionTranslation + ", "  + ( (clef==="bass") ? "bassivõti." : "viiulivõti." );
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "Antud on helikõrgus ja akordi nimetus. Ehita akord, klõpsates noodijoonestikule. Nuppude abil vali, millist akordi nooti sisetad või muudad. <br>Alteratsioonimärkide lisamiseks vajuta + või - nupule või kasuta vatavaid klahve arvutklaviatuuril."; 
	
	
	
	function handleAccidental(plusMinus) {  // -1 to lower half tone, +1 to raise halftone
		//console.log("handleAccidental", plusMinus);
		if (currentNoteIndex[activeNote] > 0) {
			currentNoteIndex[activeNote] += plusMinus;
			if (currentNoteIndex[activeNote]>=possibleNotes.length-1)
				currentNoteIndex[activeNote] = possibleNotes.length-1;
			if (currentNoteIndex[activeNote]<0)
				currentNoteIndex[activeNote] = 0;
			console.log(currentNoteIndex[activeNote], possibleNotes[currentNoteIndex[activeNote]].vtNote);
			chord[activeNote] = possibleNotes[currentNoteIndex[activeNote]];
			exercise.notes =  ":w " +  intervals.makeChord(chord);
			exercise.draw();
		} else {
			alert("Klõpsa esmalt noodi asukohale noodijoonestikul!")
		}
		
	}
	

	document.body.addEventListener('keypress', function (e) { // TODO: how to remove when this function is not used? 
		// TODO: redo on keypressed -  otherwise different reults in different browsers
		e = e || window.event;
		var charCode = e.keyCode || e.which;		
		if ( charCode === 45 && currentNoteIndex[activeNote] >= 0) { // minus key
			handleAccidental(-1);
		}
		if (charCode === 43 && currentNoteIndex[activeNote] >= 0 ) { // plus key
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
	
	
	exercise.setActiveNote = function(value) { // put this into exercise context to be reachable from html element
		activeNote = parseInt(value);
		console.log("Active note: ", activeNote);
	}
	
	var radioDiv = document.createElement("div");
	radioDiv.innerHTML = '<br>Sisetatav/Muudetav noot: ' + 
	'<input type="radio" class="firstButton"  name="activeNote" value="1" onclick="exercise.setActiveNote(this.value)" checked>2</input> ' +
	'<input type="radio" name="activeNote" value="2" onclick="exercise.setActiveNote(this.value)">3</input> ' +
	'<input type="radio" class="lastButton" name="activeNote" value="3" onclick="exercise.setActiveNote(this.value)">4</input> ';
	//exercise.canvas.insertBefore(radioDiv, exercise.canvas.firstChild);
	exercise.canvas.appendChild(radioDiv);
	
	exercise.generate = function() {
				
		chord = [];
		chordIndex = Math.floor(Math.random()* possibleChords.length);
		
		var baseNote = possibleBaseNotes[Math.floor(Math.random()* possibleBaseNotes.length)];
		console.log("Basenote: ", baseNote);		
		
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
		
		chord[0] = possibleNotes[noteIndex]; 
		
		console.log("Selected: ", possibleChords[chordIndex].longName, "from ", possibleNotes[noteIndex].name);
		this.containerNode.getElementsByClassName("question")[0].innerHTML =	'<br>Sisesta noodijoonestikule <b>' +possibleChords[chordIndex].longName + " " + directionTranslation +  '</b>.<br>Kui oled noodid sisetanud noodijoonestikule, vajuta Vasta:' ;
		
		
		exercise.notes = ":w " + possibleNotes[noteIndex].vtNote; // the note the interval is built from
		currentNoteIndex = [-1, -1, -1, -1]; 
		this.containerNode.getElementsByClassName("firstButton")[0].checked = true;
		if (possibleChords[chordIndex].intervalsUp.length < 3) { // disable 4. button if 3 notes in chord
			this.containerNode.getElementsByClassName("lastButton")[0].disabled = true;
		} else {
			this.containerNode.getElementsByClassName("lastButton")[0].disabled = false;
		}
		activeNote = 1;
		answered = false; // necessary to set a flag to check if the quetion has answered already in checkResponse
	
	}
	
	// TOD: listener for active note UI -  when value changed, set activeNote to that
	
	exercise.clickActions = function(x,y) {
		var line = exercise.artist.staves[0].note.getLineForY(y);		
		// find note by line
		line =  Math.round(line*2)/2; // round to neares 0.5
		for (var i= 0; i<possibleNotes.length;i++) {
			if (possibleNotes[i].hasOwnProperty("line") ) {
				//console.log(i, possibleNotes[i].line, line)
				if (possibleNotes[i].line === line) {
					//console.log("FOUND ", i, possibleNotes[i].vtNote);
					currentNoteIndex[activeNote] = i;
					chord[activeNote] = possibleNotes[i];
					exercise.notes = ":w " + intervals.makeChord(chord);
					exercise.draw();
					break;
				}
			}
		}
	}
	
	exercise.renew();		
	
	exercise.responseFunction = function() {
		if (currentNoteIndex[1] == -1) {
			alert("Akordi 2. noot sisestamata!")
			return;
		}
		
		if (currentNoteIndex[2] == -1) {
			alert("Akordi 3. noot sisestamata!")
			return;
		}
		
		if ( possibleChords[chordIndex].intervalsUp.length >= 3 && currentNoteIndex[3] == -1) {
			alert("Akordi 4. noot sisestamata!")
			return;
		}
		
		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		}
		
		exercise.attempts += 1;
		var feedback = "";
		var correct = false;
		
		var interval1 = intervals.getInterval(chord[0],chord[1]).interval; // ignore the direction, probably right
		var interval2 = intervals.getInterval(chord[0],chord[2]).interval;
		var interval3 = undefined;
		// TODO: 4-note chords
		if (currentNoteIndex[3] != -1 ) { // 4-note chord
			var interval3 = intervals.getInterval(chord[0],chord[3]).interval;
		}
		
		var rightIntervals = [];
		if (direction==="up") {
			rightIntervals = possibleChords[chordIndex].intervalsUp;
		} else {
			rightIntervals = possibleChords[chordIndex].intervalsDown;
		}
		
		
		if (interval1.shortName===rightIntervals[0] && interval2.shortName===rightIntervals[1]) { 
			correct = true;
			if (interval3 != undefined) {
				if (interval3.shortName !== rightIntervals[2] ) {
					correct = false;
				}
			}
		} else {
			correct = false;
		}
		
		if (correct) {
			feedback += "<b>Akord õige! </b>"
			exercise.score += 1;
		} else {
			feedback += "<b>Vale.</b>. Õige akord on kuvatud järgmises taktis"; 
			// form righ chord to show
			var correctChord = [possibleNotes[noteIndex]];
			correctChord.push(intervals.makeInterval(possibleNotes[noteIndex], rightIntervals[0], direction, possibleNotes  ));
			correctChord.push(intervals.makeInterval(possibleNotes[noteIndex], rightIntervals[1], direction, possibleNotes  ));
			if (possibleChords[chordIndex].intervalsUp.length >= 3) {
				correctChord.push(intervals.makeInterval(possibleNotes[noteIndex], rightIntervals[2], direction, possibleNotes  ));
			}
			
			exercise.notes += " | :w " + intervals.makeChord(correctChord); // show the right chord in second bar
			exercise.draw(); 
		}
		
		this.containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
		this.containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback; 		
		answered = true;
		
	}
	
	return exercise;

}
