class BootState extends Phaser.State {

  init() {
    this.scale.scaleMode             = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically   = true;
  }

  preload() {

    // Load images
    this.load.image('bar', 'assets/images/preloader-bar.png');
	
  }

  create() {
    this.state.start('PreloadState');
  }

}

export default BootState;
