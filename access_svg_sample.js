exercise.hide = function() {
		
		// in fact not need to hide anything if no barline drawn
		console.log("hide()");
		// keep the code as example how to access svg objects
		/*
		var barLineIndex = -1;
		var notes = exercise.getNotes(0); 
		
		for (var i=0; i<notes.length; i++) {
			if (notes[i].duration==="b") {
				console.log("found barline on index", i)
				barlineObject = exercise.renderer.ctx.svg.getElementsByClassName("vf-stavenote")[i-1].nextSibling; // next to previous vf-stavenote
				
				// hide:
				barlineObject.setAttribute("stroke","none"); // NB! multiple barlines currently not supported!!!
				barlineObject.setAttribute("fill","none");
				
				
				// get positions of previous and next note
				if (i>0 && i<notes.length-1 ) {
					previousX = notes[i-1].getAbsoluteX();
					nextX = notes[i+1].getAbsoluteX();
				}
				
			}
			
		}	
		*/
} 
