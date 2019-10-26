class Board {
  constructor(columns, rows) {
    ga('send', 'event', "Game", 'StartedGame'); // Google Analytics event tag
    this.boardState = new Array(columns); // Create correctly sized array
    for (let i = 0; i < this.boardState.length; i++)
      this.boardState[i] = new Array(rows);
  }

  render() {
    noStroke();
    // Render board pieces
    for (let x = 0; x < this.boardState.length; x++) {
      for (let y = 0; y < this.boardState[0].length; y++) {
        if (this.boardState[x][y] != null) {
          this.boardState[x][y].render(); // Render each tile
        }
      }
    }
    tileEllipse.renderEllipses(); // Render additional visual effects
    explodeEllipse.render();      // ^
    
  }

  clear() { // Reset the board
    for (let y = 0; y < this.boardState[0].length; y++)
      for (let x = 0; x < this.boardState.length; x++)
        if (board.boardState[x][y] != null)
          new explodeEllipse(board.boardState[x][y].dx, board.boardState[x][y].dy, tileSize , players[board.boardState[x][y].playerId].color, 0, 0, board.boardState[x][y]); // Render tiles falling
        
          let rows = BOARD_HEIGHT;
    this.boardState = new Array(BOARD_WIDTH); // Generate new array
    for (let i = 0; i < BOARD_WIDTH; i++)
      this.boardState[i] = new Array(rows);
  }

   updateTilePosition() {
    for (let y = 0; y < this.boardState[0].length; y++) {
      for (let x = 0; x < this.boardState.length; x++) {
        if (board.boardState[x][y] == null)
          continue;
        board.boardState[x][y].x = Board.getPos(x, y)[0]; // Correct each tile to be in the correct position on the screen relative to the board
        board.boardState[x][y].y = Board.getPos(x, y)[1];
      }
    }
  }

  static getPos(x, y) {
    return new Array(x * squareSize, y * squareSize); // Return the position the screen where a position in the array would match
  }


}