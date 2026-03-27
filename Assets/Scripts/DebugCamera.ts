export default class DebugCamera extends FluxionScript {
  /** Movement speed in units/second */
  speed = 10.0;
  /** Sprint multiplier when holding Shift */
  sprintMultiplier = 3.0;
  /** Mouse look sensitivity (degrees per pixel) */
  sensitivity = 0.15;
  /** Maximum pitch angle in degrees */
  maxPitch = 89.0;

  private _yaw = 0;
  private _pitch = 0;

  onStart() {
    const tf = this.transform;
    if (tf) {
      // Initialise from current rotation so the camera doesn't snap
      this._yaw   = tf.rotation.y * Mathf.Rad2Deg;
      this._pitch = tf.rotation.x * Mathf.Rad2Deg;
    }
    this.log('FlyingCamera ready — right-click to capture mouse');
  }

  onUpdate(dt) {
    const tf = this.transform;
    if (!tf) return;

    // ── Pointer lock toggle (right mouse button) ──────────────
    if (this.input.isMousePressed(2)) {
      if (this.input.isPointerLocked()) {
        this.input.unlockPointer();
      } else {
        this.input.lockPointer();
      }
    }

    // ── Mouse look (only while pointer is locked) ─────────────
    if (this.input.isPointerLocked()) {
      this._yaw   -= this.input.mouseDelta.x * this.sensitivity;
      this._pitch -= this.input.mouseDelta.y * this.sensitivity;
      this._pitch  = Mathf.clamp(this._pitch, -this.maxPitch, this.maxPitch);
      // YXZ order: yaw first, then pitch — prevents gimbal lock
      tf.rotation.set(
        this._pitch * Mathf.Deg2Rad,
        this._yaw   * Mathf.Deg2Rad,
        0,
        'YXZ',
      );
    }

    // ── Keyboard movement ─────────────────────────────────────
    const sprint = this.input.isKeyDown('ShiftLeft') || this.input.isKeyDown('ShiftRight');
    const currentSpeed = this.speed * (sprint ? this.sprintMultiplier : 1.0);

    const localMove = new Vec3(
      this.input.getAxis('KeyA', 'KeyD'),   // left / right
      this.input.getAxis('KeyQ', 'KeyE'),   // down / up (world Y)
      this.input.getAxis('KeyW', 'KeyS'),   // forward / back
    );

    if (localMove.lengthSq() > 0) {
      localMove.normalize().multiplyScalar(currentSpeed * dt);
      // Rotate the XZ movement by the camera's yaw so "forward" always
      // points where the camera faces horizontally
      const yawQ = new Quat().setFromAxisAngle(
        new Vec3(0, 1, 0),
        this._yaw * Mathf.Deg2Rad,
      );
      const worldMove = new Vec3(localMove.x, 0, localMove.z).applyQuaternion(yawQ);
      worldMove.y += localMove.y; // vertical is always world-space
      tf.position.add(worldMove);
    }
  }

  onDestroy() {
    if (this.input.isPointerLocked()) this.input.unlockPointer();
  }
}
