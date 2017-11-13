// Base class for self generating musical exercises of .... project
// uses VexTab / VexFlow for notation 
// for audio playback

// the host webpage must load:
// <script src="https://unpkg.com/vextab/releases/vextab-div.js"></script>
// <script src='https://surikov.github.io/webaudiofont/npm/dist/WebAudioFontPlayer.js'></script>
// <script src='https://surikov.github.io/webaudiofontdata/sound/0000_JCLive_sf2_file.js'></script> 

function MusicExercise(canvasId, width, x, y, scale) {
	this.canvas = document.getElementById(canvasId) 
	var _this = this;
	
	// Notation elements
	this.canvasWidth = width == undefined ? 600 : width; // NB! if set to 0, don't create notation
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
		var startString = "options space=20\n stave \n "; // was tabstave before but this is not needed
		var clefString = (this.clef.length>0) ? "clef="+this.clef+"\n" : "";
		var keyString = (this.key.length>0) ? "key="+this.key+"\n" : "";
		var timeString = (this.time.length>0) ?  "time="+this.time+"\n" : "";
		var notesString = (this.notes==="") ? ""  : "\nnotes " + this.notes + "\n"
		var endString = "\noptions space=20\n";
		return startString + clefString + keyString + timeString + notesString + endString;
	}
	
	
	this.clickActions = function(x,y){ console.log("clickactions", x,y)}; // you can define other things to be done connected to click event
	
	this.handleClick = function(event) {
		//event.stopPropagation(); // not sure if this is necessary
		
		var _x = event.layerX / _this.canvasScale; // should we use - this.canvas.offsetLeft? Then fix in drawBarline 
		var _y =  (event.layerY - _this.canvas.offsetTop) / _this.canvasScale; // was: clientX, clientY // TODO: test other browsers
		console.log("Click coordinates: ",_x,_y, event);
		_this.clickActions(_x,_y); // this workaround is necessary to be able to overload clickActions to reach this properties
		
	}

	this.init = function() {
			// for SVG -  remove everything what is inside the div:
			while (this.canvas.firstChild) {
				this.canvas.removeChild(this.canvas.firstChild);
			}
			// VexTab
			if (this.canvasWidth>0) {
				var vt = VexTabDiv;
				var VexTab = vt.VexTab;// TODO: size from parameters, settings
				var Artist = vt.Artist;
				var Renderer = Vex.Flow.Renderer;
				this.renderer = new Renderer(this.canvas, Renderer.Backends.SVG); // was .CANVAS NB! SVG needs div element, not canvas to work
				this.artist = new Artist(this.canvasX, this.canvasY , this.canvasWidth, {scale: this.canvasScale}); 
				this.vextab = new VexTab(this.artist);


				//Audio renderer
				this.selectedPreset=_tone_0000_JCLive_sf2_file;
				var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
				this.audioContext = new AudioContextFunc();
				this.player=new WebAudioFontPlayer();
				this.player.loader.decodeAfterLoading(this.audioContext, '_tone_0000_JCLive_sf2_file');
				
				
				// add event listener for canvas clicks //TODO: should be SVG now
				this.renderer.getContext().svg.addEventListener('click',this.handleClick, false);
				//this.canvas.addEventListener("click", this.clickOnCanvas, false);
			} else {
				console.log("Canvas width is 0, renderer and player not created.");
			}

	}
	this.init();

	this.generate = function() {console.log("generate(). Implement in derived object.");}
	
	this.draw = function (string) { // this should or could be overdriven in base calsses
		try {
			this.vextab.reset();
			this.artist.reset();
			var parseString = (string==undefined) ? this.createVexTabString() : string; // allow to set the string by user;
			this.vextab.parse(parseString);
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
			 
			if (_note.duration!=="b") { // check if not barline
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
			
				
			} 
		}
	}
	
	
	
}

 

