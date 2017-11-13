// Music exercises for "MUUSIKA KOMPOSITSIOONIÕPETUS"
// TODO: proper credits, copyright


// harjutus  1.2.7. Helikõrgus. Viiulivõti. Antud on helikõrgus tähtnimetusega. Kirjuta helikõrgus silpnimetusega, noodijoonestikul, klaviatuuril. 

//var exercise; should it be declared in the script part of main html?? 
	
function drawNote() { // generates 2 bars in given time, hides barlines, on click draws a line an cecks if it is correct (between right notes)
	// variables
	var answered = false;
	var noteIndex = "";
	
	var possibleNotes = [  
		{vtNote:"Cb/4", name:"ces", syllable:"do-bemoll"},
		{vtNote:"C/4", name:"c", syllable:"do"},
		{vtNote:"C#/4", name:"cis", syllable:"do-diees"},
		
		{vtNote:"Db/4", name:"des", syllable:"re-bemoll"},
		{vtNote:"D/4", name:"d", syllable:"re"},
		{vtNote:"D#/4", name:"dis", syllable:"re-diees"},
		
		{vtNote:"Eb/4", name:"es", syllable:"mi-bemoll"},
		{vtNote:"E/4", name:"e", syllable:"mi"},
		{vtNote:"E#/4", name:"eis", syllable:"mi-diees"},
		
		{vtNote:"Fb/4", name:"fes", syllable:"fa-bemoll"},
		{vtNote:"F/4", name:"f", syllable:"fa"},
		{vtNote:"F#/4", name:"fis", syllable:"fa-diees"},
		
		{vtNote:"Gb/4", name:"ges", syllable:"sol-bemoll"},
		{vtNote:"G/4", name:"g", syllable:"sol"},
		{vtNote:"G#/4", name:"gis", syllable:"sol-bemoll"},
		
		{vtNote:"Ab/4", name:"as", syllable:"la-bemoll"},
		{vtNote:"A/4", name:"a", syllable:"la"},
		{vtNote:"A#/4", name:"ais", syllable:"la-diees"},
		
		{vtNote:"Bb/4", name:"b", syllable:"si-bemoll"},
		{vtNote:"B/4", name:"h", syllable:"si"},
		{vtNote:"B#/4", name:"his", syllable:"si-diees"},
		
		
	];
	
	// Create or set necessary HTML elements
	document.getElementById("exerciseTitle").innerHTML = "Kirjuta helikõrgus";
	document.getElementById("description").innerHTML = "Antud on helikõrgus tähtnimetusega. Kirjuta helikõrgus silpnimetusega, noodijoonestikul, klaviatuuril."; 
	//TODO: luba ka pause, mitte ainult noodid -  kas vaja?
	document.getElementById("question").innerHTML =	"See noot on silpnimetusega: / Kliki noodijoonestukul kohale, kus peaks asuma noot. / vajuta vastavale klaveriklahvile";
	
	// set necessary methods in exercise
	exercise = new MusicExercise("mainCanvas",150,10,10,1); // TODO: set bigger scale
 	exercise.time = "";
 	exercise.key = "";
	exercise.attempts = 0; exercise.score = 0;
	document.getElementById("attempts").innerHTML = "0";
	document.getElementById("score").innerHTML = "0";
	
	
	
	
	exercise.generate = function() {
				
		noteIndex = Math.floor(Math.random()*possibleNotes.length); 
		console.log("Selected", possibleNotes[noteIndex].name, possibleNotes[noteIndex].syllable);
		
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
		
		var drawX = x //- exercise.canvasX;
		var drawY = y; // - exercise.canvasY;
		//console.log(drawX, drawY)
		var options = exercise.artist.staves[0].note.getOptions();
		
		var spacing = options.spacing_between_lines_px;
		var headroom = options.space_above_staff_ln;
		var line = 0
		
		var y0 = exercise.artist.staves[0].note.getYForLine(line); + (headroom * spacing) // - (line*spacing);
		console.log(drawY, y0);
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
