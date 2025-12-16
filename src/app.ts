interface Turn {
  turnNumber: number;
  playerId: number;
  playerName: string;
  pointsScored: number;
  remainingScore: number;
  isBust: boolean;
}

interface Player {
  id: number;
  name: string;
  score: number;
  legsWon: number;
  totalPoints: number;
  turns: number;
  turnHistory: Turn[];
}

// Game state varaibles 
let players: Player[] = [];
let currentPlayerIndex: number = 0;
let startScore: 301 | 501 = 501;
let maxLegs: number = 5; 
let currentLeg: number = 1;
let gameOver: boolean = false;
let legTurnHistory: Turn[] = [];
let globalTurnNumber: number = 0;

// Function to start a new game
function startGame(
  playerNames: string[],
  startingScore: 301 | 501,
  legsToWin: number
): void {
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
function recordTurn(points: number): void {
  if (gameOver) return;

  const player = players[currentPlayerIndex];
  const newScore = player.score - points;
  globalTurnNumber++;

  const isBust = newScore < 0;
  const turn: Turn = {
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
(window as any).recordTurn = recordTurn;
// Function to swtich to the next player 
function nextPlayer(): void {
currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
}
function endLeg(winner: Player): void {
winner.legsWon++;


if (hasWonSet(winner)) {
declareWinner(winner);
} else {
resetLegScores();
}
}


function resetLegScores(): void {
  players.forEach(player => {
    player.score = startScore;
    player.turnHistory = [];
  });

  legTurnHistory = [];
  globalTurnNumber = 0;
  currentLeg++;
  currentPlayerIndex = 0; // could alternate starter if desired

  renderState();
}
function hasWonSet(player: Player): boolean {
const legsNeededToWin = Math.ceil(maxLegs / 2);
return player.legsWon >= legsNeededToWin;
}


function declareWinner(winner: Player): void {
gameOver = true;
alert(`${winner.name} wins the set!`);
renderState();
}

function renderState(): void {
  const gameDiv = document.getElementById("game");
  if (!gameDiv) return;

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
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : '';

  gameDiv.innerHTML = `
    <h2>Leg ${currentLeg}</h2>
    <ul>
      ${players
        .map(
          (player, index) => `
            <li>
              <strong>${player.name}</strong> — Score: ${player.score}, Legs Won: ${player.legsWon}
              ${index === currentPlayerIndex && !gameOver ? " ← current" : ""}
            </li>
          `
        )
        .join("")}
    </ul>
    <button onclick="recordTurn(60)">Score 60</button>
    <button onclick="recordTurn(100)">Score 100</button>
    <button onclick="recordTurn(140)">Score 140</button>
    ${turnHistoryTable}
  `;
}
startGame(["Player 1", "Player 2"], 501, 5);