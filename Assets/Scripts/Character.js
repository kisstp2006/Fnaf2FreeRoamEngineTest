export default class Character extends FluxionBehaviour {
  // ── Inspector properties ────────────────────────────────────
  camera = new EntityRef('Camera');
  sensitivity = 0.15;
  maxPitch = 85;
  headHeight = 1.6;

  // ── Private state ────────────────────────────────────────────
  _yaw   = 0;
  _pitch = 0;

  onStart() {
    const tf = this.transform;
    if (tf) this._yaw = tf.rotation.y * Mathf.Rad2Deg;

    // Auto-detect camera child if no EntityRef was set in the Inspector
    if (this.camera.entity == null) {
      const camChild = this.findChildWithComponent(CameraComponent);
      if (camChild != null) {
        this.camera.entity = camChild;
        this.log(`FPS: camera child auto-detected (entity ${camChild})`);
      } else {
        this.log('FPS: no Camera child found — drag a Camera entity into the "camera" slot, or add a Camera component to a child entity.');
      }
    }

    Input.lockPointer();
    this.log('FPS Character ready — click viewport to capture mouse, Escape to release.');
  }

  onUpdate(dt) {
    if (Input.isMousePressed(0) && !Input.isPointerLocked()) {
      Input.lockPointer();
    }

    // ── Controls overlay ─────────────────────────────────────────
    if (!Input.isPointerLocked()) {
      Debug.drawText(new Vec2(8, 8), 'Left-click to capture mouse', '#94a3b8', 12);
    } else {
      Debug.drawText(new Vec2(8, 8),  'WASD — move   Space — jump', '#94a3b8', 12);
      Debug.drawText(new Vec2(8, 22), 'Shift — sprint   Ctrl/C — crouch   Esc — release', '#94a3b8', 12);
    }

    if (!Input.isPointerLocked()) return;

    // ── Mouse look ──────────────────────────────────────────────
    this._yaw   -= Input.mouseDelta.x * this.sensitivity;
    this._pitch -= Input.mouseDelta.y * this.sensitivity;
    this._pitch  = Mathf.clamp(this._pitch, -this.maxPitch, this.maxPitch);

    // Karakter YAW forgatása (vízszintes nézés)
    const charTf = this.transform;
    if (charTf) {
      charTf.rotation.set(0, this._yaw * Mathf.Deg2Rad, 0, 'YXZ');
      this.log(`[UPDATE] Yaw: ${this._yaw.toFixed(1)}°, Char rotation Y: ${(charTf.rotation.y * Mathf.Rad2Deg).toFixed(1)}°`);
    }

    // Kamera PITCH forgatása (függőleges nézés)
    const camTf = this.wrap(this.camera.entity).getComponent(TransformComponent);
    if (camTf) camTf.rotation.set(this._pitch * Mathf.Deg2Rad, 0, 0, 'YXZ');

    const sprint = Input.isKeyDown('ShiftLeft') || Input.isKeyDown('ShiftRight');
    this.cc.setRunning(sprint);

    const crouch = Input.isKeyDown('ControlLeft') || Input.isKeyDown('KeyC');
    this.cc.crouch(crouch);
  }

  onFixedUpdate(dt) {
    // Mozgáskezelés
    const h = Input.getAxis('KeyA', 'KeyD');
    const v = Input.getAxis('KeyS', 'KeyW');
    this.cc.move(h, -v);

    if (Input.isKeyPressed('Space')) this.cc.jump();

    // ── KÉNYSZERÍTETT FORGATÁS (JAVÍTÁS) ────────────────────────
    // A Physics.move() vagy a karakter fizikai komponense gyakran felülírja a rotációt.
    // Ezért minden fixedUpdate végén újra beállítjuk a helyes yaw szöget.
    const charTf = this.transform;
    if (charTf) {
      charTf.rotation.set(0, this._yaw * Mathf.Deg2Rad, 0, 'YXZ');
      this.log(`[FIXEDUPDATE] Yaw: ${this._yaw.toFixed(1)}°, Char rotation Y: ${(charTf.rotation.y * Mathf.Rad2Deg).toFixed(1)}°`);
    }

    // Kamera pozíció követése a karakter fejének magasságában
    const camTf = this.wrap(this.camera.entity).getComponent(TransformComponent);
    if (charTf && camTf) {
      camTf.position.set(charTf.position.x, charTf.position.y + this.headHeight, charTf.position.z);
    }
  }

  onDestroy() {
    if (Input.isPointerLocked()) Input.unlockPointer();
  }
}