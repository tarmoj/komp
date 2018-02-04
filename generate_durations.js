/*

Autogenerating Music Exercises for education program "Muusika Kompositsiooniõpetus" https://et.wikibooks.org/wiki/Muusika_kompositsiooni%C3%B5petus/N%C3%84IDISKURSUS._G%C3%9CMNAASIUM
Commissioned by Estonian Ministry of Education and Research, Tallinn University,  in the frame of Digital Learning Resources project DigiÕppeVaramu https://htk.tlu.ee/oppevara/


Copyright 2018, by Tarmo Johannes trmjhnns@gmail.com

License: MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

// Original exercise: Helivältus. Harjutus. Lisa puuduv vältus

function generateDurations(containerNode, canvasClassName) { // generated given number of random durations by user defined pool to be used as source for exercise of grouping rhythms to bars
	
	// variables
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName
	
		
	// create exercise as local variable, then return it in the end of function
	var exercise = new MusicExercise(this.containerNode, this.canvasClassName); 
	exercise.time = "";
	
	
	exercise.generate = function() {
	
		var totalDuration = 0, barLength = 4; // barLength in beats
		var durationsCount = parseInt(this.containerNode.getElementsByClassName("durationsCount")[0].value);
		if (durationsCount<=4) {
			alert("Nootide arv määramata või liiga väike");
			return;
		}
		var durations = [];
		var allowedDurations = [];//[4,2, 1, 0.5, 0.25, 0.125];  // TODO: put together from UI (checkboxes)
		
		var checkBoxes = this.containerNode.getElementsByClassName("duration");
		
		for (var j=0; j<checkBoxes.length;j++) {
			if (checkBoxes[j].checked) {
				
				allowedDurations.push(parseFloat(checkBoxes[j].value));
			}
		}
		
		if (allowedDurations.length<2) {
			alert("Vähemalt 2 vältust peavad olema valitud!");
			return;
		}
		
		for (var i=0;i<durationsCount;i++) {
			durations.push(allowedDurations[Math.floor(Math.random()*allowedDurations.length)]);
		}
		
		// create VexFlow string of notes
		
		var parseString = "";
		for (var k=0; k<durations.length; k++) {
			var flexDuration = (4/durations[k]).toString();
			//console.log(_duration,flexDuration);
			parseString += " :"+flexDuration ;
			var isRest = 0;
			if ( this.containerNode.getElementsByClassName("useRests")[0].checked) { // use also rests
				isRest = ( Math.random() >=0.5 ); // 50/50% if note or rest
			}
			parseString += (isRest) ?  " ##" : " B/4"; // add rest or note (B) 
		}
		//console.log("Generated notes: ", parseString);
		exercise.notes = parseString;
		exercise.artist.width = 100 + durations.length*30;
		
	}
	
	
	exercise.renew();
	
	
	return exercise;
	
}
