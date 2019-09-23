import Grid  from './Grid.js';
import Field from './Field.js';
import Block from './Block.js';



class Board extends Phaser.Group {

  constructor(game, numCols = 2, numRows = 2, numBlockTypes = 3, contentSize = 1, padding = 1, gap = 0, score = 0) {
    super(game, null);

    
    this.numCols       = numCols;
    this.numRows       = numRows;
    this.numBlockTypes = numBlockTypes;
    this.contentSize   = contentSize;
    this.padding       = padding;
    this.gap           = gap;
	this.score         = score;
    
    this.isInteractive = true;

   
    this.blocks = new Phaser.Group(this.game, null);

    
    this.grid = new Grid(this.numCols, this.numRows);
    this.populateRandomly();

    
    this.fields = new Phaser.Group(this.game, null);
    this.grid.forEach((block, x, y) => {
      this.fields.add(
        new Field(
          this.game,
          x * (this.getBlockSize() + this.gap),
          y * (this.getBlockSize() + this.gap),
          this.getBlockSize()
        )
      );
    });

    
    this.add(this.fields);
    this.add(this.blocks);
  }

  populateRandomly() {
    this.blocks.setAll('exists', false);
    this.grid.populate((x, y) => this.createRandomBlock(x, y));

    if (this.getNumChained() > 0) {
      this.populateRandomly();
    }
  }

  createBlock(gx, gy, id) {
    let block = this.blocks.getFirstExists(false),
        bx    = gx * (this.getBlockSize() + this.gap) + this.padding + this.contentSize / 2,
        by    = gy * (this.getBlockSize() + this.gap) + this.padding + this.contentSize / 2;

    if (!block) {
      block = new Block(this.game, bx, by, id);
      block.setOnClick(this.pickBlock, this);
      this.blocks.add(block);
    } else {
      block.reset(bx, by, id);
    }

    return block;
  }

  createRandomBlock(gx, gy) {
    return this.createBlock(gx, gy, this.generateRandomId());
  }

  createMask() {
    this.mask = new Phaser.Graphics(this.game, 0, 0);
    this.mask.beginFill(0xffffff);
    this.mask.drawRect(this.x, this.y, this.width, this.height);
  }

  pickBlock(block) {
    if (!this.isInteractive) {
      return;
    }

    if (!this.selectedBlock) {
      this.selectedBlock = block;
      this.selectedBlock.select();
    } else {
      let pos1 = this.grid.getXY(this.selectedBlock),
          pos2 = this.grid.getXY(block);

    
      this.selectedBlock.unselect();
      this.selectedBlock = undefined;

      if (Board.areAdjacent(pos1.x, pos1.y, pos2.x, pos2.y)) {
        this.tentativeSwap(pos1.x, pos1.y, pos2.x, pos2.y);
      }
    }
  }

  swap(x1, y1, x2, y2, onComplete) {
    let block1 = this.grid.getAt(x1, y1),
        block2 = this.grid.getAt(x2, y2);

    var tween1 = this.game.add.tween(block1);
    tween1.to({x: block2.x, y: block2.y}, Board.TWEEN_TIME);
    tween1.start();

    var tween2 = this.game.add.tween(block2);
    tween2.to({x: block1.x, y: block1.y}, Board.TWEEN_TIME);
    if (onComplete) {
      tween2.onComplete.add(onComplete);
    }
    tween2.start();
  }

  tentativeSwap(x1, y1, x2, y2, onComplete) {
    this.isInteractive = false;
    this.swap(x1, y1, x2, y2, () => {
      this.grid.swap(x1, y1, x2, y2);
      if (this.getNumChained() > 0) {
        this.clearChains((success, numClears) => {
          if (onComplete) {
            onComplete(true, numClears);
          }
        });
      } else {
        this.game.time.events.add(Board.TWEEN_TIME, () => {
          this.grid.swap(x1, y1, x2, y2);
          this.swap(x1, y1, x2, y2);
          if (onComplete) {
            onComplete(false, 0);
          }
          this.isInteractive = true;
        });
      }
    });
  }

  drop(onComplete) {
    for (let x = 0; x < this.numCols; x++) {
      let lastReserveY = -1;
      for (let y = this.numRows - 1; y >= 0; y--) {
        if (this.isEmpty(x, y)) {
          for (let y2 = y - 1; y2 >= -1; y2--) {
            if (y2 >= 0) {
              if (!this.isEmpty(x, y2)) {
                this.grid.swap(x, y, x, y2);
                this.animateDrop(this.grid.getAt(x, y), y2, y);
                break;
              }
            } else {
              let randomBlock = this.createRandomBlock(x, y);
              this.grid.setAt(x, y, randomBlock);
              this.animateDrop(randomBlock, lastReserveY, y);
              lastReserveY--;
            }
          }
        }
      }
    }

    if (onComplete) {
      this.game.time.events.add(Board.TWEEN_TIME, onComplete);
    }
  }

  animateDrop(block, startRow, endRow) {
    block.y = startRow * (this.getBlockSize() + this.gap) + this.padding + this.contentSize / 2;

    let tween = this.game.add.tween(block);
    tween.to({y: endRow * (this.getBlockSize() + this.gap) + this.padding + this.contentSize / 2}, Board.TWEEN_TIME);
    tween.start();
  }

  clearChains(onComplete, numClears = 0) {
    this.isInteractive = false;

    let numChained = 0;

    this.forEachChained((block, x, y) => {
      numChained++;

      block.kill();
	  this.score = this.score + 1;
	  console.log(this.score);
	  
      this.grid.setAt(x, y, undefined);
    });
	
    if (numChained > 0) {
      numClears++;
      this.game.time.events.add(Block.DYING_TIME, () => {
        this.drop(() => {
          if (this.getNumChained() > 0) {
            this.clearChains(onComplete, numClears);
          } else {
            if (onComplete) {
              onComplete(true, numClears);
            }
            this.isInteractive = true;
          }
        });
      });
    } else {
      if (onComplete) {
        onComplete(false, 0);
      }
      this.isInteractive = true;
    }
  }

  // Determines whether a block at a given position is part of a chain/cluster or not
  isChained(x, y) {
    var value = this.grid.getAt(x, y).id;

    if (value == 0) return false;

    return this.grid.getAt(x - 1,   y  ) == value && this.grid.getAt(x - 2,   y  ) == value ||
           this.grid.getAt(x + 1,   y  ) == value && this.grid.getAt(x + 2,   y  ) == value ||
           this.grid.getAt(x - 1,   y  ) == value && this.grid.getAt(x + 1,   y  ) == value ||
           this.grid.getAt(  x  , y - 1) == value && this.grid.getAt(  x  , y - 2) == value ||
           this.grid.getAt(  x  , y + 1) == value && this.grid.getAt(  x  , y + 2) == value ||
           this.grid.getAt(  x  , y - 1) == value && this.grid.getAt(  x  , y + 1) == value;
  }

  forEachChained(callback) {
    let chained = [];
    this.grid.forEach((block, x, y) => {
      if (this.isChained(x, y)) {
        chained.push({block: block, x: x, y: y});
      }
    });
    chained.forEach(data => {
      callback(data.block, data.x, data.y);
    });
  }

  
  getNumChained() {
    let numChained = 0;

    this.grid.forEach((block, x, y) => {
      if (this.isChained(x, y)) {
          numChained++;
      }
    });

    return numChained;
  }

  
  isEmpty(x, y) {
    let value = this.grid.getAt(x, y);

    if (!value) {
      return true;
    } else {
      return this.grid.getAt(x, y).id == 0;
    }
  }

  getBlockSize() {
    return this.contentSize;
  }

 
  generateRandomId() {
    return Math.floor(Math.random() * this.numBlockTypes) + 1;
  }

}

Board.TWEEN_TIME = 200;

Board.areAdjacent = function(x1, y1, x2, y2) {
  return x1 == x2 && Math.abs(y1 - y2) == 1 || y1 == y2 && Math.abs(x1 - x2) == 1;
}

export default Board;
