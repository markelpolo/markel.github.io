// Component that detects and emits events for touch gestures

AFRAME.registerComponent("gesture-detector", {
  schema: {
    element: { default: "" }
  },

  init: function() {
    this.targetElement =
      this.data.element && document.querySelector(this.data.element);

    if (!this.targetElement) {
      this.targetElement = this.el;
    }

    this.internalState = {
      previousState: null
    };

    this.emitGestureEvent = this.emitGestureEvent.bind(this);

    this.targetElement.addEventListener("touchstart", this.emitGestureEvent);

    this.targetElement.addEventListener("touchend", this.emitGestureEvent);

    this.targetElement.addEventListener("touchmove", this.emitGestureEvent);
  },

  remove: function() {
    this.targetElement.removeEventListener("touchstart", this.emitGestureEvent);

    this.targetElement.removeEventListener("touchend", this.emitGestureEvent);

    this.targetElement.removeEventListener("touchmove", this.emitGestureEvent);
  },

  emitGestureEvent(event) {
    const currentState = this.getTouchState(event);

    const previousState = this.internalState.previousState;

    const gestureContinues =
      previousState &&
      currentState &&
      currentState.touchCount == previousState.touchCount;

    const gestureEnded = previousState && !gestureContinues;

    const gestureStarted = currentState && !gestureContinues;

    if (gestureEnded) {
      const eventName =
        this.getEventPrefix(previousState.touchCount) + "fingerend";

      this.el.emit(eventName, previousState);

      this.internalState.previousState = null;
    }

    if (gestureStarted) {
      currentState.startTime = performance.now();

      currentState.startPosition = currentState.position;

      currentState.startSpread = currentState.spread;

      const eventName =
        this.getEventPrefix(currentState.touchCount) + "fingerstart";

      this.el.emit(eventName, currentState);

      this.internalState.previousState = currentState;
    }
    
    if (gestureContinues) {
      
      const eventDetail = {
          positionChange: {
            x: currentState.position.x - previousState.position.x,

            y: currentState.position.y - previousState.position.y
          }
      };
      
      if (currentState.touchCount == 2){
        
        const torqueList = [];
        
        for (let i=0; i < 2; i++){
          const screenScale = 2 / (window.innerWidth + window.innerHeight);
          
          // Creating arrays to use as coordinates
          const currentPosition = [currentState.touchList[i].clientX*screenScale, currentState.touchList[i].clientY*screenScale];
          const currentCenter = [currentState.positionRaw.x*screenScale, currentState.positionRaw.y*screenScale];
          const previousPosition = [previousState.touchList[i].clientX*screenScale, previousState.touchList[i].clientY*screenScale];
        
          // Calculating vectors based off of coordinates
          const P = [currentCenter[0] - currentPosition[0], currentCenter[1] - currentPosition[1]];
          //console.log(P);
          const F = [previousPosition[0] - currentPosition[0], previousPosition[1] - currentPosition[1]];
          //console.log(F); 
          // Calculating Torque of the position change using cross product / magnitude of the original position vector
          torqueList.push( (P[0]*F[1] - P[1]*F[0]) / Math.sqrt(Math.pow(P[0],2) + Math.pow(P[1],2)) );
        } 
        
        //console.log(torqueList);
        
        // Calculating the total torque to apply to the z axis rotation
        eventDetail.positionChange.z = torqueList.reduce((sum, torque) => sum + torque, 0);
      } else {
        eventDetail.positionChange.z = 0;
      }
      
      console.log(eventDetail.positionChange);

      if (currentState.spread) {
        eventDetail.spreadChange = currentState.spread - previousState.spread;
      }

      // Update state with new data

      Object.assign(previousState, currentState);

      // Add state data to event detail

      Object.assign(eventDetail, previousState);

      const eventName =
        this.getEventPrefix(currentState.touchCount) + "fingermove";

      this.el.emit(eventName, eventDetail);
    }
  },

  getTouchState: function(event) {
    if (event.touches.length === 0) {
      return null;
    }

    // Convert event.touches to an array so we can use reduce

    const touchList = [];

    for (let i = 0; i < event.touches.length; i++) {
      touchList.push(event.touches[i]);
    }

    const touchState = {
      touchList: touchList,
      touchCount: touchList.length
    };

    // Calculate center of all current touches

    const centerPositionRawX =
      touchList.reduce((sum, touch) => sum + touch.clientX, 0) /
      touchList.length;

    const centerPositionRawY =
      touchList.reduce((sum, touch) => sum + touch.clientY, 0) /
      touchList.length;

    touchState.positionRaw = { x: centerPositionRawX, y: centerPositionRawY };

    // Scale touch position and spread by average of window dimensions

    const screenScale = 2 / (window.innerWidth + window.innerHeight);

    touchState.position = {
      x: centerPositionRawX * screenScale,
      y: centerPositionRawY * screenScale
    };

    // Calculate average spread of touches from the center point

    if (touchList.length >= 2) {
      const spread =
        touchList.reduce((sum, touch) => {
          return (
            sum +
            Math.sqrt(
              Math.pow(centerPositionRawX - touch.clientX, 2) +
                Math.pow(centerPositionRawY - touch.clientY, 2)
            )
          );
        }, 0) / touchList.length;

      touchState.spread = spread * screenScale;
    }
    
    return touchState;
  },

  getEventPrefix(touchCount) {
    const numberNames = ["one", "two", "three", "many"];

    return numberNames[Math.min(touchCount, 4) - 1];
  }
});
