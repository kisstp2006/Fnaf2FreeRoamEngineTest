export default class P_CCamera extends FluxionBehaviour {
  // 🔹 Konfiguráció – rad/sec-ben
  camera_speed = 1.5;               // Forráskamera forgatási sebessége
  rotation_limit = Math.PI / 2;     // 90° max fordulattartomány
  deadzone = 0.2;                   // 20% középső biztonságos zóna

  screen_width = 1024;              // Default – Debug-ban dinamikusan is frissíthető!

  debug_mode = false;               // ✅ Ki/be kapcsolható
  show_mouse = true;                // Mouse pozíció jelenítése
  show_rotation = true;             // Forogtatás infója
  show_stats = true;                // Eredeti statok (speed, limit)

  // 🔹 Debug színek és beállítások
  debug_color = new Color(0.2, 0.8, 1); // Kék (#00aaff)
  debug_font_size = 14;             // Fontméret pixelben
  debug_font_weight = 600;          // Bold font (600 = semi-bold)

  update(dt: number) {
    const tf = this.gameObject.transform;
    if (!tf) return;

    const screenWidth = window.innerWidth || this.screen_width; // ✅ Window fallback!
    
    // 🔹 Mouse pozíció szinkronizálása a képernyő szélességével
    const mouseX = Math.abs(this.Input.mousePosition.x);
    const mouseY = this.Input.mousePosition.y;
    const mouseNormalized = (mouseX / screenWidth) * 100; // 0-100% X

    // 🔹 Screen width határok (deadzone alkalmazva)
    const leftEdge = screenWidth * this.deadzone;
    const rightEdge = screenWidth * (1 - this.deadzone);

    // 🎮 Forogtatás Y tengely körül (kamera fordítása jobbra-balra)
    if (this.debug_mode && show_mouse) {
      console.log(`MouseX: ${mouseX}px | MouseY: ${mouseY}px | Normalized: ${mouseNormalized.toFixed(1)}%`);
    }

    if (mouseX < leftEdge) {
      tf.rotation.y += this.camera_speed * dt;
    } else if (mouseX > rightEdge) {
      tf.rotation.y -= this.camera_speed * dt;
    }

    // 🔒 Limitálás – Vector3 típusú forgatás beállítása (x=0, y=fordult érték, z=0)
    const rotatedY = Mathf.clamp(
      tf.rotation.y,
      -this.rotation_limit,
      this.rotation_limit
    );

    tf.rotation.set(0, rotatedY, 0);

    // 🔹 Debug szöveg kiírása – Ha enabled!
    if (debug_mode) {
      const debugText = [
        `📍 Mouse: ${mouseX.toFixed(0)}px`,
        `   Norm: ${(mouseNormalized - 20).toFixed(1)}%`
      ];

      // Forogtatás információját – Rad és Deg-ben!
      if (show_rotation) {
        const rotationDeg = Mathf.radToDeg(rotatedY); // Új Mathf API? Ha nincs, írd át kézzel!
        debugText.push(`🔀 Rotation Y: ${rotatedY.toFixed(4)} rad | ${rotationDeg.toFixed(1)}°`);
      }

      // 📊 Statisztikák (speed, limit)
      if (show_stats) {
        debugText.push(`⚙️ Speed: ${this.camera_speed.toFixed(2)} rad/s`);
        debugText.push(`   Limit: ±${Mathf.radToDeg(this.rotation_limit).toFixed(0)}°`);
        debugText.push(`   Deadzone: ${(this.deadzone * 100).toFixed(0)}%`);
      }

      // ✨ Debug szöveg hozzáadása képernyőre
      const debugLine = `Debug: ${debugText.join('\n')}`;
      Debug.drawText(vec2(8, 8), debugLine, color_hex("#4ade80"), this.debug_font_size);
    }

    // 🔹 Toggle – Lebegő billentyűvel (F12)
    if (this.Input.isKeyPressed("Key_F12")) {
      this.Debug.log(`Debug mode ${debug_mode ? 'OFF' : 'ON'}`);
      debug_mode = !debug_mode;
    }
  }

  // 🔹 Start – Debug információk betöltése
  start(): void {
    const camComponent = this.gameObject.getComponent("Camera");
    if (camComponent) {
      this.screen_width = window.innerWidth || 1024; // Default fallback
      this.Debug.log(`✅ Camera debug inicializálva!`);
      this.Debug.log(`   Screen Width: ${this.screen_width}px`);
      this.Debug.log(`   Deadzone: ${(this.deadzone * 100).toFixed(0)}%`);
    }
  }
}
