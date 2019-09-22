let score = 0,
    audioKill,
    audioSelect,
    audioSelect4,
    audioBackground;

class PreloadState extends Phaser.State {

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
    this.load.image("btn-play", "assets/images/btn-play.png");
    this.load.image("donuts", "assets/images/donuts_logo.png");
	this.load.image("hero", "assets/images/donut.png");
	
	this.load.image("sound", "assets/images/btn-sfx.png");
	
	this.load.audio('startMusic', ['assets/audio/background.mp3']);
    this.load.audio('select', ['assets/audio/select-1.mp3']);
    this.load.audio('select4', ['assets/audio/select-4.mp3']);
    this.load.audio('kill', ['assets/audio/kill.mp3']);
	
    this.load.image( 'block1',     'assets/images/game/gem-1.png'   );
    this.load.image( 'block2',     'assets/images/game/gem-2.png'  );
    this.load.image( 'block3',     'assets/images/game/gem-3.png' );
    this.load.image( 'block4',     'assets/images/game/gem-4.png'   );
    this.load.image( 'block5',     'assets/images/game/gem-5.png' );
    this.load.image( 'block6',     'assets/images/game/gem-6.png' );
    this.load.image( 'block7',     'assets/images/game/gem-7.png'    );
    this.load.image( 'dead-block', 'assets/images/bean_dead.png'   );
  }
  
  

  create() {
	this.stage.backgroundColor = '#f8fffd';
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.add.sprite(0, 0, "background");
    this.add.sprite(this.world.centerX, this.world.centerY - 110, "donuts").anchor.setTo(0.5, 0.5);
	this.add.sprite(95, 550, "hero").anchor.setTo(0.5, 0.5);
    this.add.button(this.world.centerX - 130, 350, 'btn-play', actionOnClick, this, 2, 1, 0);
	this.add.button(455, 60, 'sound', soundOnOff, this, 2, 1, 0).anchor.setTo(0.5, 0.8);
	
	if (!audioBackground) {
            audioBackground = this.add.audio('startMusic', 1, true).play();
        }

        audioKill = this.add.audio('kill');
        audioSelect = this.add.audio('select');
        audioSelect4 = this.add.audio('select4');
    
  }
}

function soundOnOff(soundImg) {
    if (audioBackground.isPlaying) {
        audioBackground.stop();
        audioKill.mute = true;
        audioSelect.mute = true;
        audioSelect4.mute = true;
        soundImg.alpha = 0.5;
        soundImg.tint = 0xff0000;
    } else {
        audioBackground.play();
        audioKill.mute = false;
        audioSelect.mute = false;
        audioSelect4.mute = false;
        soundImg.alpha = 1;
        soundImg.tint = 0xffffff;
    }
}


function actionOnClick () {
	if(audioBackground.isPlaying) {
		audioBackground.stop();
	}
    
	this.state.start('PlayState');
	
}



export default PreloadState;
