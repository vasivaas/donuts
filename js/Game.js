import BootState    from './states/BootState.js';
import PreloadState from './states/PreloadState.js';
import PlayState    from './states/PlayState.js';
import GameTimer    from './states/GameTimer.js';

export default class Game extends Phaser.Game {
  constructor(width, height) {
    super(width, height, Phaser.AUTO);
    
    this.state.add( 'BootState',    BootState    );
    this.state.add( 'PreloadState', PreloadState );
    this.state.add( 'PlayState',    PlayState    );
	this.state.add('GameTimer',  GameTimer        );
    this.state.start('BootState');
  }
}

Game.create = function(width, height) {
  return new Game(width, height);
}
