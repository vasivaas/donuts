class GameTimer extends Phaser.State {

  init() {
    
    this.game.stage.backgroundColor = '#fff';

    
    this.preloaderBar = new Phaser.Sprite(this.game, this.game.world.centerX, this.game.world.centerY, 'bar');
    this.preloaderBar.anchor.setTo(0.5);
    this.preloaderBar.scale.setTo(100, 1);

    
    this.load.setPreloadSprite(this.preloaderBar);

   
    this.game.world.add(this.preloaderBar);
	}

  preload() {
    
	
    // Load images
	this.load.image("background", "assets/images/backgrounds/background.jpg");
    this.load.image("timeover", "assets/images/text-timeup.png");
	this.load.image("mainmenu", "assets/images/button-back.png");
    this.load.image("replay", "assets/images/btn-play.png");
  }
  
  

  create() {
	this.stage.backgroundColor = '#f8fffd';
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.add.sprite(0, 0, "background");
    this.add.sprite(this.world.centerX, this.world.centerY - 135, "timeover").anchor.setTo(0.5, 0.5);
	this.add.button(this.world.centerX - 165, 220, 'mainmenu', actionOnClick1, this, 2, 1, 0);
    this.add.button(this.world.centerX - 130, 350, 'replay', actionOnClick, this, 2, 1, 0);
	
    
  }
}




function actionOnClick () {
    this.state.start('PlayState');
}

function actionOnClick1 () {
    this.state.start('PreloadState');
}

export default GameTimer;
