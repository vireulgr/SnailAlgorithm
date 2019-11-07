
/*********************************************************************************
  Snail Walker Inside
*********************************************************************************/
function SnailWalkerInside(c, r) {

  this.colsStart = c;
  this.rowsStart = r;
  this.curPoint = [0, 0];
  this.coordIndex = 0;
  this.step = 1;

}

//================================================================================
SnailWalkerInside.prototype.nextDirection = function (orientation) {
  if(orientation === 0) {
    this.step = this.coordIndex === 0 ? this.step : -this.step;
    this.coordIndex = (this.coordIndex + 1) % 2;
  }
  else {
    this.step = this.coordIndex === 1 ? this.step : -this.step;
    this.coordIndex = (this.coordIndex + 1) % 2;
  }
}

//================================================================================
SnailWalkerInside.prototype.performPiStep = function * (cols, rows) {

  let passLength = ((this.coordIndex === 0)? cols : rows )-1;

  yield this.curPoint;

  for(let piPass = 0; piPass < 2; ++piPass) {

    for(let i = 0; i < passLength; ++i) {
      this.curPoint[this.coordIndex] += this.step;
      yield this.curPoint;
    }

    this.nextDirection(0);

    passLength = ((this.coordIndex === 0)? cols : rows )-1;
  }

  // это отдельно, чтобы не менять направления (nextDirection)
  for(let i = 0; i < passLength; ++i) {
    this.curPoint[this.coordIndex] += this.step;
    yield this.curPoint;
  }
}

//================================================================================
SnailWalkerInside.prototype.initInside = function () {

  this.curPoint = [0, 0];
  this.coordIndex = 0;
  this.step = 1;

  return [this.colsStart, this.rowsStart];
}

//================================================================================
SnailWalkerInside.prototype[Symbol.iterator] = function * () {

  let [cols, rows] = this.initInside();

  while(true) {

    yield * this.performPiStep(cols, rows);

    // повернуть на следующий П
    this.nextDirection(0);

    // проверка окончания итераций
    let tmpCols = (cols - (this.coordIndex === 1 ? 1 : 2));
    let tmpRows = (rows - (this.coordIndex === 0 ? 1 : 2));
    if( tmpCols <= 0 || tmpRows <= 0 ) break;

    // шагнуть на следующий П
    this.curPoint[this.coordIndex] += this.step;

    // perform new П shape
    cols -= this.coordIndex === 1 ? 1 : 2;
    rows -= this.coordIndex === 0 ? 1 : 2;
  }
}

/*********************************************************************************
  Snail Walker Outside
*********************************************************************************/
function SnailWalkerOutside(c, r) {

  this.colsStop = c;
  this.rowsStop = r;
  this.curPoint = [ 0, 0 ];
  this.coordIndex = 0;
  this.step = 1;
}

//================================================================================
SnailWalkerOutside.prototype.nextDirection = function (orientation) {
  if(orientation === 0) {
    this.step = this.coordIndex === 0 ? this.step : -this.step;
    this.coordIndex = (this.coordIndex + 1) % 2;
  }
  else {
    this.step = this.coordIndex === 1 ? this.step : -this.step;
    this.coordIndex = (this.coordIndex + 1) % 2;
  }
}

//================================================================================
SnailWalkerOutside.prototype.performPiStep = function * (cols, rows) {

  let passLength = ((this.coordIndex === 0)? cols : rows )-1;

  yield this.curPoint;

  for(let piPass = 0; piPass < 2; ++piPass) {

    for(let i = 0; i < passLength; ++i) {
      this.curPoint[this.coordIndex] += this.step;
      yield this.curPoint;
    }

    this.nextDirection(0);

    passLength = ((this.coordIndex === 0)? cols : rows )-1;
  }

  // это отдельно, чтобы не менять направления (nextDirection)
  for(let i = 0; i < passLength; ++i) {
    this.curPoint[this.coordIndex] += this.step;
    yield this.curPoint;
  }
}

//================================================================================
SnailWalkerOutside.prototype.initOutside = function () {

  let minDim = (this.colsStop < this.rowsStop ? this.colsStop : this.rowsStop) -1;

  this.step = 1;

  let [cols, rows] = [2, 2];

  if(this.colsStop > this.rowsStop) {
    if(this.rowsStop === 2) {
      this.curPoint = [1,0];
      cols = this.colsStop - 1;
    }
    else {
      this.curPoint = [Math.floor(minDim / 2), Math.floor(minDim / 2)];
      cols = this.colsStop - 2 * Math.floor(minDim/2);
    }
    this.coordIndex = 0;
  }
  else if(this.colsStop < this.rowsStop){
    if(this.colsStop === 2) {
      rows = this.rowsStop -1;
      this.curPoint = [1, 1];
    }
    else {
      rows = this.rowsStop - 2 * Math.floor(minDim /2);
      this.curPoint = [Math.ceil(minDim / 2), Math.floor(minDim / 2)];
    }
    this.coordIndex = 1;
  }
  else {
    this.curPoint = [Math.floor(minDim / 2), Math.floor(minDim / 2)];
    this.coordIndex = 0;
    cols = 2;
    rows = 2;
  }

  return [cols, rows];
}

//================================================================================
SnailWalkerOutside.prototype[Symbol.iterator] = function * () {

  let [cols, rows] = this.initOutside();

  while(true) {

    yield * this.performPiStep(cols, rows);

    // шагнуть на следующий П
    this.curPoint[this.coordIndex] += this.step;

    // повернуть на следующий П
    this.nextDirection(0);

    let tmpCols = (cols + (this.coordIndex === 0 ? 1 : 2));
    let tmpRows = (rows + (this.coordIndex === 1 ? 1 : 2));
    if( tmpCols > this.colsStop || tmpRows > this.rowsStop ) break;

    // perform new П shape
    cols += this.coordIndex === 0 ? 1 : 2;
    rows += this.coordIndex === 1 ? 1 : 2;
  }

  for(let i = 0; i < 2; ++i) {
    if(this.coordIndex === 1 && cols < this.colsStop) {
      yield this.curPoint;
      let passLength = rows - 1;
      for(let i = 0; i < passLength; ++i) {
        this.curPoint[this.coordIndex] += this.step;
        yield this.curPoint;
      }

      // шагнуть на следующий П
      this.curPoint[this.coordIndex] += this.step;

      // повернуть на следующий П
      this.nextDirection(0);

      cols += 1;
    }

    if(this.coordIndex === 0 && rows < this.rowsStop) {
      yield this.curPoint;
      let passLength = cols - 1;
      for(let i = 0; i < passLength; ++i) {
        this.curPoint[this.coordIndex] += this.step;
        yield this.curPoint;
      }

      // шагнуть на следующий П
      this.curPoint[this.coordIndex] += this.step;

      // повернуть на следующий П
      this.nextDirection(0);

      rows += 1;
    }
  }
}

//export {SnailWalkerInside, SnailWalkerOutside};

