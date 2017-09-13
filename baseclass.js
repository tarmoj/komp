// Base class for self generating musical exercises of .... project
// uses VexTab / VexFlow for notation 
// for audio playback

// the host webpage must load:
// <script src="https://unpkg.com/vextab/releases/vextab-div.js"></script>
// <script src='https://surikov.github.io/webaudiofont/npm/dist/WebAudioFontPlayer.js'></script>
// <script src='https://surikov.github.io/webaudiofontdata/sound/0000_JCLive_sf2_file.js'></script> 

function MusicExercise(canvasId, width, x, y, scale) {
	this.canvas = document.getElementById(canvasId) 
	
	// Notation elements
	this.canvasWidth = width == undefined ? 600 : width;
	this.canvasX = x == undefined ? 10 : x;
	this.canvasY = y == undefined ? 10 : y;
	this.canvasScale = scale == undefined ? 0.8 : scale;
	
	this.notes = ""; // notenames, durations  and octaves in vextab format like ":4 C/4" -  and other parts of VT notation
	//this.vexFlowNotes = []; // including all parameters VF objects
	this.numberOfVoices = 1;
	this.currentVoice = 0; // index of voice/stave?
	
	
	this.key = "C";
	this.time = "4/4";
	this.clef = "treble";
		
    this.vtEndString = "\noptions space=20\n";
	
	//results and feedback
	this.attempts = 0;
	this.score = 0;
	
	
	
	this.createVexTabString = function() {
		var startString = "options space=20\n tabstave \n notation=true tablature=false \n";
		var clefString = (this.clef.length>0) ? "clef="+this.clef+"\n" : "";
		var keyString = (this.key.length>0) ? "key="+this.key+"\n" : "";
		var timeString = (this.time.length>0) ?  "time="+this.time+"\n" : "";
		var notesString = (this.notes==="") ? ""  : "\nnotes " + this.notes + "\n"
		var endString = "\noptions space=20\n";
		return startString + clefString + keyString + timeString + notesString + endString;
	}
	
	this.clickOnCanvas = function(event) {
		// TODO: test coordinates, offsets etc
		// have alook at http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/1
		// and http://miloq.blogspot.in/2011/05/coordinates-mouse-click-canvas.html
		// referenced from: https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
		// event.clientX should be also OK
		var x = event.offsetX == undefined ? event.layerX : event.offsetX;
		var y = event.offsetY == undefined ? event.layerY : event.offsetY;
		console.log("Click coordinates: ",x,y);
		
	}

	this.init = function() {
			// VexTab
			var vt = VexTabDiv;
			var VexTab = vt.VexTab;// TODO: size from parameters, settings
			var Artist = vt.Artist;
			var Renderer = Vex.Flow.Renderer;
			this.renderer = new Renderer(this.canvas, Renderer.Backends.CANVAS); // maybe SVG backend better for object manipulation?
			this.artist = new Artist(this.canvasX, this.canvasY , this.canvasWidth, {scale: this.canvasScale}); 
			this.vextab = new VexTab(this.artist);


			//Audio renderer
			this.selectedPreset=_tone_0000_JCLive_sf2_file;
			var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
			this.audioContext = new AudioContextFunc();
			this.player=new WebAudioFontPlayer();
			this.player.loader.decodeAfterLoading(this.audioContext, '_tone_0000_JCLive_sf2_file');
			
			
			// add event listener for canvas clicks
			this.canvas.addEventListener('click',this.clickOnCanvas, false);
			this.canvas.addEventListener("click", this.clickOnCanvas, false);
			//TODO: method for touchscreens

	}
	this.init();

	this.generate = function() {console.log("generate(). Implement in derived object.");}
	this.draw = function () { // this should or could be overdriven in base calsses
		try {
			this.vextab.reset();
			this.artist.reset();
			this.vextab.parse(this.createVexTabString());
			this.artist.render(this.renderer);
		} catch (e) {
			console.log(e);
		}
	}
	
	
	this.getNotes = function(staff) {
		if (typeof(staff)=="undefined") {
			staff=0			
		}
		return this.artist.staves[staff].note_notes;		
	}
	
	this.hide = function(noteIndex) {console.log("hide(). Implement in derived object.");}

	
	//? this.hiddenRect = [];
	this.answer = ""; // keep it string, convert in checkResponse()
	this.checkResponse = function() {console.log("checkResponse. Implement in derived object.");}

	//audio
	this.volume = 0.5;
	this.tempo = 60.0;
	this.playNote = function(midiNote, start, duration) {
		this.player.queueWaveTable(this.audioContext, this.audioContext.destination,
		this.selectedPreset, this.audioContext.currentTime+start, midiNote, duration, this.volume);
	}

	this.play = function() {
		var _start = 0, _duration = 1;
		for (let _note of this.artist.staves[0].note_notes) {
			 
			if (_note.playNote!==null) {
				_duration = _note.getTicks().value()/4096.0 * 60.0/this.tempo;
				var key = _note.getPlayNote()[0];
				[noteName, octave] = key.split("/");
				noteName = noteName.trim().toLowerCase();
				var note_value = Vex.Flow.Music.noteValues[noteName];
				var midiNote = (24 + ((octave-1) * 12)) + note_value.int_val
				// get start from note, maybe 
				console.log(midiNote, _start, _duration); // no output in console???
				this.playNote(midiNote, _start, _duration);
				_start += _duration;  // TODO: what if rest?? see code of artist.coffee
			
				
			} else {
				console.log("Not note. Maybe barline"); // TODO: why some notes return no playnote?
			}
		}
	}
	
	
	
}

 

