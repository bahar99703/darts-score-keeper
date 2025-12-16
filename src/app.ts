// ============================================
// ENUMS - Advanced TypeScript Feature
// ============================================
enum GameType {
  GAME_301 = 301,
  GAME_501 = 501
}

enum TurnStatus {
  VALID = "valid",
  BUST = "bust",
  WIN = "win"
}

// ============================================
// INTERFACES & TYPES
// ============================================
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

interface GameConfig {
  gameType: GameType;
  maxLegs: number;
  playerNames: string[];
}

// Generic utility type for event handlers
type EventHandler<T> = (data: T) => void;

// ============================================
// GAME STATE MANAGEMENT MODULE
// ============================================
class GameState {
  players: Player[] = [];
  currentPlayerIndex: number = 0;
  startScore: GameType = GameType.GAME_501;
  maxLegs: number = 5;
  currentLeg: number = 1;
  gameOver: boolean = false;
  legTurnHistory: Turn[] = [];
  globalTurnNumber: number = 0;
  lastBustPlayerId: number | null = null;

  reset(config: GameConfig): void {
    this.startScore = config.gameType;
    this.maxLegs = config.maxLegs;
    this.currentLeg = 1;
    this.currentPlayerIndex = 0;
    this.gameOver = false;

    this.players = config.playerNames.map((name, index) => ({
      id: index,
      name,
      score: this.startScore,
      legsWon: 0,
      totalPoints: 0,
      turns: 0,
      turnHistory: []
    }));

    this.legTurnHistory = [];
    this.globalTurnNumber = 0;
    this.lastBustPlayerId = null;
  }

  getCurrentPlayer(): Player | null {
    return this.players[this.currentPlayerIndex] || null;
  }

  nextPlayer(): void {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

  getLegsNeededToWin(): number {
    return Math.ceil(this.maxLegs / 2);
  }

  hasWonSet(player: Player): boolean {
    return player.legsWon >= this.getLegsNeededToWin();
  }
}

// ============================================
// GAME LOGIC MODULE
// ============================================
class GameLogic {
  constructor(private state: GameState) {}

  recordTurn(points: number): void {
    if (this.state.gameOver) return;

    const player = this.state.getCurrentPlayer();
    if (!player) return;

    const newScore = player.score - points;
    this.state.globalTurnNumber++;

    const isBust = newScore < 0;
    const turn: Turn = {
      turnNumber: this.state.globalTurnNumber,
      playerId: player.id,
      playerName: player.name,
      pointsScored: isBust ? 0 : points,
      remainingScore: isBust ? player.score : newScore,
      isBust: isBust
    };

    this.state.legTurnHistory.push(turn);
    player.turnHistory.push(turn);

    if (isBust) {
      if (
        this.state.lastBustPlayerId !== null &&
        this.state.lastBustPlayerId !== player.id
      ) {
        renderState();
        setTimeout(() => {
          alert(
            `Both players busted!\n\nResetting Leg ${this.state.currentLeg}...`
          );
          this.resetCurrentLegAuto();
        }, 100);
        return;
      }
      this.state.lastBustPlayerId = player.id;
      this.state.nextPlayer();
      renderState();
      return;
    }

    this.state.lastBustPlayerId = null;
    player.score = newScore;
    player.totalPoints += points;
    player.turns++;

    if (newScore === 0) {
      this.endLeg(player);
      return;
    }

    this.state.nextPlayer();
    renderState();
  }

  removeTurn(turnNumber: number): void {
    if (this.state.gameOver) return;

    const turnIndex = this.state.legTurnHistory.findIndex(
      (t) => t.turnNumber === turnNumber
    );
    if (turnIndex === -1) return;

    const turn = this.state.legTurnHistory[turnIndex];
    this.state.legTurnHistory.splice(turnIndex, 1);

    const player = this.state.players.find((p) => p.id === turn.playerId);
    if (player) {
      const playerTurnIndex = player.turnHistory.findIndex(
        (t) => t.turnNumber === turnNumber
      );
      if (playerTurnIndex !== -1) {
        player.turnHistory.splice(playerTurnIndex, 1);
      }
    }

    this.recalculateScores();
    renderState();
  }

  modifyTurn(turnNumber: number): void {
    if (this.state.gameOver) return;

    const turn = this.state.legTurnHistory.find((t) => t.turnNumber === turnNumber);
    if (!turn) return;

    const newPoints = prompt(
      `Modify points for ${turn.playerName} (Turn ${turnNumber}):`,
      turn.pointsScored.toString()
    );
    if (newPoints === null) return;

    const points = parseInt(newPoints);
    if (isNaN(points) || points < 0) {
      alert("Invalid points value");
      return;
    }

    turn.pointsScored = points;
    this.recalculateScores();
    renderState();
  }

  private recalculateScores(): void {
    this.state.players.forEach((player) => {
      player.score = this.state.startScore;
      player.totalPoints = 0;
      player.turns = 0;
    });

    let winningPlayer: Player | null = null;

    for (const turn of this.state.legTurnHistory) {
      const player = this.state.players.find((p) => p.id === turn.playerId);
      if (!player) continue;

      const newScore = player.score - turn.pointsScored;

      if (newScore < 0) {
        turn.isBust = true;
        turn.remainingScore = player.score;
        turn.pointsScored = 0;
      } else if (newScore === 0) {
        player.score = newScore;
        player.totalPoints += turn.pointsScored;
        player.turns++;
        turn.remainingScore = newScore;
        turn.isBust = false;
        winningPlayer = player;
        break;
      } else {
        player.score = newScore;
        player.totalPoints += turn.pointsScored;
        player.turns++;
        turn.remainingScore = newScore;
        turn.isBust = false;
      }
    }

    if (winningPlayer) {
      alert(
        `${winningPlayer.name} reached exactly zero and wins Leg ${this.state.currentLeg}!`
      );
    }
  }

  private endLeg(winner: Player): void {
    winner.legsWon++;

    if (this.state.hasWonSet(winner)) {
      renderState();
      setTimeout(() => {
        this.declareWinner(winner);
      }, 200);
    } else {
      renderState();
      setTimeout(() => {
        alert(
          `🎯 ${winner.name} wins Leg ${this.state.currentLeg}!\n\n${winner.name} has won ${winner.legsWon} leg(s)!\n\nStarting Leg ${this.state.currentLeg + 1}...`
        );
        this.resetLegScores();
      }, 200);
    }
  }

  private resetLegScores(): void {
    this.state.currentLeg++;

    this.state.players.forEach((player) => {
      player.score = this.state.startScore;
      player.turnHistory = [];
    });

    this.state.legTurnHistory = [];
    this.state.globalTurnNumber = 0;
    this.state.currentPlayerIndex = 0;
    this.state.lastBustPlayerId = null;

    renderState();
  }

  private resetCurrentLegAuto(): void {
    if (this.state.gameOver) return;

    this.state.players.forEach((player) => {
      player.score = this.state.startScore;
      player.turnHistory = [];
    });

    this.state.legTurnHistory = [];
    this.state.globalTurnNumber = 0;
    this.state.currentPlayerIndex = 0;
    this.state.lastBustPlayerId = null;

    renderState();
  }

  private declareWinner(winner: Player): void {
    this.state.gameOver = true;
    alert(`${winner.name} wins the set!`);
    renderState();
  }
}

// ============================================
// UI MODULE
// ============================================
function showSetup(): void {
  const gameDiv = document.getElementById("game");
  if (!gameDiv) return;

  gameDiv.innerHTML = `
    <div class="setup-screen">
      <h2>Game Setup</h2>
      <form id="setupForm" class="setup-form">
        <div class="form-group">
          <label for="player1">Player 1 Name:</label>
          <input
            type="text"
            id="player1"
            value="Player 1"
            required
            aria-label="Player 1 Name"
            aria-required="true"
          />
        </div>
        
        <div class="form-group">
          <label for="player2">Player 2 Name:</label>
          <input
            type="text"
            id="player2"
            value="Player 2"
            required
            aria-label="Player 2 Name"
            aria-required="true"
          />
        </div>
        
        <div class="form-group">
          <label for="gameType">Game Type:</label>
          <select id="gameType" required aria-label="Select game type">
            <option value="501">501</option>
            <option value="301">301</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="setSize">Set Size (Best of):</label>
          <select id="setSize" required aria-label="Select set size">
            <option value="1">1 Leg</option>
            <option value="3">3 Legs</option>
            <option value="5" selected>5 Legs</option>
            <option value="7">7 Legs</option>
            <option value="9">9 Legs</option>
          </select>
        </div>
        
        <button type="submit" class="btn-start" aria-label="Start the game">
          Start Game
        </button>
      </form>
    </div>
  `;

  const form = document.getElementById("setupForm") as HTMLFormElement;
  form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const player1 = (document.getElementById("player1") as HTMLInputElement).value.trim();
    const player2 = (document.getElementById("player2") as HTMLInputElement).value.trim();
    const gameType = parseInt(
      (document.getElementById("gameType") as HTMLSelectElement).value
    ) as 301 | 501;
    const setSize = parseInt(
      (document.getElementById("setSize") as HTMLSelectElement).value
    );

    if (!player1 || !player2) {
      alert("Please enter names for both players");
      return;
    }

    startGame([player1, player2], gameType, setSize);
  });
}

let gameState: GameState;
let gameLogic: GameLogic;

function startGame(playerNames: string[], gameType: 301 | 501, setSize: number): void {
  gameState = new GameState();
  const config: GameConfig = {
    gameType: gameType as GameType,
    maxLegs: setSize,
    playerNames
  };
  gameState.reset(config);
  gameLogic = new GameLogic(gameState);
  renderState();
}

function recordTurn(points: number): void {
  gameLogic?.recordTurn(points);
}

function removeTurn(turnNumber: number): void {
  gameLogic?.removeTurn(turnNumber);
}

function modifyTurn(turnNumber: number): void {
  gameLogic?.modifyTurn(turnNumber);
}

function renderState(): void {
  const gameDiv = document.getElementById("game");
  if (!gameDiv) return;

  const turnHistoryTable =
    gameState.legTurnHistory.length > 0
      ? `
    <h3>Turn History</h3>
    <table role="grid" aria-label="Turn history">
      <thead>
        <tr>
          <th scope="col">Turn #</th>
          <th scope="col">Player</th>
          <th scope="col">Points</th>
          <th scope="col">Remaining</th>
          <th scope="col">Status</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${gameState.legTurnHistory
          .map(
            (turn) => `
          <tr class="${turn.isBust ? "bust" : ""}" role="row">
            <td>${turn.turnNumber}</td>
            <td>${turn.playerName}</td>
            <td>${turn.pointsScored}</td>
            <td>${turn.remainingScore}</td>
            <td>${turn.isBust ? "❌ BUST" : turn.remainingScore === 0 ? "🎯 WIN" : "✓"}</td>
            <td class="actions">
              <button
                class="btn-small"
                onclick="modifyTurn(${turn.turnNumber})"
                aria-label="Edit turn ${turn.turnNumber} for ${turn.playerName}"
              >
                Edit
              </button>
              <button
                class="btn-small btn-danger"
                onclick="removeTurn(${turn.turnNumber})"
                aria-label="Delete turn ${turn.turnNumber} for ${turn.playerName}"
              >
                Delete
              </button>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `
      : "";

  const legsNeededToWin = gameState.getLegsNeededToWin();
  const setStatusTable = `
    <div class="set-status" role="region" aria-label="Set status">
      <h3>Set Status (Best of ${gameState.maxLegs})</h3>
      <table role="grid" aria-label="Player legs won">
        <thead>
          <tr>
            <th scope="col">Player</th>
            <th scope="col">Legs Won</th>
            <th scope="col">Progress</th>
          </tr>
        </thead>
        <tbody>
          ${gameState.players
            .map(
              (player) => `
            <tr class="${player.legsWon >= legsNeededToWin ? "winner" : ""}" role="row">
              <td><strong>${player.name}</strong></td>
              <td>${player.legsWon} / ${legsNeededToWin}</td>
              <td>
                <div class="progress-bar" role="progressbar" aria-valuenow="${player.legsWon}" aria-valuemin="0" aria-valuemax="${legsNeededToWin}">
                  <div class="progress-fill" style="width: ${(player.legsWon / legsNeededToWin) * 100}%"></div>
                </div>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  gameDiv.innerHTML = `
    ${setStatusTable}
    <h2>Leg ${gameState.currentLeg} - Current Scores</h2>
    <ul role="list">
      ${gameState.players
        .map(
          (player, index) => `
            <li role="listitem">
              <strong>${player.name}</strong> — Score: ${player.score}
              ${
                index === gameState.currentPlayerIndex && !gameState.gameOver
                  ? `<span aria-live="polite"> ← current player</span>`
                  : ""
              }
            </li>
          `
        )
        .join("")}
    </ul>
    <div class="button-container">
      <button
        onclick="recordTurn(60)"
        aria-label="Record 60 points for current player"
      >
        Score 60
      </button>
      <button
        onclick="recordTurn(100)"
        aria-label="Record 100 points for current player"
      >
        Score 100
      </button>
      <button
        onclick="recordTurn(140)"
        aria-label="Record 140 points for current player"
      >
        Score 140
      </button>
    </div>
    ${turnHistoryTable}
  `;
}

// Expose functions to window for HTML onclick handlers
(
  window as Window & {
    showSetup: typeof showSetup;
    recordTurn: typeof recordTurn;
    removeTurn: typeof removeTurn;
    modifyTurn: typeof modifyTurn;
  }
).showSetup = showSetup;
(
  window as Window & {
    showSetup: typeof showSetup;
    recordTurn: typeof recordTurn;
    removeTurn: typeof removeTurn;
    modifyTurn: typeof modifyTurn;
  }
).recordTurn = recordTurn;
(
  window as Window & {
    showSetup: typeof showSetup;
    recordTurn: typeof recordTurn;
    removeTurn: typeof removeTurn;
    modifyTurn: typeof modifyTurn;
  }
).removeTurn = removeTurn;
(
  window as Window & {
    showSetup: typeof showSetup;
    recordTurn: typeof recordTurn;
    removeTurn: typeof removeTurn;
    modifyTurn: typeof modifyTurn;
  }
).modifyTurn = modifyTurn;

// Show setup screen on page load
showSetup();