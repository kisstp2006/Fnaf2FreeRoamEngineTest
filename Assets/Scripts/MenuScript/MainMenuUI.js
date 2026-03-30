export default class MainMenuUI extends FluxionBehaviour {

  start() {
    this.ui.onButtonClick('new_game', () => {
      this.log("New Gamere nyomtál");
    });
    this.ui.onButtonClick('continue', () => {
      this.log("Continuera nyomtál");
      
    });
    this.ui.onMouseEnter('new_game', () => {
      this.ui.setText('new_game',">>New Game");
    });
    this.ui.onMouseEnter('continue', () => {
      this.ui.setText('continue',">>Continue");
    });
    this.ui.onMouseExit('new_game', () => {
      this.ui.setText('new_game',"New Game");
    });
    this.ui.onMouseExit('continue', () => {
      this.ui.setText('continue',"Continue");
    });
  }

  update(dt) {
    
  }

}
