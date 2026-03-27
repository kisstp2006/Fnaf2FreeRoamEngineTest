export default class P_CCamera extends FluxionScript {
  // Public fields appear as editable properties in the Inspector
  camera_speed = 5.0;

  onStart() {
    this.log('P_CCamera started');
    const tf = this.transform;
  }

  onUpdate(dt) {
    const tf = this.transform;
    //this.log("Mouse X: " + this.input.mousePosition.x);
    //this.log("Mouse Y: " + this.input.mousePosition.y);

    if(this.input.mousePosition.x<500){
      this.log("Mouse is on the left side of the screen");

    }
    else if(this.input.mousePosition.x>1400){
      this.log("Mouse is on the right side of the screen");

    }
  }

  onDestroy() {}
}
