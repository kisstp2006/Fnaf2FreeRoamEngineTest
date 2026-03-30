export default class JavascriptFlyCam extends FluxionBehaviour {
  speed = 10.0;
  sprintMultiplier = 3.0;
  sensitivity = 0.15;
  maxPitch = 89.0;

  _yaw = 0;
  _pitch = 0;

  onStart() {
    const tf = this.transform;
    if (tf) {
      this._yaw   = tf.rotation.y * Mathf.Rad2Deg;
      this._pitch = tf.rotation.x * Mathf.Rad2Deg;
    }
    this.log('FlyingCamera ready — right-click to capture mouse');
  }

  onUpdate(dt) {
    const tf = this.transform;
    if (!tf) return;

    if (Input.isMousePressed(2)) {
      if (Input.isPointerLocked()) Input.unlockPointer();
      else Input.lockPointer();
    }

    if (!Input.isPointerLocked()) {
      Debug.drawText(new Vec2(8, 8), 'Right-click to capture mouse', '#94a3b8', 12);
    } else {
      Debug.drawText(new Vec2(8, 8),  'WASD — move   QE — up / down', '#94a3b8', 12);
      Debug.drawText(new Vec2(8, 22), 'Shift — sprint   RMB — release mouse', '#94a3b8', 12);
    }

    if (Input.isPointerLocked()) {
      this._yaw   -= Input.mouseDelta.x * this.sensitivity;
      this._pitch -= Input.mouseDelta.y * this.sensitivity;
      this._pitch  = Mathf.clamp(this._pitch, -this.maxPitch, this.maxPitch);
      tf.rotation.set(this._pitch * Mathf.Deg2Rad, this._yaw * Mathf.Deg2Rad, 0, 'YXZ');
    }

    const sprint = Input.isKeyDown('ShiftLeft') || Input.isKeyDown('ShiftRight');
    const currentSpeed = this.speed * (sprint ? this.sprintMultiplier : 1.0);

    const localMove = new Vec3(
      Input.getAxis('KeyA', 'KeyD'),
      Input.getAxis('KeyQ', 'KeyE'),
      Input.getAxis('KeyW', 'KeyS'),
    );

    if (localMove.lengthSq() > 0) {
      localMove.normalize().multiplyScalar(currentSpeed * dt);
      const yawQ = new Quat().setFromAxisAngle(new Vec3(0, 1, 0), this._yaw * Mathf.Deg2Rad);
      localMove.applyQuaternion(yawQ);
      tf.position.add(localMove);
    }
  }

  onDestroy() {
    if (Input.isPointerLocked()) Input.unlockPointer();
  }
}
