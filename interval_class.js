
function IntervalClass() {
	
	this.possibleIntervals = [
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
	
	this.noInterval = {shortName: "none", longName: "määratlemata", semitones: -1, degrees: -1}; // to be used if nothing found
	
	this.findIntervalBySemitones = function(semitones, degrees) {
		//  degrees -  numbers of scale degrees between the notes
		if (semitones>12) {
			alert("Liiga suur intervall, oktavit ignoreeritaks");
			interval = interval % 12;
		}
		var intervals = [];
		
		for (var i= 0; i<this.possibleIntervals.length; i++) { 
			if (semitones === this.possibleIntervals[i].semitones) {
				intervals.push(this.possibleIntervals[i]); // several intervals can be with same semitones  distance
			}
		}
		
		if (intervals.length === 0) {
			return this.noInterval;
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
		return this.this.noInterval;
	}
	
	this.findIntervalByShortName = function(shortName) {
		for (var i= 0; i<this.possibleIntervals.length; i++) {
			if (shortName === this.possibleIntervals[i].shortName) {
				return this.possibleIntervals[i];
			}
		}
		return this.noInterval;
	}
	
	this.findIntervalByLongName = function(longName) {
		for (var i= 0; i<this.possibleIntervals.length; i++) {
			if (longName === this.possibleIntervals[i].longName) {
				return this.possibleIntervals[i];
			}
		}
		return this.noInterval;
	}
	
	this.getInterval = function(note1, note2) { // return interval object and direction
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

		var interval = this.findIntervalBySemitones(Math.abs(semitones), degrees);
		//console.log("semitones, degrees, interval, direction", semitones, degrees, interval.longName, direction )
		return {interval: interval, direction: direction};
	}
	
	this.makeInterval = function(note, shortName, direction, possibleNotes) { // possibleNotes -  array of note objects
		// possibleNotes global for now, see later; return found note as object or undefined otherwise
		
		var midiNote1 = note.midiNote;
		var interval = this.findIntervalByShortName(shortName);
		var semitones = interval.semitones;
		var degrees = interval.degrees;
		if (interval.semitones === -1) { // not found
			console.log(shortName," not found");
			return;
		}
		if (direction==="down") {
			semitones = -semitones;
			degrees = -degrees;
		}
		
		var oct1 = Math.floor(note.midiNote / 12) - 1; // 4 for first octava etc
		var degree1 = note.degree + oct1*7 ; // take also octave into account to get correct difference
		console.log("note: ", note.midiNote, oct1, degree1);
		// find note by midiNote
		
		for (var i=0; i<possibleNotes.length; i++) {
			var oct2 = Math.floor(possibleNotes[i].midiNote / 12) - 1;
			var degree2 = possibleNotes[i].degree + oct2*7;
			if ( (possibleNotes[i].midiNote === note.midiNote + semitones) &&  (degree2 === (degree1 + degrees)) ) {
				console.log("Found: ", i, possibleNotes[i].vtNote);
				return possibleNotes[i];
			}
		}
		
		// otherwise return undefined
	}
	
	
	this.makeChord = function(noteArray) { // noteArray - array of type possibleNotes, to have midiNotes to sort those
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
		vtString += ")";
		//console.log("Sorted chord: ", vtString);
		return vtString;
		
	}
	
}
