/* global AFRAME, THREE */

AFRAME.registerComponent("gesture-handler", {
  schema: {
    enabled: { default: true },
    rotationFactor: { default: 5 },
    minScale: { default: 0.3 },
    maxScale: { default: 8 },
  },

  init: function () {
    this.handleScale = this.handleScale.bind(this);
    this.handleRotation = this.handleRotation.bind(this);

    //Starts as false for AR only!
    this.isVisible = true;
    this.initialScale = this.el.object3D.scale.clone();
    this.scaleFactor = 1;

    //Uncomment for AR only!
    /*
    this.el.sceneEl.addEventListener("markerFound", (e) => {
      this.isVisible = true;
    });

    this.el.sceneEl.addEventListener("markerLost", (e) => {
      this.isVisible = false;
    });
    */
  },

  update: function () {
    if (this.data.enabled) {
      this.el.sceneEl.addEventListener("onefingermove", this.handleRotation);
      this.el.sceneEl.addEventListener("twofingermove", this.handleRotation);
      this.el.sceneEl.addEventListener("twofingermove", this.handleScale);
    } else {
      this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
      this.el.sceneEl.removeEventListener("twofingermove", this.handleRotation);
      this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
    }
  },

  remove: function () {
    this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
    this.el.sceneEl.removeEventListener("twofingermove", this.handleRotation);
    this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
  },

  handleRotation: function (event) {
    //if (this.isVisible) {
      /*
      this.el.object3D.rotation.y +=
        event.detail.positionChange.x * this.data.rotationFactor;
      this.el.object3D.rotation.x +=
        event.detail.positionChange.y * this.data.rotationFactor;
      this.el.object3D.rotation.z +=
        event.detail.positionChange.z * this.data.rotationFactor;
        */
      //console.log(this.el.object3D.rotation);
      
      this.el.object3D.rotateOnWorldAxis(new THREE.Vector3(0,1,0), event.detail.positionChange.x * this.data.rotationFactor); 
      this.el.object3D.rotateOnWorldAxis(new THREE.Vector3(1,0,0), event.detail.positionChange.y * this.data.rotationFactor);
      this.el.object3D.rotateOnWorldAxis(new THREE.Vector3(0,0,-1), event.detail.positionChange.z * this.data.rotationFactor);      
      
      //console.log(this.el.object3D.rotation);
    //}
  },

  handleScale: function (event) {
    //if (this.isVisible) {
      this.scaleFactor *=
        1 + event.detail.spreadChange / event.detail.startSpread;

      this.scaleFactor = Math.min(
        Math.max(this.scaleFactor, this.data.minScale),
        this.data.maxScale
      );

      this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x;
      this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y;
      this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z;
    //}
  },
  
  /*
  handleRaycast: function (event) {
    console.log("Raycast!");
  },
  */
});
