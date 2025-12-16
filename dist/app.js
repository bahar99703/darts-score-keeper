"use strict";
// Game state varaibles 
var players = [];
var currentPlayerIndex = 0;
var startScore = 501;
var maxLegs = 5;
var currentLeg = 1;
var gameOver = false;
// Function to start a new game
function startGame(playerNames, selectedStartScore, selectedMaxLegs) {
    startScore = selectedStartScore;
    maxLegs = selectedMaxLegs;
    currentLeg = 1;
    currentPlayerIndex = 0;
    gameOver = false;
    players = playerNames.map(function (name, index) { return ({
        id: index,
        name: name,
        score: startScore,
        legsWon: 0
    }); });
    renderState();
}
// Function to record a player's turn
function recordTurn(points) {
    if (gameOver)
        return;
    var player = players[currentPlayerIndex];
    var newScore = player.score - points;
    if (newScore < 0) {
        nextPlayer();
        renderState();
        return;
    }
    player.score = newScore;
    if (newScore === 0) {
        endLeg(player);
        return;
    }
    nextPlayer();
    renderState();
    window.recordTurn = recordTurn;
}
// Function to swtich to the next player 
function nextPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
}
function endLeg(winner) {
    winner.legsWon++;
    if (hasWonSet(winner)) {
        declareWinner(winner);
    }
    else {
        resetLegScores();
    }
}
function resetLegScores() {
    players.forEach(function (player) {
        player.score = startScore;
    });
    currentLeg++;
    currentPlayerIndex = 0; // could alternate starter if desired
    renderState();
}
function hasWonSet(player) {
    var legsNeededToWin = Math.ceil(maxLegs / 2);
    return player.legsWon >= legsNeededToWin;
}
function declareWinner(winner) {
    gameOver = true;
    alert("".concat(winner.name, " wins the set!"));
    renderState();
}
function renderState() {
    var gameDiv = document.getElementById("game");
    if (!gameDiv)
        return;
    gameDiv.innerHTML = "\n<h2>Leg ".concat(currentLeg, "</h2>\n<ul>\n").concat(players
        .map(function (player, index) { return "\n<li>\n<strong>".concat(player.name, "</strong> \u2014 Score: ").concat(player.score, ", Legs Won: ").concat(player.legsWon, "\n").concat(index === currentPlayerIndex && !gameOver ? " ← current" : "", "\n</li>\n"); })
        .join(""), "\n</ul>\n<button onclick=\"recordTurn(60)\">Score 60</button>\n<button onclick=\"recordTurn(100)\">Score 100</button>\n<button onclick=\"recordTurn(140)\">Score 140</button>\n");
}
startGame(["Player 1", "Player 2"], 501, 5);
//# sourceMappingURL=app.js.map