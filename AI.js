var AIDelay = 0.4;

let AITime = 0;
let prev = 0;
let move = 0;

class AI {

    static AITimer(){
        if(AITime > 0 && prev == 0){
            prev = Date.now(); // Start counting for AI move delay
            move = this.doAITurn(Game.currentPlayer().id); // Calculate move
        }else if(AITime > 0){
            AITime -= (Date.now()-prev)/1000; // Subtract time from timer
            prev = Date.now(); // Reset delta time
        }else if(AITime <= 0 && prev != 0){ // Do move
            AITime = 0; // Reset timer
            prev = 0;   // ^
            Game.doTurn(move); // Do move
        }
    }

    static startAITurn(){
        //Game.doTurn(doMLTurn());

        //TODO: UNCOMMENT AFTER ML
        AITime = AIDelay; // Kick off AI turn logic
    }

    static doAITurn(playerId) { // Logic for deciding move
        let arrayX;
        let arrayY;

        // Check all possible placements for a AI condition
        for (let i = 0; i < BOARD_WIDTH; i++) {
            arrayX = i; //Set the array X to i for each column
            arrayY = Game.getRow(arrayX); //Get the Y position in that column
            if (Game.winConditionSpec(arrayX, arrayY, playerId)) { //Check if going there would make AI win
                if (board.boardState[arrayX][arrayY] == null) { //Check if the position if free
                    return arrayX;
                }
            }
        }

        // Check all possible placements for a opponent win condition
        for (let i = 0; i < BOARD_WIDTH; i++) { // Check every possible position this turn
            arrayX = i;
            arrayY = Game.getRow(arrayX);
            for (let j = 0; j < NUMBER_PLAYERS; j++) { // Check for each player
                if (j == playerId) // Except current AI
                    continue;
                if (Game.winConditionSpec(arrayX, arrayY, j)) { // Check if they would win there
                    if (board.boardState[arrayX][arrayY] == null) {
                        return arrayX; // Go there to deny win
                    }
                }
            }
        }

        // If there is no win condition, go randomly
        while (true) { // Loop until a position is found
            let i = floor(Math.random() * BOARD_WIDTH);// Generate a random number
            arrayX = i;
            arrayY = Game.getRow(arrayX);
            if (board.boardState[arrayX][arrayY] == null) {
                return arrayX;
            }
        }
    }


}