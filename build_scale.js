/*

Autogenerating Music Exercises for education program "Muusika Kompositsiooniõpetus" https://et.wikibooks.org/wiki/Muusika_kompositsiooni%C3%B5petus/N%C3%84IDISKURSUS._G%C3%9CMNAASIUM
Commissioned by Estonian Ministry of Education and Research, Tallinn University,  in the frame of Digital Learning Resources project DigiÕppeVaramu https://htk.tlu.ee/oppevara/


Copyright 2018, by Tarmo Johannes trmjhnns@gmail.com

License: MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

// Original: HARMOONIA h 4 harjutus. Kirjuta antud helist duur/loomulik moll/harmooniline moll / meloodiline moll-helirida üles. 


function buildScale(scale, containerNode, canvasClassName) { // scale: major|natural|harmonic|melodic 
	if (scale===undefined) direction = "major";
	
	var answered = false;
	var scaleIndex = -1, noteIndex = -1, activeNote = -1;
	var currentNoteIndex = [-1,-1,-1,-1,-1,-1,-1,-1];
	var scaleNotes = []; // vtNotes of the inserted notes
	var editNote = -1, lastActiveNote = -1;
	
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName;
	
	var intervals = new IntervalClass();
	var notes = new NoteClass();
	
	
	// set necessary methods in exercise
	var exercise = new MusicExercise(this.containerNode, this.canvasClassName, 500,10,10,1.5); // bigger scale for note input
 	exercise.time = "";
 	exercise.key = "";
	exercise.timeToThink = 30; // more time for doing the test
	
	
	var possibleScales = [ 
		{ name: "major", translation: "mažoor", intervals: ["p1", "s2", "s3", "p4", "p5", "s6", "s7", "p8"  ] },  
		{ name: "natural", translation: "loomulik minoor", intervals: ["p1", "s2", "v3", "p4", "p5", "v6", "v7", "p8"  ] }, 
		{ name: "harmonic", translation: "harmooniline minoor", intervals: ["p1", "s2", "v3", "p4", "p5", "v6", "s7", "p8"  ] },
		{ name: "melodic", translation: "meloodiline minoor", intervals: ["p1", "s2", "v3", "p4", "p5", "s6", "s7", "p8"  ] },
 	];
	
	var possibleIntervals = intervals.possibleIntervals;
	var possibleNotes = notes.violinClefNotes;
	var possibleBaseNotes = ["C/4", "D/4", "E/4", "F/4", "G/4", "A/4"];  // TODO: different notes depending on major/minor
	
	
	// Create or set necessary HTML elements
	//var directionTranslation = (direction==="up") ? "üles" : " alla" ;
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Heliridade ehitamine.";
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "Kirjuta antud  helist antud helirida üles. Sisesta noodid noodijoonestikule. <br>Kui soovid sisestatud nooti muuta, siis selle aktiveerimiseks/deaktiveerimiseks klõpsa noodile.<br>Alteratsioonimärkide lisamiseks vajuta + või - nupule või kasuta vatavaid klahve arvutklaviatuuril."; 
	
	
	
	function handleAccidental(plusMinus) {  // -1 to lower half tone, +1 to raise halftone
		//console.log("handleAccidental", plusMinus);
		if (currentNoteIndex[activeNote] > 0) {
			currentNoteIndex[activeNote] += plusMinus;
			if (currentNoteIndex[activeNote]>=possibleNotes.length-1)
				currentNoteIndex[activeNote] = possibleNotes.length-1;
			if (currentNoteIndex[activeNote]<0)
				currentNoteIndex[activeNote] = 0;
			scaleNotes[activeNote] = possibleNotes[currentNoteIndex[activeNote]].vtNote;
			console.log(currentNoteIndex[activeNote], possibleNotes[currentNoteIndex[activeNote]].vtNote);
			exercise.notes  = ":q "  + scaleNotes.join(" ");;
			exercise.draw();
			if (editNote >= 0) { // keep active notehead blue
				markBlue(editNote);
			}
			
		} else {
			alert("Klõpsa esmalt noodi asukohale noodijoonestikul!")
		}
		
	}
	
	function removeNote(noteIndex) {
		scaleNotes.splice(noteIndex,1);
		currentNoteIndex.splice(noteIndex,1);
		editNote = -1;
		if (lastActiveNote>=0) { 
			activeNote = lastActiveNote-1; // since one removed 
		}
		exercise.notes = ":q " + scaleNotes.join(" ");
		exercise.draw();
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
		
		if (charCode === 46 && activeNote>=0) { // delete key, delete the note
			removeNote(activeNote);
		} 
		
		
		
	}, false);
	
	var diesisButton = document.createElement("button");
    diesisButton.innerHTML = "+";
    diesisButton.onclick = function(){handleAccidental(1)};
    diesisButton.style.position = "relative"; // raise it to the height of staff
	diesisButton.style.top = "-150px";
    exercise.canvas.appendChild(diesisButton);
	
	var bemolleButton = document.createElement("button");
    bemolleButton.innerHTML = "-";
    bemolleButton.onclick = function(){handleAccidental(-1)};
    bemolleButton.style.position = "relative";
	bemolleButton.style.top = "-150px";
    exercise.canvas.appendChild(bemolleButton);
	
	
	exercise.generate = function() {
				
		scaleIndex = Math.floor(Math.random()* possibleScales.length);
		
		var baseNote = possibleBaseNotes[Math.floor(Math.random()* possibleBaseNotes.length)];
		console.log("Basenote: ", baseNote );
		
		//find according noteIndex from possibleNotes: TODO: add this as function to possible_notes.js, that perhaps should be part of baseclass...
		noteIndex = notes.findIndexByVtNote(baseNote, notes.trebleClefNotes);
		
		if (noteIndex==-1) {
			console.log("Generation failed. Could not find ", baseNote, "in possibleNotes");
			return;
		}
		
		//console.log("Selected: ", possibleScales[scaleIndex].translation, "from ", possibleNotes[noteIndex].name);
		this.containerNode.getElementsByClassName("question")[0].innerHTML =	'<br>Sisesta noodijoonestikule <b>' +possibleScales[scaleIndex].translation + " noodist "  +  possibleNotes[noteIndex].name  + ' üles </b>.<br>Kui oled noodi sisetanud noodijoonestikule, vajuta Vasta:' ;
		
		
		exercise.notes = ":q " + possibleNotes[noteIndex].vtNote; // the note the interval is built from
		activeNote = 0 ; // 0 is the inserted first note, let second note be inserted as next;
		currentNoteIndex = [-1,-1,-1,-1,-1,-1,-1,-1];
		scaleNotes = [];
		editNote = -1; lastActiveNote = -1;
		currentNoteIndex[0] = noteIndex;
		scaleNotes[0] = possibleNotes[noteIndex].vtNote;
		answered = false;
	}
	
	
	function markBlue(noteIndex) { // change color of notehead with given index
		var noteHeads = exercise.canvas.getElementsByClassName("vf-notehead");
		if (noteIndex>=0 && noteIndex<noteHeads.length) {
			noteHeads[noteIndex].firstChild.setAttribute("fill", "lightblue");
		} else {
			console.log("noteIndex out of range: ", noteIndex);
		}
	}
	
	exercise.handleClick2 = function(event) { // custom function replaceing baseclass.handleClick & clickActions
		if (event.target.parentElement.className.baseVal === "vf-notehead") {
			console.log("This is notehead MINA MINA!")
			// find which note it is:
			var noteHeads = exercise.canvas.getElementsByClassName("vf-notehead");
			for (var n=0; n<noteHeads.length; n++ ) {
				if (noteHeads[n]===event.target.parentElement) {
					console.log("This is note nr ", n);
					if (editNote === n ) {// this is already checked
						editNote = -1; // TODO: restore lastNote;
						activeNote = lastActiveNote;
						event.target.setAttribute("fill", "black"); // notehead black again and leave
						return; 
					} else {
						editNote = n;
						lastActiveNote = activeNote
						activeNote = editNote; // do we need editNote?? perhaps lastActiveNote is enough?
					}
				} 
			}
		}
		
		
		var x = event.layerX / exercise.canvasScale; 
		var y =  (event.layerY - exercise.canvas.offsetTop) / exercise.canvasScale; 
		
		if (editNote === -1) { // if no note is in edit mode, insert next note
			activeNote += 1; 
			if (activeNote > 7) { // take that there are 7 steps + octave in the scale
				alert("Kõik noodid on juba sisestatud. Klõpsa noodile, kui soovid mõnda neist muuta");
				activeNote = 7;
			}
		}
		
		var line = exercise.artist.staves[0].note.getLineForY(y);
		
		// find note by line
		line =  Math.round(line*2)/2; // round to neares 0.5
		for (var i= 0; i<possibleNotes.length;i++) {
			if (possibleNotes[i].hasOwnProperty("line") ) {
				//console.log(i, possibleNotes[i].line, line)
				if (possibleNotes[i].line === line) {
					//console.log("FOUND ", i, possibleNotes[i].vtNote);
					currentNoteIndex[activeNote] = i;
					scaleNotes[activeNote] = possibleNotes[i].vtNote
					exercise.notes  = ":q "  + scaleNotes.join(" "); // TODO: find right position when
					exercise.draw();
					if (editNote>=0)
						markBlue(editNote);
					break;
				}
			}
		}
		
		
		if (editNote >= 0) { // keep active notehead blue
			markBlue(editNote);
		}
	}
	
	exercise.renderer.getContext().svg.removeEventListener('click',exercise.handleClick, false);
	exercise.renderer.getContext().svg.addEventListener('click',exercise.handleClick2, false);
	
	exercise.renew();		
	
	exercise.responseFunction = function() {
		
		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		}
		
		exercise.attempts += 1;
		var feedback = "";
		var correct = true;
		var correctNotes = [];
		var firstNote = possibleNotes[noteIndex];
		for (var i=0; i<possibleScales[scaleIndex].intervals.length; i++) {
			var interval = intervals.getInterval(firstNote, notes.findNoteByVtNote(scaleNotes[i], possibleNotes)); // ignore direction -  probably right
			var correctNote = intervals.makeInterval(firstNote, possibleScales[scaleIndex].intervals[i], "up", possibleNotes );
			correctNotes.push(correctNote.vtNote);
			console.log(interval.interval.shortName, possibleScales[scaleIndex].intervals[i]);
			if (interval.interval.shortName == possibleScales[scaleIndex].intervals[i] && (interval.direction === "up" || interval.direction === "same")) {
				correct = correct && true;
				console.log("Inerval ", i, "correct");
			} else {
				correct =  correct && false;
			}
		}
		
		
		
		if (correct) {
			feedback = "<b>Õige</b>";
			exercise.score += 1;
		} else {
			feedback = "<b>Vale!</b> Võrdle õige helireaga.";
			// add other staff with rendered barline
		
			var vt1 = exercise.createVexTabString(); // with the notes already entered
			exercise.notes = ":q " + correctNotes.join(" ");
			var vt2 = exercise.createVexTabString(); // second staff with corrct notes
			exercise.draw(vt1 + "\n" + vt2);
		}
		
		this.containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
		this.containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback; 		
		answered = true;
		
		if (exercise.testIsRunning) { // add info to test report
			exercise.testReport +=  exercise.currentQuestion.toString() +  '. Küsitud helirida: ' + possibleScales[scaleIndex].translation  + " noodist "+ notes.removeLastDigit(firstNote.name)   + '.<br>Sisestatud noodid (VexTab notatasioon): '  + scaleNotes.join(" ");
			
			exercise.testReport += ".<br>Tagasiside: " + feedback + "<br>";	
		}
		
	}
	
	return exercise;

}
