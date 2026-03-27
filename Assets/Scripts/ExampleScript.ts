export default class ExampleScript extends FluxionScript {
  // speed = 5.0;

  onStart() {
    console.log('[Script] ExampleScript started on entity', this.entity);
  }

  onUpdate(dt) {
    // Called every frame.
  }
}
