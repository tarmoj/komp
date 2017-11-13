// Music exercises for "MUUSIKA KOMPOSITSIOONIÕPETUS"
// TODO: proper credits, copyright


// harjutus  1.2.7. Helikõrgus. Viiulivõti. Antud on helikõrgus tähtnimetusega. Kirjuta helikõrgus silpnimetusega, noodijoonestikul, klaviatuuril. 

//var exercise; should it be declared in the script part of main html?? 
	
function drawNote() { // generates 2 bars in given time, hides barlines, on click draws a line an cecks if it is correct (between right notes)
	// variables
	var answered = false;
	var noteIndex = -1, currentNoteIndex = -1;
	
	var possibleNotes = [   // line - line number in staff: 0 upper, 4 - lower, 5 - lower ledger line. Used to draw the note
		{vtNote:"C@/4", name:"ces", syllable:"do-bemoll"},
		{vtNote:"C/4", name:"c", syllable:"do", line: 5},
		{vtNote:"C#/4", name:"cis", syllable:"do-diees"},
		
		{vtNote:"D@/4", name:"des", syllable:"re-bemoll"},
		{vtNote:"D/4", name:"d", syllable:"re", line: 4.5},
		{vtNote:"D#/4", name:"dis", syllable:"re-diees"},
		
		{vtNote:"E@/4", name:"es", syllable:"mi-bemoll"},
		{vtNote:"E/4", name:"e", syllable:"mi", line: 4},
		{vtNote:"E#/4", name:"eis", syllable:"mi-diees"},
		
		{vtNote:"F@/4", name:"fes", syllable:"fa-bemoll"},
		{vtNote:"F/4", name:"f", syllable:"fa", line: 3.5},
		{vtNote:"F#/4", name:"fis", syllable:"fa-diees"},
		
		{vtNote:"G@/4", name:"ges", syllable:"sol-bemoll"},
		{vtNote:"G/4", name:"g", syllable:"sol", line: 3},
		{vtNote:"G#/4", name:"gis", syllable:"sol-bemoll"},
		
		{vtNote:"A@/4", name:"as", syllable:"la-bemoll"},
		{vtNote:"A/4", name:"a", syllable:"la", line: 2.5},
		{vtNote:"A#/4", name:"ais", syllable:"la-diees"},
		
		{vtNote:"B@/4", name:"b", syllable:"si-bemoll"},
		{vtNote:"B/4", name:"h", syllable:"si", line: 2},
		{vtNote:"B#/4", name:"his", syllable:"si-diees"},
		
		
		{vtNote:"C@/5", name:"ces2", syllable:"do-bemoll2"},
		{vtNote:"C/5", name:"c2", syllable:"do2", line: 1.5},
		{vtNote:"C#/5", name:"cis2", syllable:"do-diees2"},
		
		{vtNote:"D@/5", name:"des2", syllable:"re-bemoll2"},
		{vtNote:"D/5", name:"d2", syllable:"re2", line: 1},
		{vtNote:"D#/5", name:"dis2", syllable:"re-diees2"},
		
		{vtNote:"E@/5", name:"es2", syllable:"mi-bemoll2"},
		{vtNote:"E/5", name:"e2", syllable:"mi2", line: 0.5},
		{vtNote:"E#/5", name:"eis2", syllable:"mi-diees2"},
		
		{vtNote:"F@/5", name:"fes2", syllable:"fa-bemoll2"},
		{vtNote:"F/5", name:"f2", syllable:"fa2", line: 0},
		{vtNote:"F#/5", name:"fis2", syllable:"fa-diees2"},
		
		{vtNote:"G@/5", name:"ges2", syllable:"sol-bemoll2"},
		{vtNote:"G/5", name:"g2", syllable:"sol2", line: -0.5},
		{vtNote:"G#/5", name:"gis2", syllable:"sol-bemoll2"},
		
		{vtNote:"A@/5", name:"as2", syllable:"la-bemoll2"},
		{vtNote:"A/5", name:"a2", syllable:"la2", line: -1},
		{vtNote:"A#/5", name:"ais2", syllable:"la-diees2"},
		
		{vtNote:"B@/5", name:"b2", syllable:"si-bemoll2"},
		{vtNote:"B/5", name:"h2", syllable:"si2", line: -1.5},
		{vtNote:"B#/5", name:"his2", syllable:"si-diees2"},
		
		{vtNote:"C@/6", name:"ces3", syllable:"do-bemoll3"},
		{vtNote:"C/6", name:"c3", syllable:"do3", line: -2},
		{vtNote:"C#/6", name:"cis3", syllable:"do-diees3"},
		
		
	];
	
	// Create or set necessary HTML elements
	document.getElementById("exerciseTitle").innerHTML = "Kirjuta helikõrgus";
	document.getElementById("description").innerHTML = "Antud on helikõrgus tähtnimetusega. Kirjuta helikõrgus silpnimetusega, noodijoonestikul, klaviatuuril."; 
	//TODO: luba ka pause, mitte ainult noodid -  kas vaja?
	document.getElementById("question").innerHTML =	"See noot on silpnimetusega: / Kliki noodijoonestukul kohale, kus peaks asuma noot. Kasuta +/- nuppe, et lisada diees või bemoll";
	
	// set necessary methods in exercise
	exercise = new MusicExercise("mainCanvas",150,10,10,1.5); // bigger scale for note input
 	exercise.time = "";
 	exercise.key = "";
	exercise.attempts = 0; exercise.score = 0;
	document.getElementById("attempts").innerHTML = "0";
	document.getElementById("score").innerHTML = "0";
	
	// add diesis and bemoll button to mainCanvas
	
	function handleAccidental(plussMinus) {  // -1 to lower half tone, +1 to raise halftone
		if (currentNoteIndex > 0) {
			currentNoteIndex += plussMinus;
			if (currentNoteIndex>=possibleNotes.length)
				currentNoteIndex = possibleNotes.length;
			if (currentNoteIndex<0)
				currentNoteIndex = 0;
			console.log(currentNoteIndex, possibleNotes[currentNoteIndex].vtNote)
			exercise.notes = possibleNotes[currentNoteIndex].vtNote;
			exercise.draw();
		} else {
			alert("Klõpsa esmalt noodi asukohale noodijoonestikul!")
		}
		
	}
	
	
	var diesisButton = document.createElement("button");
    diesisButton.innerHTML = "+";
    diesisButton.onclick = function(){handleAccidental(1)};
    exercise.canvas.appendChild(diesisButton);
	
	var bemolleButton = document.createElement("button");
    bemolleButton.innerHTML = "-";
    bemolleButton.onclick = function(){handleAccidental(-1)};
    exercise.canvas.appendChild(bemolleButton);
	
	
	
	exercise.generate = function() {
				
		noteIndex = Math.floor(Math.random()*possibleNotes.length); 
		console.log("Selected", possibleNotes[noteIndex].name, possibleNotes[noteIndex].syllable);
		
		document.getElementById("question").innerHTML =	"Noot <b><big>" + possibleNotes[noteIndex].name + '</b></big> on silpnimetusega: <select id="syllable"></select><br>Kui oled noodi sisetanud noodijoonestikule, vajuta Vasta:' ;
		
		
		
		exercise.notes = ""; // nothing drawn	
		currentNoteIndex = -1; 	
		answered = false; // necessary to set a flag to check if the quetion has answered already in checkResponse
	
	}
	
	
	
	exercise.clickActions = function(x,y) {
		console.log(x,y);
// 		if (answered) {
// 			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
// 			return;
// 		}
// 		
// 		exercise.attempts += 1;
// 		var feedback = "";
		

		var options = exercise.artist.staves[0].note.getOptions();
		
		var spacing = options.spacing_between_lines_px;
		var headroom = options.space_above_staff_ln;
		var line = exercise.artist.staves[0].note.getLineForY(y);
		
		// find note by line
		line =  Math.round(line*2)/2; // round to neares 0.5
		for (var i= 0; i<possibleNotes.length;i++) {
			if (possibleNotes[i].hasOwnProperty("line") ) {
				//console.log(i, possibleNotes[i].line, line)
				if (possibleNotes[i].line === line) {
					console.log("FOUND ", i, possibleNotes[i].vtNote);
					// TODO: add # or bemoll, then check if correct note
					exercise.notes =  possibleNotes[i].vtNote;
					currentNoteIndex = i;
					exercise.draw();
					break;
					
				}
			}
			
		}
		
		
// 		if (drawX>= previousX && drawX<=nextX) { // +10 note width
// 			feedback = "Õige!"
// 			exercise.score += 1;
// 			color = "green";
// 		} else {
// 			feedback = "Vale koht!";
// 			color = "red";
// 		}
		
		
		
		document.getElementById("attempts").innerHTML = exercise.attempts;
		document.getElementById("score").innerHTML = exercise.score;
		document.getElementById("feedback").innerHTML = feedback; 

		answered = true;
	}
	
	exercise.generate();		
	exercise.draw();
	
	document.getElementById("renewButton").onclick = function() {
		document.getElementById("feedback").innerHTML = "";
		exercise.generate(); 
		exercise.draw();
	}
	
	exercise.checkResponse = function() {
		//TODO: kontrolli, kas uuendatud, muidu tõstab ainult skoori...
		alert("Loomisel");
	
	}
	

}
