/*	
   AFRAME.registerComponent("toggle-button", {
	  init: function() {
		this.entities = [];

		//Set specified entities as target for toggle, otherwise set self
		if ( this.data === null ) {
		  this.entities.push(this.el);
		} else {
		  this.entities = this.data;
		}
		
	    let btn = document.createElement("button");
	    btn.type = "button";
	    btn.innerText = this.el.id;
	    btn.setAttribute("class", "round-button");
	    let cam = document.querySelector("#camera");
	    cam.appendChild(btn);
            console.log(btn);
            const str1 = "#";
            const str2 = str1.concat(this.el.id);
	    btn.addEventListener("click", () => {
	    	let model = document.querySelector(str2);
		console.log(model);
	    	model.setAttribute("visible", !model.getAttribute("visible"));
	    });
	  }
      });
*/	  
  AFRAME.registerComponent('toggle-visibility', {

      schema: {
        type: 'selectorAll',
        default: null
      },	    
	    
      init: function() {
	this.entities = [];
	      
	//Set specified entities as target for toggle, otherwise set self
        if ( this.data === null ) {
          this.entities.push(this.el);
        } else {
          this.entities = this.data;
        }

	//Binds toggleVisibility function defined later, this way we can remove listener directly
        this.toggleHandler = this.toggleVisibility.bind(this);

      },
	    
      play: function() {

        // ==========================================================================
        // Add event listener for click event when entity is visible.
        // Note this is not automatic when hiding and unhiding the entity.
        // We will be telling the component to pause and play the entity from within
        // toggleVisibility() to achieve the desired effect.
        // ==========================================================================

        this.el.addEventListener('click', this.toggleHandler);

      },
	    
      pause: function() {

        // ================================================================================
        // Remove event listener for click event so it does not fire when entity is hidden.
        // Note this is not automatic when hiding and unhiding the entity.
        // We will be telling the component to pause and play the entity from within
        // toggleVisibility() to achieve the desired effect.
        // ================================================================================

        this.el.removeEventListener('click', this.toggleHandler);

      },

      toggleVisibility: function(e) {
       
        // Variable for convenience.
        var entities = this.entities;
       
        // Reference to our cursor entity.
        var cursor = this.el.sceneEl.querySelector('[cursor]');

        // Loop through target entities.
        for (var i = 0; i < entities.length; i++) {
          
          // If visible, hide and pause (remove listeners); if hidden, make visible and play (add listeners).
          if ( entities[i].object3D.visible === true ) {
            

            // Entity is visible.
            // Hides target. Ironically, the easiest part of what we're doing.
            entities[i].object3D.visible = false;
            // Pauses target -- calls pause() lifecycle method which removes event listener.
            entities[i].pause();

            // Replace clickable class so there is no interaction with raycaster.

            // Not supported in Edge or Samsung Internet.
            // entities[i].classList.replace('clickable', 'clickable-disabled');
            // Workaround
            entities[i].classList.remove('clickable');
            entities[i].classList.add('clickable-disabled');

            // Updates raycaster objects in scene -- updates class names, etc.
            // Otherwise, removing the clickable class doesn't affect the raycaster

            cursor.components.raycaster.refreshObjects();

          } else {

 
            // Entity is not visible.
            // Restore clickable class so there can be interaction.

            // Not supported in Edge or Samsung Internet
            // entities[i].classList.replace('clickable-disabled', 'clickable');
            // Workaround
            entities[i].classList.remove('clickable-disabled');
            entities[i].classList.add('clickable');

            // Updates raycaster objects in scene -- updates class names, etc.
            // Otherwise, restoring the clickable class doesn't affect the raycaster.

            cursor.components.raycaster.refreshObjects();
            // Plays target -- calls play() lifecycle method which adds event listener.

            entities[i].play();

            // Unhide target.
            entities[i].object3D.visible = true;

          }

        }

      }
      
