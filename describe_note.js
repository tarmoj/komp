// Music exercises for "MUUSIKA KOMPOSITSIOONIÕPETUS"
// TODO: proper credits, copyright


// 1.3.5 Helikõrgus    Viiulivõti/Bassivõti. Antud on helikõrgus noodijoonestikul. Kirjelda helikõrguse asukohta noodijoonestikul (mitmendal joonel või mitmendas vahes) ja anna helikõrguse tähtnimetus ja silpnimetus.


function describeNote() {
// variables
	var duration = -1;
	var answered = false;
	var selectedNoteIndex = -1;
	
	// Create or set necessary HTML elements
	document.getElementById("exerciseTitle").innerHTML = "Kirjelda helikõrguse asukohta";
	document.getElementById("description").innerHTML = "Antud on helikõrgus noodijoonestikul. Kirjelda helikõrguse asukohta noodijoonestikul (mitmendal joonel või mitmendas vahes) ja anna helikõrguse tähtnimetus ja silpnimetus."; 
	document.getElementById("question").innerHTML =	"Kirjelda noodi asukohta. Mis noot see on?";
	
	var oldIndex = -1; // to check that same random value is not used twice in a row
	var answerString = "";
	var positions = [ // array to describe the note posistions as strings (in Estonian now)
		{position:0,positionStrin:"joonel"}, 
		{position:1,positionString:"vahes"},
		{position:-1,positionString:"joone all"},
		{position:2,positionString:"joone peal"},
		{position:-10,positionString:"alumisel abijoonel"},
		{position:-11,positionString:"alumise abijoone all"},
		{position:10,positionString:"ülemisel abijoonel"},
		{position:11,positionString:"ülemise abijoone peal"}
		
	];
	var trebleClefNotes = [  // lineOrSpace: 1...5; position: 0 - on the line, 1 -in the space, -1 - under line, 2 - on the line (like g2), -10 - on lower ledger line, -11 under lower ledger line; 10 - on upper ledeger line, 11 - above upper ledger line
		{vtNote:"A/3", name:"A", syllable:"La", lineOrSpace: 2, position:-10 },
		{vtNote:"B/3", name:"H", syllable:"Si", lineOrSpace: 1, position:-11 },
		{vtNote:"C/4", name:"C", syllable:"Do", lineOrSpace: 1, position:-10 },
		//{vtNote:"C#/4", name:"Cis", syllable:"Do-diees", line: -1, position:-1 },
		{vtNote:"D/4", name:"D", syllable:"Re", lineOrSpace: 1, position:-1 },
		{vtNote:"E/4", name:"E", syllable:"Mi", lineOrSpace: 1, position:0 },
		{vtNote:"F/4", name:"C", syllable:"Fa", lineOrSpace: 1, position:1 },
		{vtNote:"G/4", name:"G", syllable:"Sol", lineOrSpace: 2, position:0 },
		{vtNote:"A/4", name:"A", syllable:"La", lineOrSpace: 2, position:1 },
		{vtNote:"B/4", name:"H", syllable:"Si", lineOrSpace: 3, position:0 },
		
		{vtNote:"C/5", name:"C", syllable:"Do", lineOrSpace: 3, position:1 },
		{vtNote:"D/5", name:"D", syllable:"Re", lineOrSpace: 4, position:0 },
		{vtNote:"E/5", name:"E", syllable:"Mi", lineOrSpace: 4, position:1 },
		{vtNote:"F/5", name:"F", syllable:"Fa", lineOrSpace: 5, position:0 },
		{vtNote:"G/5", name:"G", syllable:"Sol", lineOrSpace: 5, position:2 },
		{vtNote:"A/5", name:"A", syllable:"La", lineOrSpace: 1, position:10 },
		{vtNote:"B/5", name:"H", syllable:"Si", lineOrSpace: 1, position:11 },
		{vtNote:"C/6", name:"C", syllable:"Do", lineOrSpace: 2, position:10 },
		
	];
	
	
	function getPositionString(index) {
		var result = trebleClefNotes[index].lineOrSpace + ". ";
		for (var i = 0; i < positions.length; i++) {  // do not use array.find for support of older browsers
			if (positions[i].position === trebleClefNotes[index].position) { 
				result += positions[i].positionString;
				break;
			} 
		}
		console.log("See noot asub: ", result);
		return result;
	}
	
	var oldResponse = document.getElementById("response");
	var response = document.createElement("div");
	response.id = "response";
	response.innerHTML = '<br>See noot asub: <select id="lineOrSpace">' +
		'<option value="1">1.</option>' + 
		'<option value="2">2.</option>' +
		'<option value="3">3.</option>' +
		'<option value="4">4.</option>' +
		'<option value="5">5.</option>' +
	'</select>' +
	'<select id="position">' +
		'<option value="0">joonel</option>' +
		'<option value="1">vahes</option>' +
		'<option value="-1">joone all</option>'+  // as d4
		'<option value="2">joone peal</option>' + // as g5
		'<option value="-10">alumisel abijoonel</option>' +
		'<option value="-11">alumise abijoone all</option>' + // as b3
		'<option value="10">ülemisel abijoonel</option>' + // as a5,c6
		'<option value="11">ülemise abijoone peal</option>' + // as b5
	'</select>' + 	
	'<br> Noodi nimi tähtnimetusega (kas c, d, e. f, g, a või h) <input type="text" id="noteName" size=4></input>, ' +
	'silpnimetusega (kas do, re, mi, fa, sol, la või si)<input type="text" id="syllable" size=4></input><br>';

	
	if (oldResponse === null) {
		console.log("Creating new response element");
		document.getElementById("responseDiv"). appendChild(response)
	} else {
		console.log("Replacing response element");
		document.getElementById("responseDiv").replaceChild(response, oldResponse);
	}
	
	// set necessary methods in exercise
	exercise = new MusicExercise("mainCanvas", 100); // relatively narrow canvas
	exercise.time = ""; // no time signature

	document.getElementById("attempts").innerHTML = "0";
	document.getElementById("score").innerHTML = "0";
	
	
	exercise.generate = function() {
		
		selectedNoteIndex = Math.floor(Math.random()*trebleClefNotes.length );
		//not shure if midinote is good idea...
		
		while (selectedNoteIndex === oldIndex) { // to avoid same value twice
			selectedNoteIndex = Math.floor(Math.random()*trebleClefNotes.length );
		}
		oldIndex = selectedNoteIndex;
		exercise.notes = trebleClefNotes[selectedNoteIndex].vtNote;
		getPositionString(selectedNoteIndex); // late to checkResponse
		
		
		answered = false; // necessary to set a flag to check if the quetion has answered already in checkResponse
	
	}
	
	exercise.generate();		
	exercise.draw();
	
	document.getElementById("renewButton").onclick = function() {
		exercise.generate(); 
		exercise.draw();
	}
	
	exercise.checkResponse = function() { // TODO: - kas oleks võimalik tõsta baseclassi? Siis vist switch case peaks olema välditud ja õige vastus peaks olema juba loetava stringina nagu "poolnoot" - vist mõtekas. Samas, kuidas basclass tead html elementide ID-sid???

		//TODO: kontrolli, kas uuendatud, muidu tõstab ainult skoori...
		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		}
		exercise.attempts += 1;
		var feedback = "";
		var correct = false;
		if (parseInt(document.getElementById("lineOrSpace").value)===trebleClefNotes[selectedNoteIndex].lineOrSpace &&
			parseInt(document.getElementById("position").value)===trebleClefNotes[selectedNoteIndex].position) {
			feedback = "Asukoht õige!";
			correct = true;
		} else {
			feedback = "Vale! Õige asukoht: " + getPositionString(selectedNoteIndex);
			correct = false;
		}
		
		if (document.getElementById("noteName").value.toLowerCase()===trebleClefNotes[selectedNoteIndex].name.toLowerCase()) {
			feedback += " Tähtnimetus õige!";
			correct = correct && true;
		} else {
			feedback += " Tähtnimetus vale! Õige on: "+ trebleClefNotes[selectedNoteIndex].name;
			correct = correct && false;
		}
		
		if (document.getElementById("syllable").value.toLowerCase()===trebleClefNotes[selectedNoteIndex].syllable.toLowerCase()) {
			feedback += " Silpnimetus õige!";
			correct = correct && true;
		} else {
			feedback += " Silpnimetus vale! Õige on: "+ trebleClefNotes[selectedNoteIndex].syllable;
			correct = correct && false;
		}
		
		if (correct) {
			exercise.score += 1;
		}
		
		document.getElementById("attempts").innerHTML = exercise.attempts;
		document.getElementById("score").innerHTML = exercise.score;
		document.getElementById("feedback").innerHTML = feedback; 
		exercise.draw(); // redraw without rectangle
		answered = true;
	
	}

}
