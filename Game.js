var BOARD_WIDTH = 7;
var BOARD_HEIGHT = 6;
var NUMBER_PLAYERS = 2;
var CONNECT_NUM = 4;
var shoulderSize = 1 / 4; // Padding on sides of the board
var headSpaceSize = 1 / 4; // Padding on top of board
var COLORS = new Array('#FFEF94', '#DE8C6D', '#A6DDCA', '#C7B7D9', '#FFCB89', '#A3ABD2', '#BDD689', '#EAD7B5', '#CCFFCC', '#FFEEFF'); // Tile colours
var fadeIn = document.createElement("div"); // Element for fade in effect
fadeIn.style = "opacity: 1; background-image: linear-gradient(rgb(61, 114, 198), rgb(61, 74, 198));width: 100%; height: 100%;position: absolute; top: 0; left: 0;"; // ^
window.onload = (function () { document.body.appendChild(fadeIn); }); // ^

// Sizing vars
var landscape = window.innerWidth > window.innerHeight; // Variable to keep track if window is in landscape
var findWidth = landscape ? window.innerWidth - window.innerWidth * shoulderSize : window.innerWidth; // Depending on the ratio of the screen change layout
var squareSize = Math.min(findWidth * 0.9 / BOARD_WIDTH, window.innerHeight * 0.9 / BOARD_HEIGHT); // How large the board squares should be
var WIDTH = squareSize * BOARD_WIDTH; // Board width
var HEIGHT = squareSize * BOARD_HEIGHT; // Board height
var percentWidth = window.innerWidth / 1920;  // Percent scale based on design scale
var percentHeight = window.innerHeight / 969; // ^
var percentSS = (squareSize / 145);           // ^

// Specfic State
let turn = 0;
let board;
let players;
let availableColors = COLORS.slice(0);
let prevWinner = -1;
let winnerGoesFirst = 1;
let prevFirst = 0;
let AIEnabled = [1];
let gameLog = "";

// General State
let ui;
let hShift = Math.max((window.innerWidth - (squareSize * BOARD_WIDTH)) / 2); // Depending on screen size display differently
if (hShift < window.innerHeight / 3 && landscape) // ^
  hShift = hShift * 1.9; // ^
let vShift = landscape ? (window.innerHeight - (squareSize * BOARD_HEIGHT)) / 2 : Math.max(window.innerHeight * headSpaceSize, (window.innerHeight - (squareSize * BOARD_HEIGHT)) * 0.9); // ^
let gameOver = 0;
let lastestTile;
let addWButton;
let addHButton;
let winPos = [];
let fadeInAnimation = 0;

class Game {
  static setup() { // Set up new game

    board = new Board(BOARD_WIDTH, BOARD_HEIGHT); // Create a new board

    ui = new UI(); // Initialize UI
    players = new Array(NUMBER_PLAYERS); // Dynamic array of players
    for (let i = 0; i < NUMBER_PLAYERS; i++)
      players[i] = new Player(availableColors.shift(), i, AIEnabled.includes(i)); // Fill array with players

    strokeJoin(ROUND); // Set stroke type
    noStroke();
    if (AIEnabled.includes(0)) // If the first player is an AI, they should do their turn
      AI.startAITurn();
  }


  static render() {

    if (fadeIn.style.opacity > 0)
      fadeIn.style.opacity = parseFloat(fadeIn.style.opacity) - 0.02; // If the fade is not complete reduce the fade opacity

    setGradient(0, 0, width, height, color('rgb(61, 114, 198)'), color('rgb(61, 74, 198)'), 0); // Draw the background as a gradient
    ui.renderOuterUI(); // Render UI around board
    push(); // Start new draw phase
    translate(hShift, vShift); // Translate the coordinates so the things can draw on the board more easily
    board.render(); // Render board / tiles
    ui.renderGameUI(); // Render other UI
    pop(); // Finish draw phase

    if (!buttons.includes(addWButton)) // Create button if it was deleted (for changing)
      if (landscape) // Change button position depending on UI layout
        addWButton = new Button('rectangle', [width * 0.05, height * 0.03], width * 0.065, height * 0.95, function () { // Create a rectangular button 
          let size = prompt("How many spaces wide should the board be:", "7"); // Run this on click
          if (size == null); // Don't do anything if they didn't enter anything
          else if (!parseInt(size)) // Must be int
            alert("That's not a number");
          else if (size != null && parseInt(size)) { // Double check
            if (parseInt(size) <= 50) { // Limit to 50
              board.clear(); // Reset the board
              BOARD_WIDTH = parseInt(size); // Set the board width
              board = new Board(BOARD_WIDTH, BOARD_HEIGHT); // Create new board
              windowResized(); // Update UI for different board dimension
            } else {
              alert("Please keep it under 50, it's probably for the best.");
            }
          }
        }, function () { // Draw the button
          stroke(255);
          strokeWeight(3 * percentWidth);
          noFill();
          rect(width * 0.065, height * 0.95, width * 0.05, height * 0.03, 10 * percentWidth);
          fill(255);
          textSize(Math.min(height * 0.03, width * 0.01));
          strokeWeight(2 * percentWidth);
          text("WIDTH", width * 0.065 + (width * 0.05 - textWidth("WIDTH")) / 2, height * 0.95 + textSize());
        });
      else // Same as above except for drawing and position
        addWButton = new Button('rectangle', [width * 0.05, height * 0.03], width * 0.065, height * 0.05, function () {
          let size = prompt("How many spaces wide should the board be:", "7");
          if (size == null);
          else if (!parseInt(size))
            alert("That's not a number");
          else if (size != null && parseInt(size)) {
            if (parseInt(size) <= 50) {
              board.clear();
              BOARD_WIDTH = parseInt(size);
              board = new Board(BOARD_WIDTH, BOARD_HEIGHT);
              windowResized();
            } else {
              alert("Please keep it under 50, it's probably for the best.");
            }
          }
        }, function () { // Draw with shortened Width (W)
          stroke(255);
          strokeWeight(3 * percentWidth);
          noFill();
          rect(width * 0.065, height * 0.05, width * 0.05, height * 0.03, 10 * percentWidth);
          fill(255);
          textSize(Math.min(width * 0.05, height * 0.03));
          strokeWeight(2 * percentWidth);
          textAlign(CENTER, BASELINE);
          text("W", width * 0.065 + textWidth("W") / 2, height * 0.05 + textSize());
        });


    if (!buttons.includes(addHButton)) // Similar button, but for height, slightly different position, and says height
      if (landscape)
        addHButton = new Button('rectangle', [width * 0.05, height * 0.03], width * 0.01, height * 0.95, function () {
          let size = prompt("How many spaces high should the board be:", "6");
          if (size == null);
          else if (!parseInt(size))
            alert("That's not a number");
          else if (size != null) {
            if (parseInt(size) <= 50) {
              board.clear();
              BOARD_HEIGHT = parseInt(size);
              board = new Board(BOARD_WIDTH, BOARD_HEIGHT);
              windowResized();
            } else {
              alert("Please keep it under 50, it's probably for the best.");
            }
          }
        }, function () {
          stroke(255);
          strokeWeight(3 * percentWidth);
          noFill();
          rect(width * 0.01, height * 0.95, width * 0.05, height * 0.03, 10 * percentWidth);
          fill(255);
          textSize(Math.min(height * 0.95, width * 0.01));
          strokeWeight(2 * percentWidth);
          text("HEIGHT", width * 0.01 + (width * 0.05 - textWidth("HEIGHT")) / 2, height * 0.95 + textSize());
        });
      else
        addHButton = new Button('rectangle', [width * 0.05, height * 0.03], width * 0.01, height * 0.05, function () {
          let size = prompt("How many spaces high should the board be:", "6");

          if (size == null);
          else if (!parseInt(size))
            alert("That's not a number");
          else if (size != null && parseInt(size)) {
            if (parseInt(size) <= 50) {
              board.clear();
              BOARD_HEIGHT = parseInt(size);
              board = new Board(BOARD_WIDTH, BOARD_HEIGHT);
              windowResized();
            } else {
              alert("Please keep it under 50, it's probably for the best.");
            }
          }
        }, function () {
          stroke(255);
          strokeWeight(3 * percentWidth);
          noFill();
          rect(width * 0.01, height * 0.05, width * 0.05, height * 0.03, 10 * percentWidth);
          fill(255);
          textSize(Math.min(width * 0.05, height * 0.03));
          strokeWeight(2 * percentWidth);
          textAlign(CENTER, BASELINE);
          text("H", width * 0.01 + textWidth("H") / 2, height * 0.05 + textSize());
        });


    if (gameOver != 0 && lastestTile.bounceBackAnimation == 0 && !lastestTile.justFell) { // End game after tile finishes placing
      if (gameOver == 1) {
        // A player won
        // Add to score and send alert with player name or number and a tip
        this.currentPlayer().score++;
        alert((this.currentPlayer().name == "" ? ("Player #" + (this.currentPlayer().id + 1)) : this.currentPlayer().name) + " won!");
        //modal.open();
      } else if (gameOver == -1) // All spots filled, no winner, send alert
        alert("All spots have been filled! STALEMATE!!!");
        //modal.open();
      this.endGame(); // Start end game logic
    }

    AI.AITimer(); // Run timer logic every frame

    if (showButtonRegion) // Render an outline for each button to show where the hitbox is (debug option)
      buttons.forEach(btn => {
        btn.renderRegion();
      });

    Button.renderButtons(); // Draw buttons

    if (gameOver == 1 && !lastestTile.justFell) {
      push();
      translate(hShift, vShift); // Do board translation so coordinates translate correctly
      this.drawWinningConnection(winPos[0], winPos[1]); // Draw the lines and outlines for winning connection
      pop();
    }
    if (mouseIsPressed) { // Logic for buttons that use holding instead of press
      Button.checkHeldButtons(mouseX, mouseY);
      wasHeld = true;
    } else if (wasHeld)
      Button.clearHeldButtons();
  }


  static mouseClicked() {
    // If the user has control then let them do a turn if they click
    if (gameOver == 0 && mouseX - hShift < BOARD_WIDTH * squareSize && mouseX > hShift && !this.currentPlayer().ai && mouseY > vShift && mouseY < BOARD_HEIGHT * squareSize + vShift)
      this.doTurn(this.getCol(mouseX - hShift)); // Call turn logic

    Button.checkButtons(mouseX, mouseY); // Check buttons for collisions
    // prevent default
    return false;
  }

  static doTurn(arrayX) {

    // Tries to find a open spot in the array
    let arrayY = this.getRow(arrayX);

    // Mouse input calls this method when a button is clicked
    if (board.boardState[arrayX][arrayY] == null) { // If the spot if empty place tile there
      lastestTile = new Tile(arrayX, arrayY, turn); // Create tile
      board.boardState[arrayX][arrayY] = lastestTile; // Place tile in board
      gameLog += turn +""+arrayX;
      if (this.winCondition(arrayX, arrayY)) { // Check if that was a winning move
        winPos = [arrayX, arrayY]; // Cache where the use played for connection drawing
        gameOver = 1; // Update var win
        return;
      } else if (this.checkStaleMate()) {
        gameOver = -1; // Update var stalemate
        return;
      }
      turn++; // Next player
      ui.nextPlayer(); // Do UI transition
      if (turn == NUMBER_PLAYERS) // Wrap turn number
        turn = 0;
    }

    if (this.currentPlayer().ai && gameOver == 0)
      AI.startAITurn(); // Do AI turn if AI
  }


  static endGame() {
    ga('send', 'event', "Game", 'GameOver', gameLog); // Send game over event to GA
    gameLog = "";
    if (gameOver != -1)
      prevWinner = turn; // Update previous winner indicator
    if (winnerGoesFirst == 1) // Winner goes first next game
      turn = turn;
    else if (winnerGoesFirst == 0) // First play goes first
      turn = 0;
    else if (winnerGoesFirst == -1) { // Keep order
      prevFirst = (prevFirst + 1) % NUMBER_PLAYERS; // Must also wrap correctly
      turn = prevFirst;
    }

    gameOver = 0; // Clear gameover
    board.clear(); // Clear board animation
    if (players[turn].ai)
      AI.startAITurn(); // AI will start turn if first
  }

  static getRow(arrayX) {
    // Find spot in column
    let arrayY = BOARD_HEIGHT - 1;
    for (let i = BOARD_HEIGHT - 1; i > 0; i--) {
      if (board.boardState[arrayX][i] != null) {
        arrayY = i - 1;
      }
    }

    return arrayY;

  }

  static getCol(x) { // Get which column an X coordinate would be in on the board
    for (let i = 0; i < board.boardState.length; i++) { // Loop through board segments til correct one found
      if (x < (WIDTH / board.boardState.length) * (i + 1))
        return i;
    }
    return 0;
  }

  static checkStaleMate() { // Check if every spot if filled
    for (let x = 0; x < board.boardState.length; x++)
      for (let y = 0; y < board.boardState[0].length; y++)
        if (board.boardState[x][y] == null)
          return false;

    return true;
  }

  static winCondition(arrayX, arrayY) {
    // Declare check total letiables
    let vert = 1;
    let horz = 1;
    let posSlope = 1;
    let negSlope = 1;
    // Count number of consecutive player's tiles for 8 directions counted as 4 lines 
    for (let i = 1; arrayX + i < BOARD_WIDTH; i++) {
      if (board.boardState[arrayX + i][arrayY] != null && board.boardState[arrayX + i][arrayY].playerId == turn)
        horz++;
      else
        break;
    }
    for (let i = 1; arrayX - i >= 0; i++) {
      if (board.boardState[arrayX - i][arrayY] != null && board.boardState[arrayX - i][arrayY].playerId == turn)
        horz++;
      else
        break;
    }
    for (let i = 1; arrayY + i < BOARD_HEIGHT; i++) {
      if (board.boardState[arrayX][arrayY + i] != null && board.boardState[arrayX][arrayY + i].playerId == turn)
        vert++;
      else
        break;
    }
    for (let i = 1; arrayY - i >= 0; i++) {
      if (board.boardState[arrayX][arrayY - i] != null && board.boardState[arrayX][arrayY - i].playerId == turn)
        vert++;
      else
        break;
    }
    for (let i = 1; arrayY + i < BOARD_HEIGHT && arrayX + i < BOARD_WIDTH; i++) {
      if (board.boardState[arrayX + i][arrayY + i] != null && board.boardState[arrayX + i][arrayY + i].playerId == turn)
        negSlope++;
      else
        break;
    }
    for (let i = 1; arrayX - i >= 0 && arrayY - i >= 0; i++) {
      if (board.boardState[arrayX - i][arrayY - i] != null && board.boardState[arrayX - i][arrayY - i].playerId == turn)
        negSlope++;
      else
        break;
    }
    for (let i = 1; arrayY + i < BOARD_HEIGHT && arrayX - i >= 0; i++) {
      if (board.boardState[arrayX - i][arrayY + i] != null && board.boardState[arrayX - i][arrayY + i].playerId == turn)
        posSlope++;
      else
        break;
    }
    for (let i = 1; arrayX + i < BOARD_WIDTH && arrayY - i >= 0; i++) {
      if (board.boardState[arrayX + i][arrayY - i] != null && board.boardState[arrayX + i][arrayY - i].playerId == turn)
        posSlope++;
      else
        break;
    }
    if (vert >= CONNECT_NUM || horz >= CONNECT_NUM || posSlope >= CONNECT_NUM || negSlope >= CONNECT_NUM) // check if the player got a connection that is long enough
      return true;

    return false;
  }

  static drawWinningConnection(arrayX, arrayY) {
    // Declare check total letiables
    let vertU = 1;
    let vertD = 1;
    let horzL = 1;
    let horzR = 1;
    let posSlopeU = 1;
    let posSlopeD = 1;
    let negSlopeU = 1;
    let negSlopeD = 1;
    for (let i = 1; arrayX + i < BOARD_WIDTH; i++) {
      if (board.boardState[arrayX + i][arrayY] != null && board.boardState[arrayX + i][arrayY].playerId == turn)
        horzR++;
      else
        break;
    }
    for (let i = 1; arrayX - i >= 0; i++) {
      if (board.boardState[arrayX - i][arrayY] != null && board.boardState[arrayX - i][arrayY].playerId == turn)
        horzL++;
      else
        break;
    }
    for (let i = 1; arrayY + i < BOARD_HEIGHT; i++) {
      if (board.boardState[arrayX][arrayY + i] != null && board.boardState[arrayX][arrayY + i].playerId == turn)
        vertU++;
      else
        break;
    }
    for (let i = 1; arrayY - i >= 0; i++) {
      if (board.boardState[arrayX][arrayY - i] != null && board.boardState[arrayX][arrayY - i].playerId == turn)
        vertD++;
      else
        break;
    }
    for (let i = 1; arrayY + i < BOARD_HEIGHT && arrayX + i < BOARD_WIDTH; i++) {
      if (board.boardState[arrayX + i][arrayY + i] != null && board.boardState[arrayX + i][arrayY + i].playerId == turn)
        negSlopeU++;
      else
        break;
    }
    for (let i = 1; arrayX - i >= 0 && arrayY - i >= 0; i++) {
      if (board.boardState[arrayX - i][arrayY - i] != null && board.boardState[arrayX - i][arrayY - i].playerId == turn)
        negSlopeD++;
      else
        break;
    }
    for (let i = 1; arrayY + i < BOARD_HEIGHT && arrayX - i >= 0; i++) {
      if (board.boardState[arrayX - i][arrayY + i] != null && board.boardState[arrayX - i][arrayY + i].playerId == turn)
        posSlopeU++;
      else
        break;
    }
    for (let i = 1; arrayX + i < BOARD_WIDTH && arrayY - i >= 0; i++) {
      if (board.boardState[arrayX + i][arrayY - i] != null && board.boardState[arrayX + i][arrayY - i].playerId == turn)
        posSlopeD++;
      else
        break;
    }
    if (vertU + vertD >= CONNECT_NUM) // Draw the line if they are long enough, to allow for multiple connections check each
      this.drawConnection(arrayX, arrayY, vertU, vertD, 1);
    if (horzL + horzR >= CONNECT_NUM)
      this.drawConnection(arrayX, arrayY, horzR, horzL, 0);
    if (posSlopeU + posSlopeD >= CONNECT_NUM)
      this.drawConnection(arrayX, arrayY, posSlopeU, posSlopeD, 2);
    if (negSlopeU + negSlopeD >= CONNECT_NUM)
      this.drawConnection(arrayX, arrayY, negSlopeU, negSlopeD, 3);

  }

  static winConditionSpec(arrayX, arrayY, player) { // Same as other check win method but can check for a specific player
    // Declare check total letiables
    let vert = 1;
    let horz = 1;
    let posSlope = 1;
    let negSlope = 1;
    for (let i = 1; arrayX + i < BOARD_WIDTH; i++) {
      if (board.boardState[arrayX + i][arrayY] != null && board.boardState[arrayX + i][arrayY].playerId == player)
        horz++;
      else
        break;
    }
    for (let i = 1; arrayX - i >= 0; i++) {
      if (board.boardState[arrayX - i][arrayY] != null && board.boardState[arrayX - i][arrayY].playerId == player)
        horz++;
      else
        break;
    }
    for (let i = 1; arrayY + i < BOARD_HEIGHT; i++) {
      if (board.boardState[arrayX][arrayY + i] != null && board.boardState[arrayX][arrayY + i].playerId == player)
        vert++;
      else
        break;
    }
    for (let i = 1; arrayY - i >= 0; i++) {
      if (board.boardState[arrayX][arrayY - i] != null && board.boardState[arrayX][arrayY - i].playerId == player)
        vert++;
      else
        break;
    }
    for (let i = 1; arrayY + i < BOARD_HEIGHT && arrayX + i < BOARD_WIDTH; i++) {
      if (board.boardState[arrayX + i][arrayY + i] != null && board.boardState[arrayX + i][arrayY + i].playerId == player)
        negSlope++;
      else
        break;
    }
    for (let i = 1; arrayX - i >= 0 && arrayY - i >= 0; i++) {
      if (board.boardState[arrayX - i][arrayY - i] != null && board.boardState[arrayX - i][arrayY - i].playerId == player)
        negSlope++;
      else
        break;
    }
    for (let i = 1; arrayY + i < BOARD_HEIGHT && arrayX - i >= 0; i++) {
      if (board.boardState[arrayX - i][arrayY + i] != null && board.boardState[arrayX - i][arrayY + i].playerId == player)
        posSlope++;
      else
        break;
    }
    for (let i = 1; arrayX + i < BOARD_WIDTH && arrayY - i >= 0; i++) {
      if (board.boardState[arrayX + i][arrayY - i] != null && board.boardState[arrayX + i][arrayY - i].playerId == player)
        posSlope++;
      else
        break;
    }
    if (vert >= CONNECT_NUM || horz >= CONNECT_NUM || posSlope >= CONNECT_NUM || negSlope >= CONNECT_NUM)
      return true;

    return false;
  }

  static previousPlayer() { // Return the player before the current one
    if (turn == 0)
      return players[NUMBER_PLAYERS - 1];
    else
      return players[turn - 1];
  }

  static currentPlayer() { // Return current player
    return players[turn];
  }

  static drawConnection(arrayX, arrayY, tiles1, tiles2, conType) { // Draw the winning in a row lines
    noFill(); // Set up drawing
    stroke(255); // ^
    strokeWeight(15 * percentSS); // ^
    ellipseMode(CORNER); // ^
    let offset = tileSize / 2; // ^

    switch (conType) { // Draw lines and outlines in specific directions, mostly similar code
      case (0):
        for (let i = 0; i < tiles1; i++)
          ellipse(
            board.boardState[arrayX + i][arrayY].dx,
            board.boardState[arrayX + i][arrayY].dy, tileSize);

        for (let i = 0; i < tiles2; i++)
          ellipse(
            board.boardState[arrayX - i][arrayY].dx,
            board.boardState[arrayX - i][arrayY].dy, tileSize);

        strokeWeight(30 * percentSS);
        line(
          board.boardState[arrayX + tiles1 - 1][arrayY].dx + offset,
          board.boardState[arrayX + tiles1 - 1][arrayY].dy + offset,
          board.boardState[arrayX - tiles2 + 1][arrayY].dx + offset,
          board.boardState[arrayX - tiles2 + 1][arrayY].dy + offset);
        break;
      case (1):
        for (let i = 0; i < tiles1; i++)
          ellipse(board.boardState[arrayX][arrayY + i].dx, board.boardState[arrayX][arrayY + i].dy, tileSize);

        for (let i = 0; i < tiles2; i++)
          ellipse(board.boardState[arrayX][arrayY - i].dx, board.boardState[arrayX][arrayY - i].dy, tileSize);

        strokeWeight(30 * percentSS);
        line(
          board.boardState[arrayX][arrayY + tiles1 - 1].dx + offset,
          board.boardState[arrayX][arrayY + tiles1 - 1].dy + offset,
          board.boardState[arrayX][arrayY - tiles2 + 1].dx + offset,
          board.boardState[arrayX][arrayY - tiles2 + 1].dy + offset);
        break;
      case (3):
        for (let i = 0; i < tiles1; i++)
          ellipse(board.boardState[arrayX + i][arrayY + i].dx, board.boardState[arrayX + i][arrayY + i].dy, tileSize);

        for (let i = 0; i < tiles2; i++)
          ellipse(board.boardState[arrayX - i][arrayY - i].dx, board.boardState[arrayX - i][arrayY - i].dy, tileSize);

        strokeWeight(30 * percentSS);
        line(
          board.boardState[arrayX + tiles1 - 1][arrayY + tiles1 - 1].dx + offset,
          board.boardState[arrayX + tiles1 - 1][arrayY + tiles1 - 1].dy + offset,
          board.boardState[arrayX - tiles2 + 1][arrayY - tiles2 + 1].dx + offset,
          board.boardState[arrayX - tiles2 + 1][arrayY - tiles2 + 1].dy + offset);
        break;
      case (2):
        for (let i = 0; i < tiles1; i++)
          ellipse(board.boardState[arrayX - i][arrayY + i].dx, board.boardState[arrayX - i][arrayY + i].dy, tileSize);

        for (let i = 0; i < tiles2; i++)
          ellipse(board.boardState[arrayX + i][arrayY - i].dx, board.boardState[arrayX + i][arrayY - i].dy, tileSize);
        strokeWeight(30 * percentSS);
        line(
          board.boardState[arrayX - tiles1 + 1][arrayY + tiles1 - 1].dx + offset,
          board.boardState[arrayX - tiles1 + 1][arrayY + tiles1 - 1].dy + offset,
          board.boardState[arrayX + tiles2 - 1][arrayY - tiles2 + 1].dx + offset,
          board.boardState[arrayX + tiles2 - 1][arrayY - tiles2 + 1].dy + offset);
        break;
    }
  }

  static getTip() { // Return random tip from list
    let tips = [
      "You can change the number of players by pressing the plus and minus buttons on the scoreboard",
      "Press the name of any player to change it to whatever you'd like",
      "Press the circle beside any player to change their colour",
      "You can change the width and height of the board by pressing the width(W) and height(H) buttons",
      "Press the number in the \"Connect4.org\" text to change the number of tiles in a row required to win",
      "In portrait view press and hold on a player's scoreboard tile to change it to and from a AI player"
    ];
    return tips[floor(Math.random() * tips.length)];
  }

}
var buttons = []; // Dynamic list of buttons to draw
var showButtonRegion = false;
var wasHeld = false;
class Button { // Buttons
  constructor(type, size, x, y, action, render, hold) {
    this.type = type;
    this.size = size;
    this.x = x;
    this.y = y;
    this.action = action;
    this.render = render;
    if (hold)
      this.hold = 0;
    buttons.push(this); // Push a button on to the list
  }

  renderRegion() {
    stroke('red');
    strokeWeight(5);
    noFill();
    switch (this.type) {
      case ('ellipse'):
        ellipseMode(RADIUS);
        ellipse(this.x + this.size, this.y + this.size, this.size);
        break;
      case ('rectangle'):
        rectMode(CORNER);
        rect(this.x, this.y, this.size[0], this.size[1]);
        break;
    }
  }
  held(_x, _y) {
    switch (this.type) {
      case ('ellipse'):
        if (Math.pow(_x - (this.x + this.size), 2) + Math.pow(_y - (this.y + this.size), 2) < Math.pow(this.size, 2))
          this.action();
        break;
      case ('rectangle'):
        if (_x - this.x >= 0 && _x - this.x < this.size[0] && _y - this.y >= 0 && _y - this.y < this.size[1])
          this.action();
        break;
    }
  }


  clicked(_x, _y) {
    switch (this.type) {
      case ('ellipse'):
        if (Math.pow(_x - (this.x + this.size), 2) + Math.pow(_y - (this.y + this.size), 2) < Math.pow(this.size, 2))
          this.action();
        break;
      case ('rectangle'):
        if (_x - this.x >= 0 && _x - this.x < this.size[0] && _y - this.y >= 0 && _y - this.y < this.size[1])
          this.action();
        break;
    }
  }

  static checkButtons(x, y) {
    buttons.forEach(btn => {
      if (btn.hold == null)
        btn.clicked(x, y);
    });
  }
  static checkHeldButtons(x, y) {
    buttons.forEach(btn => {
      if (btn.hold != null)
        btn.held(x, y);
    });
  }
  static clearHeldButtons() {
    buttons.forEach(btn => {
      if (btn.hold != null)
        btn.hold = 0;
    });
  }

  static renderButtons() {
    buttons.forEach(btn => {
      if (btn.render != null)
        btn.render();
    });
  }

  static removeButton(btn) {

    buttons = buttons.filter(function (ele) {
      return ele != btn;
    });

  }

}