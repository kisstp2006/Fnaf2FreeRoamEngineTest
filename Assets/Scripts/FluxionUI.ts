export default class FluxionUI extends FluxionScript {
  score = 0;
  health = 100;

  onStart() {
    // Build the HUD document with the fluent builder.
    // No .fui file needed — the UI is defined in code.
    const doc = new FuiBuilder(400, 120)
      .panel('bg', 0, 0, 400, 120, { bg: '#00000099', radius: 10 })
      .label('score_label', 16, 12, 370, 40, 'Score: 0', {
        color: '#ffe066', fontSize: 28, parent: 'bg',
      })
      .label('health_label', 16, 60, 200, 32, 'HP: 100', {
        color: '#66ff99', fontSize: 22, parent: 'bg',
      })
      .button('restart_btn', 260, 56, 120, 36, 'Restart', {
        bg: '#3a86ff', radius: 6, fontSize: 16, parent: 'bg',
      })
      .build();

    // Attach the document to the FuiComponent on this entity.
    this.ui.create(doc);

    // Listen for button clicks
    this.ui.onButtonClick('restart_btn', () => {
      this.score = 0;
      this.health = 100;
    });
  }

  onUpdate(dt) {
    this.score += dt * 10;
    this.ui.setText('score_label', 'Score: ' + Math.floor(this.score));
    this.ui.setText('health_label', 'HP: ' + this.health);
  }
}
