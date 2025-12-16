interface Player {
  id: number;
  name: string;
  score: number;
  legsWon: number;
  totalPoints: number;
  turns: number;
}

// Game state varaibles 
let players: Player[] = [];
let currentPlayerIndex: number = 0;
let startScore: 301 | 501 = 501;
let maxLegs: number = 5; 
let currentLeg: number = 1;
let gameOver: boolean = false;

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
    turns: 0
  }));

  renderState();
}

// Function to record a player's turn
function recordTurn(points: number): void {
if (gameOver) return;


const player = players[currentPlayerIndex];
const newScore = player.score - points;

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
(window as any).recordTurn = recordTurn;
}
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
});


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
`;
}
startGame(["Player 1", "Player 2"], 501, 5);