class Field extends Phaser.Sprite {
  constructor(game, x, y, size) {
    super(game, x, y);

    
    this.imgBg = new Phaser.BitmapData(this.game, '', size, size);
    this.imgBg.ctx.fillStyle = '#000';
    this.imgBg.ctx.fillRect(0, 0, size, size);

    
    this.loadTexture(this.imgBg);

    
    this.alpha = 0.2;
  }
}

export default Field;
