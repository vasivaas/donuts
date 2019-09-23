import Block from '../objects/Block.js';
import Board from '../objects/Board.js';
import Grid  from '../objects/Grid.js';

let gameOverText;
var scoreText;
let audioKill,
    audioBackground;
	
class PlayState extends Phaser.State {
	
  preload() {
	  this.load.image('button-pause', 'assets/images/button-pause.png');
	  this.load.image('score', 'assets/images/bg-score.png');

      this.load.image("sound", "assets/images/btn-sfx.png");
	
	  this.load.audio('startMusic', ['assets/audio/background.mp3']);
	  this.load.audio('kill', ['assets/audio/kill.mp3']);
    }

  create() {
	  
    
    this.bg = this.add.sprite(0, 0, "background");
	
	this.add.image(-15,0, 'score');
	this.add.button(450, 60, 'button-pause', this.managePause, this).anchor.setTo(0.5, 0.8);;
    
    this.board = new Board(this.game, 8, 7, 7, 45, 2, 2, 0);
    this.board.x = this.game.world.centerX - this.board.width  / 2;
    this.board.y = this.game.world.centerY - this.board.height / 4;

    // Add game objects to world
    this.game.world.add(this.bg);
    this.game.world.add(this.board);

	scoreText = this.add.text(90, 25, this.board.score, { font: "35px Fredoka One", fill: "#ffffff"});
	
	this.timeInSeconds = 25;
    this.timeText = this.game.add.text(195, 28, "",{font: '35px Fredoka One', fill:'#000000'});
    this.timer = this.game.time.events.loop(Phaser.Timer.SECOND, this.updateTimer, this);
	
	this.add.button(450, 140, 'sound', this.soundOnOff, this, 2, 1, 0).anchor.setTo(0.5, 0.8);
	
	if (!audioBackground) {
            audioBackground = this.add.audio('startMusic', 1, true).play();
        }
	if(this.kill === true) {
			
		}
  }
  
   soundOnOff(soundImg) {
    if (audioBackground.isPlaying) {
        audioBackground.stop();
        soundImg.alpha = 0.5;
        soundImg.tint = 0xff0000;
    } else {
        audioBackground.play();
        soundImg.alpha = 1;
        soundImg.tint = 0xffffff;
    }
}

  
  managePause(){
		
		this.game.paused = true;
		
		var pausedText = this.add.text(100, 250, "Game paused.\nTap anywhere to continue.", this._fontStyle);
		
		this.input.onDown.add(function(){
			
			pausedText.destroy();
			
			this.game.paused = false;
		}, this);
	}

    
    updateTimer() {
        this.timeInSeconds--;
        var minutes = Math.floor(this.timeInSeconds / 60);
        var seconds = this.timeInSeconds - (minutes * 60);
        var timeString = this.addZeros(minutes) + ":" + this.addZeros(seconds);
        this.timeText.text = timeString;
    
        if (this.timeInSeconds == 0) {
            
			gameOverText = `Game Over.\n Press play button to play again`; /*Замына тексту на картинку тайм ап*/
			
			this.state.start("GameTimer");
        }
    }
    addZeros(num) {
        if (num < 10) {
            num = "0" + num;
        }
        return num;
    }
	
}

export default PlayState;
