"use strict";
// Game state varaibles 
var players = [];
var currentPlayerIndex = 0;
var startScore = 501;
var maxLegs = 5;
var currentLeg = 1;
var gameOver = false;
var legTurnHistory = [];
var globalTurnNumber = 0;
// Function to start a new game
function startGame(playerNames, startingScore, legsToWin) {
    startScore = startingScore;
    maxLegs = legsToWin;
    currentLeg = 1;
    currentPlayerIndex = 0;
    gameOver = false;
    players = playerNames.map(function (name, index) { return ({
        id: index,
        name: name,
        score: startScore,
        legsWon: 0,
        totalPoints: 0,
        turns: 0,
        turnHistory: []
    }); });
    legTurnHistory = [];
    globalTurnNumber = 0;
    renderState();
}
// Function to record a player's turn
function recordTurn(points) {
    if (gameOver)
        return;
    var player = players[currentPlayerIndex];
    var newScore = player.score - points;
    globalTurnNumber++;
    var isBust = newScore < 0;
    var turn = {
        turnNumber: globalTurnNumber,
        playerId: player.id,
        playerName: player.name,
        pointsScored: isBust ? 0 : points,
        remainingScore: isBust ? player.score : newScore,
        isBust: isBust
    };
    legTurnHistory.push(turn);
    player.turnHistory.push(turn);
    if (isBust) {
        nextPlayer();
        renderState();
        return;
    }
    player.score = newScore;
    player.totalPoints += points;
    player.turns++;
    if (newScore === 0) {
        endLeg(player);
        return;
    }
    nextPlayer();
    renderState();
}
window.recordTurn = recordTurn;
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
        player.turnHistory = [];
    });
    legTurnHistory = [];
    globalTurnNumber = 0;
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
    var turnHistoryTable = legTurnHistory.length > 0 ? "\n    <h3>Turn History</h3>\n    <table>\n      <thead>\n        <tr>\n          <th>Turn #</th>\n          <th>Player</th>\n          <th>Points</th>\n          <th>Remaining</th>\n          <th>Status</th>\n        </tr>\n      </thead>\n      <tbody>\n        ".concat(legTurnHistory.map(function (turn) { return "\n          <tr class=\"".concat(turn.isBust ? 'bust' : '', "\">\n            <td>").concat(turn.turnNumber, "</td>\n            <td>").concat(turn.playerName, "</td>\n            <td>").concat(turn.pointsScored, "</td>\n            <td>").concat(turn.remainingScore, "</td>\n            <td>").concat(turn.isBust ? '❌ BUST' : turn.remainingScore === 0 ? '🎯 WIN' : '✓', "</td>\n          </tr>\n        "); }).join(''), "\n      </tbody>\n    </table>\n  ") : '';
    gameDiv.innerHTML = "\n    <h2>Leg ".concat(currentLeg, "</h2>\n    <ul>\n      ").concat(players
        .map(function (player, index) { return "\n            <li>\n              <strong>".concat(player.name, "</strong> \u2014 Score: ").concat(player.score, ", Legs Won: ").concat(player.legsWon, "\n              ").concat(index === currentPlayerIndex && !gameOver ? " ← current" : "", "\n            </li>\n          "); })
        .join(""), "\n    </ul>\n    <button onclick=\"recordTurn(60)\">Score 60</button>\n    <button onclick=\"recordTurn(100)\">Score 100</button>\n    <button onclick=\"recordTurn(140)\">Score 140</button>\n    ").concat(turnHistoryTable, "\n  ");
}
startGame(["Player 1", "Player 2"], 501, 5);
//# sourceMappingURL=app.js.map