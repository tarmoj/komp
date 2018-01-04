// Music exercises for "MUUSIKA KOMPOSITSIOONIÕPETUS"
// TODO: proper credits, copyright

 
// harjutus 1.2.1 "Helivältus. Kirjuta helivältus noodikirja märgina. Antud on helivältuse (noot või paus) nimetus. Kirjuta helivältus noodikirja märgina. (Column + MusGen)"
// since writing is difficult, display a choice of notation marks and let to pick the righ one

function recognizeDuration(containerNode, canvasClassName) {		
	// variables
	var selectedIndex = -1;
	var clickedImage = "";
	var indexArray = []; // indexes of images to show, one of them correct, to be shuffled
	var durationsToShow = 4;
	var answered = false;
	
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName;
	
	var folder = "./img";
	var durationImages = [
		{src:"1.png", name:"täisnoot" },
		{src:"1r.png", name:"täispaus" },
		{src:"2.png", name:"poolnoot" },
		{src:"2r.png", name:"poolpaus" },
		{src:"4.png", name:"veerandnoot" },
		{src:"4r.png", name:"veerandpaus" },
		{src:"8.png", name:"kaheksandiknoot" },
		{src:"8r.png", name:"kaheksandikpaus" },
		{src:"16.png", name:"kuueteistkümnendiknoot" },
		{src:"16r.png", name:"kuueteistkümnendikpaus" },
		
	];
	
	// Create or set necessary HTML elements
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Leia helivältus";
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "Antud on helivältus, vali milline noodikirja märk sellele vastab."; 
	this.containerNode.getElementsByClassName("question")[0].innerHTML =	"Leia õige vältus (klõpsa pildil)";
	
	var exercise = new MusicExercise(this.containerNode,this.canvasClassName, 0); // no music, no player
	
	// create table in the responce area
	var oldResponse = this.containerNode.getElementsByClassName("response")[0];
	var response = document.createElement("div");
	response.className = "response"; 
	response.style.width = "100%";
	response.style.maximumWidth = "500px";
	response.innerHTML ='<table> <tr class="tableRow"> </tr></table> ';
	if (oldResponse === null || oldResponse === undefined) {
		console.log("Creating new response element");
		this.containerNode.getElementsByClassName("responseDiv")[0]. appendChild(response)
	} else {
		console.log("Replacing response element");
		this.containerNode.getElementsByClassName("responseDiv")[0].replaceChild(response, oldResponse);
	}
	
	exercise.generate = function() {
		answered = false; // necessary to set a flag to check if the quetion has answered already in checkResponse
		
		//TODO: avoid twice the same
		var tryThis = Math.floor(Math.random() * durationImages.length );
		while (selectedIndex === tryThis) // avoid the same duration twice in a row
			selectedIndex = Math.floor(Math.random() * durationImages.length );
		selectedIndex = tryThis;
		console.log("Selected ", durationImages[selectedIndex].name);
		this.containerNode.getElementsByClassName("question")[0].innerHTML =	"Milline neist on: <b>" + durationImages[selectedIndex].name + "</b> (Klõpsa noodijoonestikul)";
		
		indexArray = [];  // make array of pictures to show
		indexArray.push(selectedIndex);
		for (var i=0; i<durationsToShow-1; i++) {
			var index = Math.floor(Math.random() * durationImages.length);
			while (indexArray.indexOf(index)>=0) {
				index = Math.floor(Math.random() * durationImages.length); // avoid repeating elements
			}
			indexArray.push(index);
		}
		
		// shuffle
		var j, x, k;
		for (k = indexArray.length - 1; k > 0; k--) {
			j = Math.floor(Math.random() * (k + 1));
			x = indexArray[k];
			indexArray[k] = indexArray[j];
			indexArray[j] = x;
		}		
		
	}
	
	exercise.draw = function() {
		var tableRow = this.containerNode.getElementsByClassName("tableRow")[0];
		//TODO: remove all children
		tableRow.innerHTML = ""; // remove previous elements
		var tempTable = durationImages.slice(); // temporary table to remove used items from
		for (var i=0; i<durationsToShow; i++) {
			var index = indexArray[i];//Math.floor(Math.random()*tempTable.length);
			var cell = document.createElement("td");
			cell.style.width = "25%"; // TODO: dependante on durationsToShow
			var image = document.createElement("img");
			image.style.width = "80%"; 
			image.src = folder + "/" + durationImages[index].src;//durationImages[index].src;
			image.className = durationImages[index].name; // pass the value for response function
			image.onclick = function () {
				clickedDuration = this.className;
				exercise.responseFunction();
			}
			cell.appendChild(image);
			tableRow.appendChild(cell);
			//tempTable.splice(index,1); // remove to avoid doubles
		}
	}
	
	exercise.renew = function() {
		console.log("Renew table")
		exercise.generate();
		exercise.draw();
		answered = false;
		
	};		
	
	exercise.renew();
	
	exercise.responseFunction = function() {		
		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		}
		
		exercise.attempts += 1;
		var feedback = "";
		
		var clickedImage = this.containerNode.getElementsByClassName(clickedDuration)[0]
		if (clickedDuration === durationImages[selectedIndex].name) {
			feedback = "<b>Õige</b>";
			exercise.score +=1;
			if (clickedImage) {
				clickedImage.style.border = "4px solid green";
			}
			
		} else {
			feedback = "<b>Vale!</b> see on hoopis " +clickedDuration;
			if (clickedImage) {
				clickedImage.style.border = "4px solid red";
				this.containerNode.getElementsByClassName(durationImages[selectedIndex].name)[0].style.border = "4px solid blue";
			}
		}
		
		this.containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
		this.containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback; 
		answered = true;
		
		if (this.testIsRunning() ) {
			this.nextQuestion(); // this also stops the countdown
		}
	}
	
	exercise.checkResponse = function() { // nothing here, real check in checkResponse()
		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		} else {
			alert("Klõpsa õigele noodikrjamärgile."); 
		}
	}
	
	return exercise;
		
}
