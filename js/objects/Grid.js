class Grid {
  constructor(numCols, numRows) {
   
    this.numCols = numCols;
    this.numRows = numRows;

   
    this.populate((x, y) => undefined);
  }

  populate(callback) {
    if (!this.data) {
      this.data = [];
    }

    for (let y = 0; y < this.numRows; y++) {
      if (!this.data[y]) {
        this.data[y] = [];
      }

      for (let x = 0; x < this.numCols; x++) {
        this.data[y][x] = callback(x, y);
      }
    }
  }

  getAt(x, y) {
    if (!this.data[y]) {
      return undefined;
    }

    return this.data[y][x];
  }

  setAt(x, y, value) {
    if (!this.data[y]) {
      this.data[y] = [];
    }

    this.data[y][x] = value;
  }

  getXY(element) {
    return this.forEach((e, x, y) => {
      if (e === element) {
        return {x: x, y: y};
      }
    });
  }

  swap(x1, y1, x2, y2) {
    let temp = this.getAt(x1, y1);
    this.setAt(x1, y1, this.getAt(x2, y2));
    this.setAt(x2, y2, temp);
  }

  map(callback) {
    var result = [];

    for (let y = 0; y < this.numRows; y++) {
      result[y] = [];
      for (let x = 0; x < this.numCols; x++) {
        result[y][x] = callback(this.data[y][x], x, y);
      }
    }

    return result;
  }

  forEach(callback) {
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numCols; x++) {
        let result = callback(this.data[y][x], x, y);
        if (result) {
          return result;
        }
      }
    }
  }

  toString() {
    var strGrid = '\n';

    for (let y = 0; y < this.numRows; y++) {
      let strRow = '';
      for (let x = 0; x < this.numCols; x++) {
        strRow += this.getAt(x, y) + ' ';
      }
      strGrid += strRow + '\n';
    }

    return strGrid;
  }

  log() {
    console.log(this.toString());
  }
}

export default Grid;
