let playerButtons = [];
let addPlayerButton = null;
let subPlayerButton = null;
let connectButton = null;
let logoOffset = 0;

class UI {
    constructor() {
        this.selectorBounce = 0;
        this.playerTransition = 1;
        this.selectorTransition = 0;
        this.prevCol = -1;
    }
    renderGameUI() {
        if (gameOver == 0 && board.boardState[Game.getCol(mouseX - hShift)][0] == null && !Game.currentPlayer().ai && mouseX - hShift < BOARD_WIDTH * squareSize && mouseX > hShift && mouseY > vShift && mouseY < BOARD_HEIGHT * squareSize + vShift)
            this.renderSelector();

        this.renderBoardOutline();

        if (gameOver == 0 && !Game.currentPlayer().ai && mouseX - hShift < BOARD_WIDTH * squareSize && mouseX > hShift && mouseY > vShift && mouseY < BOARD_HEIGHT * squareSize + vShift)
            this.renderSelectionTile();
    }

    renderOuterUI() {
        textFont('Roboto');
        stroke(255);
        strokeWeight(3 * percentSS);
        fill('white');
        if (landscape) {
            textAlign(LEFT, BOTTOM);
            textSize(48 * (height / 969));
            logoOffset = 48 * (height / 969) * 2;
            image(img_c4logo, hShift/15, height/14 - textSize(), textSize(), textSize());
            text("Connect" + CONNECT_NUM + ".org", hShift / 15 + textSize(), height / 14);
            if (connectButton == null)
                connectButton = new Button('rectangle', [textWidth(CONNECT_NUM), textSize()], hShift / 15 + textWidth("Connect"), height / 14 - textSize(), function () {
                    Button.removeButton(connectButton);
                    connectButton = null;
                    let newNum = prompt("How many tiles must be connected in a row?", "4");
                    if (newNum == null);
                    else if (!parseInt(newNum))
                        alert("That's not a number");
                    else if (newNum != null && parseInt(newNum)) {
                        if (parseInt(newNum) <= Math.min(BOARD_WIDTH, BOARD_HEIGHT, 10)) {
                            CONNECT_NUM = parseInt(newNum);
                        } else {
                            alert("Please keep it under " + Math.min(BOARD_WIDTH, BOARD_HEIGHT, 10) + ", it's probably for the best. \n(Increasing the board size may allow you to have a larger connection number)");
                        }
                    }
                });
        } else {
            textAlign(LEFT);
            textSize(height / 15);
            logoOffset = height / 15 * 2;
            text("Connect" + CONNECT_NUM + ".org", width / 2 - textWidth("Connect" + CONNECT_NUM + ".org") / 2, height / 15);
            if (connectButton == null)
                connectButton = new Button('rectangle', [textWidth(CONNECT_NUM), textSize()], width / 2 - textWidth("Connect" + CONNECT_NUM + ".org") / 2 + textWidth("Connect"), height / 15 - textSize(), function () {
                    Button.removeButton(connectButton);
                    connectButton = null;
                    let newNum = prompt("How many tiles must be connected in a row?", "4");
                    if (newNum == null);
                    else if (!parseInt(newNum))
                        alert("That's not a number");
                    else if (newNum != null && parseInt(newNum)) {
                        if (parseInt(newNum) <= Math.min(BOARD_WIDTH, BOARD_HEIGHT, 10)) {
                            CONNECT_NUM = parseInt(newNum);
                        } else {
                            alert("Please keep it under " + Math.min(BOARD_WIDTH, BOARD_HEIGHT, 10) + ", it's probably for the best. \n(Increasing the board size may allow you to have a larger connection number)");
                        }
                    }
                });
        }
        this.renderScoreBoard();

    }
    renderScoreBoard() {
        noFill();
        stroke(255);
        strokeWeight(8 * percentSS);
        if (landscape) {
            let x = hShift * 0.015;
            let y = Math.min(height / 10, vShift) + logoOffset;
            let w = (hShift * 0.9);
            let h = Math.min(w, ((height - logoOffset - Math.min(height / 5, vShift * 2))));
            //rect(x, y, w, h, 10 * percentSS);
            ellipseMode(CORNER);
            textAlign(LEFT, BASELINE);
            for (let i = 0; i < NUMBER_PLAYERS; i++) {
                noStroke();
                let player = players[i];
                fill(player.color);
                let xOff = Math.min(Math.min(w * 0.12, h / NUMBER_PLAYERS * 0.8), w * 0.15);
                let yOff = h * 0.05 / NUMBER_PLAYERS;
                let iterOff = i * h / NUMBER_PLAYERS;
                let circleSize = Math.min(w / 5, h / NUMBER_PLAYERS * 0.8);
                let crownSize = circleSize * 0.85;
                let crownXOff = -crownSize / 2 + circleSize / 10;
                let crownYOff = -crownSize / 2;
                let aiSize = Math.min(w * 0.12, h / NUMBER_PLAYERS * 0.8);
                ellipse(x + xOff, y + yOff + iterOff, circleSize);
                textFont('Roboto');
                textSize(Math.min(64 * percentWidth, (h * 0.85) / NUMBER_PLAYERS));
                stroke(255);
                strokeWeight(3 * percentWidth);
                //TODO: player 10 sometimes goes off the scoreboard on some screen dimensions
                if (player.name != "" && textWidth(player.name + ": ?" + player.score) > w - xOff - circleSize) // ? adds small amount of padding
                    textSize(textSize() * ((w - xOff - circleSize) / textWidth(player.name + ":  " + player.score)));
                else
                    textSize(textSize() * ((w - xOff - circleSize) / textWidth(("Player #" + (player.id + 1)) + ":  " + player.score)));

                textSize(Math.min(textSize(), h / NUMBER_PLAYERS));

                if (prevWinner == player.id)
                    image(img_crown, x + xOff + crownXOff, y + yOff + iterOff + crownYOff, crownSize, crownSize);
                let textXOff = circleSize;
                let textYOff = (circleSize + textSize()) * 0.85 / 2;

                fill('white');
                stroke(255);
                strokeWeight(3 * percentWidth);
                let playerText = (player.name === "" ? ("Player #" + (player.id + 1)) : player.name) + ": " + player.score;
                text(playerText, x + xOff + textXOff, y + yOff + textYOff + iterOff);
                if (playerButtons[i] == null) {
                    playerButtons[i] = new Button('ellipse', circleSize / 2, x + xOff, y + yOff + iterOff, function () {

                        availableColors.push(players[i].color);
                        players[i].color = availableColors.shift();

                    });
                    new Button('rectangle', [textWidth(playerText), textSize()], x + xOff + textXOff, y + yOff + iterOff, function () {
                        let name = prompt("Enter your name!");
                        if (name != null) {
                            //  name = truncate(name, w - circleSize - textWidth(": 000"));
                            player.name = name;
                        }

                    });
                    new Button('rectangle', [aiSize, aiSize], x + w * 0.005, y + iterOff + yOff + circleSize / 2 - aiSize / 2, function () {
                        player.ai = !player.ai;
                        if (player.ai && player == Game.currentPlayer())
                            AI.startAITurn();

                    }, function () {
                        image(img_ai[player.ai ? 0 : 1], x + w * 0.005, y + iterOff + yOff + circleSize / 2 - aiSize / 2, aiSize, aiSize);
                    });
                }
            }
            if (NUMBER_PLAYERS < COLORS.length) {
                if (addPlayerButton == null)
                    addPlayerButton = new Button('rectangle', [w / 10, w / 10], x, y + h, function () {
                        board.clear();
                        players.push(new Player(availableColors.shift(), NUMBER_PLAYERS, AIEnabled.includes(NUMBER_PLAYERS)));
                        NUMBER_PLAYERS++;
                        addPlayerButton = null;
                        subPlayerButton = null;
                        connectButton = null;
                        turn = prevFirst;
                        buttons = [];
                        playerButtons = [];
                    }, function () {
                        image(img_addPlayer, x, y + h, w / 10, w / 10);
                    });
            }
            if (players.length > 1) {
                if (subPlayerButton == null)
                    subPlayerButton = new Button('rectangle', [w / 10, w / 10], x + w / 9.8, y + h, function () {
                        board.clear();
                        availableColors.push(players.pop().color);
                        NUMBER_PLAYERS--;
                        subPlayerButton = null;
                        addPlayerButton = null;
                        connectButton = null;
                        turn = prevFirst < NUMBER_PLAYERS ? prevFirst : 0;
                        buttons = [];
                        playerButtons = [];
                    }, function () {
                        image(img_subPlayer, x + w / 9.8, y + h, w / 10, w / 10);
                    });
            }
        } else {
            let x = width * 0.1;
            let y = logoOffset * 0.8;
            let w = width * 0.9;
            let h = vShift * 0.8 - logoOffset * 0.8;
            let circleSize;
            let crownSize;
            ellipseMode(CORNER);
            textAlign(LEFT);
            noStroke();
            let pos = NUMBER_PLAYERS > 1 ? calc(x / 2 + w / 2, y + h / 2, NUMBER_PLAYERS, Math.min(w, h) * 0.3, NUMBER_PLAYERS == 3 ? 90 : 0) : [{ x: (x / 2 + w / 2), y: (y + h / 2) }];
            for (let i = 0; i < NUMBER_PLAYERS; i++) {
                let player = players[i];
                fill(player.color);
                textFont('Roboto');
                circleSize = dist(pos[0].x, pos[0].y, pos[pos.length - 1].x, pos[pos.length - 1].y) * 0.9;
                if (pos.length == 1)
                    circleSize = Math.min(w, h) * 0.8;
                textSize(circleSize);
                if (textWidth(player.score) > circleSize)
                    textSize(textSize() / textWidth(player.score) * textSize());
                textAlign(CENTER, CENTER);
                crownSize = circleSize * 0.85;
                ellipseMode(CENTER);
                if (player.ai) {
                    stroke('black');
                    strokeWeight(10 * percentSS);
                }
                if(player.id == turn){
                    stroke('white');
                    strokeWeight(15 * percentSS);
                }
                
                ellipse(pos[i].x, pos[i].y, circleSize);
                fill('white');
                stroke('blue');
                strokeWeight(2);
                text(player.score, pos[i].x, pos[i].y + textSize() * 0.1);
                noStroke();

                if (playerButtons[i] == null) {
                    playerButtons.push([ new Button('ellipse', circleSize / 2, pos[i].x - circleSize / 2, pos[i].y - circleSize / 2, function () {
                        if(playerButtons[i][1].hold <  0.2 * 60){
                        availableColors.push(players[i].color);
                        players[i].color = availableColors.shift();
                        }
                    }),
                    new Button('ellipse', circleSize / 2, pos[i].x - circleSize / 2, pos[i].y - circleSize / 2, function () {
                        this.hold++;
                        if (this.hold == 0.2 * 60){
                            player.ai = !player.ai;
                        }

                    }, null, true)]);
                }
            }
            for (let i = 0; i < NUMBER_PLAYERS; i++)
                if (prevWinner == players[i].id)
                    image(img_crown, pos[i].x - circleSize * 0.85, pos[i].y - circleSize, crownSize, crownSize);

            if (NUMBER_PLAYERS < COLORS.length) {
                if (addPlayerButton == null)
                    addPlayerButton = new Button('rectangle', [h * 0.2, h * 0.2], width * 0.80 - h * 0.15, y + h * 0.9, function () {
                        board.clear();
                        players.push(new Player(availableColors.shift(), NUMBER_PLAYERS, AIEnabled.includes(NUMBER_PLAYERS)));
                        NUMBER_PLAYERS++;
                        addPlayerButton = null;
                        subPlayerButton = null;
                        connectButton = null;
                        turn = prevFirst;
                        buttons = [];
                        playerButtons = [];
                    }, function () {
                        image(img_addPlayer, width * 0.80 - h * 0.15, y + h * 0.9, h * 0.2, h * 0.2);
                    });
            }
            if (players.length > 1) {
                if (subPlayerButton == null)
                    subPlayerButton = new Button('rectangle', [h * 0.2, h * 0.2], width * 0.9 - h * 0.1, y + h * 0.9, function () {
                        board.clear();
                        availableColors.push(players.pop().color);
                        NUMBER_PLAYERS--;
                        subPlayerButton = null;
                        addPlayerButton = null;
                        connectButton = null;
                        turn = prevFirst < NUMBER_PLAYERS ? prevFirst : 0;
                        buttons = [];
                        playerButtons = [];
                    }, function () {
                        image(img_subPlayer, width * 0.9 - h * 0.1, y + h * 0.9, h * 0.2, h * 0.2);
                    });
            }
        }

    }

    renderBoardOutline() {
        let c = lerpColor(color(Game.previousPlayer().color), color(Game.currentPlayer().color), this.playerTransition);
        c = color(100 + ((red(c) / 255) * 155), 100 + ((green(c) / 255) * 155), 100 + ((blue(c) / 255) * 155));
        stroke(c);
        noFill();
        strokeWeight(15 * percentWidth);
        rect(-10, -10, WIDTH + 20, HEIGHT + 20, 20 * percentSS);
        noStroke();
        if (this.playerTransition < 1)
            this.playerTransition += 0.1;

    }

    renderSelector() {
        noStroke();
        this.selectorBounce += 0.05;
        if (this.selectorBounce > 2 * (PI))
            this.selectorBounce = 0;
        let bounce = cos(this.selectorBounce) + 1;
        fill('rgba(255, 255, 255, ' + (0.4 + (0.1 * bounce) + ')'));
        let bounceAmount = (squareSize / 5);
        rect(Board.getPos(Game.getCol(mouseX - hShift), 0)[0] + bounce * 5, -10, squareSize - bounce * 10, squareSize * BOARD_HEIGHT + 20); //TODO: I think this is before resize refactoring
    }

    renderSelectionTile() {
        fill(color(players[turn].color), 0.5);
        ellipseMode(CORNER);
        let col = Game.getCol(mouseX - hShift);
        let pos = Board.getPos(col, Game.getRow(col));
        if (col != this.prevCol)
            this.selectorTransition = 0;
        strokeWeight(8 * percentSS);
        noFill();
        if (board.boardState[col][0] == null) {
            let c = players[turn].color;
            stroke(color(155 + ((red(c) / 255) * 100), 155 + ((green(c) / 255) * 100), 155 + ((blue(c) / 255) * 100)));
            ellipse(pos[0] + (squareSize - squareSize * 0.75) / 2, pos[1] + (this.selectorTransition * squareSize), squareSize * 0.75); // CONSTANT USED FOR SIZE OF TILE, IF TILE WON'T UPDATE IF TILE SIZE CHANGES
            if (this.selectorTransition > 0)
                this.selectorTransition = Math.max(this.selectorTransition - 0.1, 0);
        } else {
            stroke(255);
            ellipse(pos[0] + (squareSize - squareSize * 0.75) / 2, pos[1], squareSize * 0.75); // CONSTANT USED FOR SIZE OF TILE, IF TILE WON'T UPDATE IF TILE SIZE CHANGES
            pos[0] += squareSize * 0.125;
            pos[1] += squareSize * 0.02;
            line(pos[0], pos[1], pos[0] + squareSize * 0.75, pos[1] + squareSize * 0.75);
            line(pos[0] + squareSize * 0.75, pos[1], pos[0], pos[1] + squareSize * 0.75);
        }
        this.prevCol = col;
    }

    nextPlayer() {
        this.playerTransition = 0;
        this.selectorTransition = 1;
    }

}

function calc(x_, y_, sides, r, ang) {
    let cx = x_;
    let cy = y_;

    let n = sides;
    n = Math.round(n);
    var centerAng = 2 * Math.PI / n;
    let startAng = ang / 360 * 2 * Math.PI;

    //create a vertex array
    var vertex = [];
    for (var i = 0; i < n; i++) {
        ang = startAng + (i * centerAng);
        let vx = Math.round(cx + r * Math.cos(ang));
        let vy = Math.round(cy - r * Math.sin(ang));
        vertex.push({ x: vx, y: vy });
    }

    return vertex;

}

// Truncate a string until it fits inside the highscore display
function truncate(shorten, width) {
    // If the rendered string width is greater than the display width: shorten it, else: found simplest case (done)
    if (textWidth(shorten) > width)
        if (shorten.lastIndexOf("...") == -1) // If ellipsis hasn't been added: replace letters with ellipsis and try again, else: remove one character and try again
            return truncate(shorten.substring(0, shorten.length - 3) + "...", width);
        else
            return truncate(shorten.substring(0, shorten.length - 4) + "...", width);

    return shorten;
}