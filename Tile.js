var tileSize = squareSize * 0.75;

class Tile {
  constructor(arrayX, arrayY, playerId) {

    this.arrayX = arrayX;
    this.arrayY = arrayY;
    this.playerId = playerId;
    this.x = Board.getPos(arrayX, arrayY)[0];
    this.y = Board.getPos(arrayX, arrayY)[1];
    this.move = 0;

    this.fallAnimation = height;
    this.bounceBackAnimation = 0;
    this.bounceBackAnimationScale = 0;
    this.justFell = true;
    this.fallVol = 0;

  }

  render() {
    if (this.fallAnimation > 0) {
      this.fallVol += 2.5;
      this.fallAnimation = Math.max(0,this.fallAnimation-this.fallVol);
    }

    if (this.bounceBackAnimation == 0)
      this.move += 0.05;
    if (this.move > 2 * (PI))
      this.move = 0;
    let bounce = cos(this.move);
    ellipseMode(CORNER);
    noStroke();
    fill(players[this.playerId].color);
    this.dx = this.x + (squareSize - tileSize) / 2;
    this.dy = this.y + bounce * (squareSize / 50) - (this.fallAnimation) - sin((2 * PI) * this.bounceBackAnimation) * (squareSize / 10) * this.bounceBackAnimationScale;
    ellipse(this.dx, this.dy, tileSize);
    new tileEllipse(this.dx, this.dy, tileSize, players[this.playerId].color);

    if (this.fallAnimation > 0)
      this.fallAnimation = Math.max(this.fallAnimation - 0.05, 0);
    else if (this.bounceBackAnimation == 0 && this.justFell) {
      this.justFell = false;
      if (this.arrayY + 1 == BOARD_HEIGHT || board.boardState[this.arrayX][this.arrayY + 1].bounceBackAnimation == 0)
        for (let i = this.arrayY; i < BOARD_HEIGHT; i++)
          if (board.boardState[this.arrayX][i]) {
            board.boardState[this.arrayX][i].bounceBackAnimation = 1;
            board.boardState[this.arrayX][i].bounceBackAnimationScale = 0.3 + 0.7*(this.fallVol/100);
          }
    } else if (this.bounceBackAnimation > 0) {
      this.bounceBackAnimation = Math.max(this.bounceBackAnimation - 0.05, 0);
    }
  }

}

let tileEllipses = [];
class tileEllipse {
  constructor(x, y, r, fill) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.fill = fill;
    this.reduce = r * 0.1;
    tileEllipses.push(this);
  }

  static renderEllipses() {
    let liveTiles = [];
    for (let i = 0; i < tileEllipses.length; i++) {
      if (tileEllipses[i].r <= 0)
        continue;

      ellipseMode(CENTER);
      noStroke();
      fill(color(tileEllipses[i].fill));
      ellipse(tileEllipses[i].x + squareSize * 0.75 / 2, tileEllipses[i].y + squareSize * 0.75 / 2, tileEllipses[i].r);
      tileEllipses[i].r -= tileEllipses[i].reduce;
      liveTiles.push(tileEllipses[i]);
    }
    tileEllipses = liveTiles;
  }

}

let exlipses = [];
let exlipseGravity = 1;
class explodeEllipse {
  constructor(x, y, r, fill, vx, vy, parent) {
    this.x = parent.dx;
    this.y = parent.dy;
    this.r = r;
    this.fill = fill;
    this.vx = vx;
    this.vy = vy;
    this.parent = parent;
    exlipses.push(this);
  }

  render() {
    noStroke();
    ellipseMode(CORNER);
    fill(this.fill);
    ellipse(this.x, this.y, tileSize);
    this.x -= this.vx;
    this.y -= this.vy;
    this.vy -= exlipseGravity;
  }

  static render() {
    let live = [];
    exlipses.forEach(elm => {
      elm.render();
      if (elm.y < height)
        live.push(elm);
    });
    exlipses = live;
  }
}