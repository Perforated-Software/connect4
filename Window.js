var INTIAL_WINDOW = 1;

let currentWindow = INTIAL_WINDOW;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  intialWindowSetup();
}

function intialWindowSetup() {
  switch (currentWindow) {
    case (0):
      Menu.setup();
      break;
    case (1):
      Game.setup();
      break;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  landscape = window.innerWidth > window.innerHeight;
  findWidth = landscape ? window.innerWidth - window.innerWidth * shoulderSize : window.innerWidth;
  percentWidth = window.innerWidth / 1920;
  percentHeight = window.innerHeight / 969;
  squareSize = Math.min(findWidth * 0.9 / BOARD_WIDTH, window.innerHeight * 0.9 / BOARD_HEIGHT);
  percentSS = (squareSize / 145);
  WIDTH = squareSize * BOARD_WIDTH;
  HEIGHT = squareSize * BOARD_HEIGHT;
  hShift = Math.max((window.innerWidth - (squareSize * BOARD_WIDTH)) / 2);
  if (hShift < window.innerHeight / 3 && landscape)
    hShift = hShift * 1.9;
 vShift = landscape ? (window.innerHeight - (squareSize * BOARD_HEIGHT)) / 2 : Math.max(window.innerHeight*headSpaceSize, (window.innerHeight - (squareSize * BOARD_HEIGHT)) * 0.9);
  tileSize = squareSize * 0.75;
  board.updateTilePosition();
  playerButtons = [];
  buttons = [];
  grdimg = null;
  addPlayerButton = null;
  subPlayerButton = null;
  connectButton = null;

}

function draw() {
  // switch (currentWindow) {
  //   case (0):
  //     Menu.render();
  //     break;
  //   case (1):
  //     Game.render();
  //     break;
  // }
  Game.render();

}

function mouseClicked() {
  switch (currentWindow) {
    case (0):
      Menu.mouseClicked();
      break;
    case (1):
      Game.mouseClicked();
      break;
  }
}

let grdimg = null;
function setGradient(x, y, w, h, c1, c2, axis) {
  if (grdimg == null) {
    grdimg = createGraphics(w, h);
    grdimg.noFill();

    if (axis === 0) {
      // Top to bottom gradient
      for (let i = y; i <= y + h; i++) {
        let inter = map(i, y, y + h, 0, 1);
        let c = lerpColor(c1, c2, inter);
        grdimg.stroke(c);
        grdimg.line(x, i, x + w, i);
      }
    } else if (axis === 1) {
      // Left to right gradient
      for (let i = x; i <= x + w; i++) {
        let inter = map(i, x, x + w, 0, 1);
        let c = lerpColor(c1, c2, inter);
        grdimg.stroke(c);
        grdimg.line(i, y, i, y + h);
      }
    }
  }
  image(grdimg, x, y);
}

let img_crown;
let img_ai = [];
let img_addPlayer;
let img_c4logo;
function preload() {
  img_crown = loadImage('resources/images/crown.png');
  img_addPlayer = loadImage('resources/images/add.png');
  img_subPlayer = loadImage('resources/images/sub.png');
  img_c4logo = loadImage('resources/favicons/android-icon-512x512.png');
  img_ai.push(loadImage('resources/images/AI_Enabled.png'));
  img_ai.push(loadImage('resources/images/AI_Disabled.png'));
}