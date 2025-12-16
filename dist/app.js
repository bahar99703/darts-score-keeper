"use strict";
// Game state varaibles 
let players = [];
let currentPlayerIndex = 0;
let startScore = 501;
let maxLegs = 5;
let currentLeg = 1;
let gameOver = false;
let legTurnHistory = [];
let globalTurnNumber = 0;
// Function to start a new game
function startGame(playerNames, startingScore, legsToWin) {
    startScore = startingScore;
    maxLegs = legsToWin;
    currentLeg = 1;
    currentPlayerIndex = 0;
    gameOver = false;
    players = playerNames.map((name, index) => ({
        id: index,
        name,
        score: startScore,
        legsWon: 0,
        totalPoints: 0,
        turns: 0,
        turnHistory: []
    }));
    legTurnHistory = [];
    globalTurnNumber = 0;
    renderState();
}
// Function to record a player's turn
function recordTurn(points) {
    if (gameOver)
        return;
    const player = players[currentPlayerIndex];
    const newScore = player.score - points;
    globalTurnNumber++;
    const isBust = newScore < 0;
    const turn = {
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
        // Player reached exactly zero - they win this leg!
        alert(`🎯 ${player.name} reached exactly zero and wins Leg ${currentLeg}!`);
        endLeg(player);
        return;
    }
    nextPlayer();
    renderState();
}
window.recordTurn = recordTurn;
// Function to remove a turn from history
function removeTurn(turnNumber) {
    if (gameOver)
        return;
    const turnIndex = legTurnHistory.findIndex(t => t.turnNumber === turnNumber);
    if (turnIndex === -1)
        return;
    const turn = legTurnHistory[turnIndex];
    // Remove from leg history
    legTurnHistory.splice(turnIndex, 1);
    // Remove from player's history
    const player = players.find(p => p.id === turn.playerId);
    if (player) {
        const playerTurnIndex = player.turnHistory.findIndex(t => t.turnNumber === turnNumber);
        if (playerTurnIndex !== -1) {
            player.turnHistory.splice(playerTurnIndex, 1);
        }
    }
    // Recalculate scores by replaying all remaining turns
    recalculateScores();
    renderState();
}
window.removeTurn = removeTurn;
// Function to modify a turn's points
function modifyTurn(turnNumber) {
    if (gameOver)
        return;
    const turn = legTurnHistory.find(t => t.turnNumber === turnNumber);
    if (!turn)
        return;
    const newPoints = prompt(`Modify points for ${turn.playerName} (Turn ${turnNumber}):`, turn.pointsScored.toString());
    if (newPoints === null)
        return;
    const points = parseInt(newPoints);
    if (isNaN(points) || points < 0) {
        alert('Invalid points value');
        return;
    }
    turn.pointsScored = points;
    recalculateScores();
    renderState();
}
window.modifyTurn = modifyTurn;
// Function to recalculate all player scores based on turn history
function recalculateScores() {
    // Reset all players to start score
    players.forEach(player => {
        player.score = startScore;
        player.totalPoints = 0;
        player.turns = 0;
    });
    let winningPlayer = null;
    // Replay all turns
    for (const turn of legTurnHistory) {
        const player = players.find(p => p.id === turn.playerId);
        if (!player)
            continue;
        const newScore = player.score - turn.pointsScored;
        if (newScore < 0) {
            // Bust - score goes below zero
            turn.isBust = true;
            turn.remainingScore = player.score;
            turn.pointsScored = 0;
        }
        else if (newScore === 0) {
            // Exactly zero - player wins this leg!
            player.score = newScore;
            player.totalPoints += turn.pointsScored;
            player.turns++;
            turn.remainingScore = newScore;
            turn.isBust = false;
            winningPlayer = player;
            break; // Stop processing turns after a win
        }
        else {
            // Valid score
            player.score = newScore;
            player.totalPoints += turn.pointsScored;
            player.turns++;
            turn.remainingScore = newScore;
            turn.isBust = false;
        }
    }
    // If someone reached exactly zero, they win the leg
    if (winningPlayer) {
        alert(`${winningPlayer.name} reached exactly zero and wins Leg ${currentLeg}!`);
    }
}
// Function to swtich to the next player 
function nextPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
}
function endLeg(winner) {
    winner.legsWon++;
    // Update display before showing alert
    renderState();
    if (hasWonSet(winner)) {
        declareWinner(winner);
    }
    else {
        // Show leg win message
        setTimeout(() => {
            alert(`🎯 ${winner.name} wins Leg ${currentLeg}!\n\nLegs Won: ${winner.legsWon}\n\nStarting Leg ${currentLeg + 1}...`);
            resetLegScores();
        }, 100);
    }
}
function resetLegScores() {
    // Increment leg counter FIRST
    currentLeg++;
    // Reset all player scores and history
    players.forEach(player => {
        player.score = startScore;
        player.turnHistory = [];
    });
    legTurnHistory = [];
    globalTurnNumber = 0;
    currentPlayerIndex = 0; // could alternate starter if desired
    renderState();
}
function hasWonSet(player) {
    const legsNeededToWin = Math.ceil(maxLegs / 2);
    return player.legsWon >= legsNeededToWin;
}
function declareWinner(winner) {
    gameOver = true;
    alert(`${winner.name} wins the set!`);
    renderState();
}
function renderState() {
    const gameDiv = document.getElementById("game");
    if (!gameDiv)
        return;
    const turnHistoryTable = legTurnHistory.length > 0 ? `
    <h3>Turn History</h3>
    <table>
      <thead>
        <tr>
          <th>Turn #</th>
          <th>Player</th>
          <th>Points</th>
          <th>Remaining</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${legTurnHistory.map(turn => `
          <tr class="${turn.isBust ? 'bust' : ''}">
            <td>${turn.turnNumber}</td>
            <td>${turn.playerName}</td>
            <td>${turn.pointsScored}</td>
            <td>${turn.remainingScore}</td>
            <td>${turn.isBust ? '❌ BUST' : turn.remainingScore === 0 ? '🎯 WIN' : '✓'}</td>
            <td class="actions">
              <button class="btn-small" onclick="modifyTurn(${turn.turnNumber})">Edit</button>
              <button class="btn-small btn-danger" onclick="removeTurn(${turn.turnNumber})">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : '';
    const legsNeededToWin = Math.ceil(maxLegs / 2);
    const setStatusTable = `
    <div class="set-status">
      <h3>Set Status (Best of ${maxLegs})</h3>
      <table class="set-table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Legs Won</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          ${players.map(player => `
            <tr class="${player.legsWon >= legsNeededToWin ? 'winner' : ''}">
              <td><strong>${player.name}</strong></td>
              <td>${player.legsWon} / ${legsNeededToWin}</td>
              <td>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${(player.legsWon / legsNeededToWin) * 100}%"></div>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
    gameDiv.innerHTML = `
    ${setStatusTable}
    <h2>Leg ${currentLeg} - Current Scores</h2>
    <ul>
      ${players
        .map((player, index) => `
            <li>
              <strong>${player.name}</strong> — Score: ${player.score}
              ${index === currentPlayerIndex && !gameOver ? " ← current" : ""}
            </li>
          `)
        .join("")}
    </ul>
    <button onclick="recordTurn(60)">Score 60</button>
    <button onclick="recordTurn(100)">Score 100</button>
    <button onclick="recordTurn(140)">Score 140</button>
    ${turnHistoryTable}
  `;
}
startGame(["Player 1", "Player 2"], 501, 5);
//# sourceMappingURL=app.js.map