// Games JavaScript Functionality

// Game State
const gameState = {
  currentGame: null,
  score: 0,
  level: 1,
  lives: 3,
  timer: null,
  gameData: {},
  highScores: JSON.parse(localStorage.getItem("codequest_highscores") || "{}"),
};

// Initialize Games Page
document.addEventListener("DOMContentLoaded", function () {
  initializeGames();
  setupGameEventListeners();
  startDailyTimer();
  loadHighScores();
});

// Initialize Games
function initializeGames() {
  // Filter categories
  const categoryBtns = document.querySelectorAll(".category-btn");
  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      categoryBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      filterGames(this.dataset.category);
    });
  });

  // Initialize game cards
  animateGameCards();
}

// Setup Event Listeners
function setupGameEventListeners() {
  // Close game modal on outside click
  const gameModal = document.getElementById("gameModal");
  if (gameModal) {
    gameModal.addEventListener("click", function (e) {
      if (e.target === gameModal) {
        closeGame();
      }
    });
  }
}
// Filter Games by Category
function filterGames(category) {
  const gameCards = document.querySelectorAll(".game-card");

  gameCards.forEach((card) => {
    if (category === "all" || card.dataset.category === category) {
      card.style.display = "block";
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 100);
    } else {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      setTimeout(() => {
        card.style.display = "none";
      }, 300);
    }
  });
}

// Start Game
function startGame(gameType) {
  gameState.currentGame = gameType;
  gameState.score = 0;
  gameState.level = 1;
  gameState.lives = 3;

  const gameModal = document.getElementById("gameModal");
  const gameContainer = document.getElementById("gameContainer");

  if (gameModal && gameContainer) {
    gameModal.style.display = "block";

    switch (gameType) {
      case "css-diner":
        initCSSGame();
        break;
      case "html-memory":
        initMemoryGame();
        break;
      case "flexbox-froggy":
        initFlexboxGame();
        break;
      case "code-robot":
        initRobotGame();
        break;
      default:
        initDefaultGame();
    }
  }
}

// Play Game (for individual game cards)
function playGame(gameType) {
  startGame(gameType);
}

// Close Game
function closeGame() {
  const gameModal = document.getElementById("gameModal");
  if (gameModal) {
    gameModal.style.display = "none";
  }

  // Clear any game timers
  if (gameState.timer) {
    clearInterval(gameState.timer);
  }

  // Save progress
  saveGameProgress();
}
// CSS Diner Game
function initCSSGame() {
  const gameContainer = document.getElementById("gameContainer");

  const levels = [
    {
      selector: "plate",
      instruction: "Select all plates",
      html: "<plate></plate><plate></plate>",
    },
    {
      selector: ".apple",
      instruction: "Select apples",
      html: '<div class="apple"></div><div class="orange"></div>',
    },
    {
      selector: "#special",
      instruction: "Select the special item",
      html: '<div id="special"></div><div></div>',
    },
    {
      selector: "plate .apple",
      instruction: "Select apples on plates",
      html: '<plate><div class="apple"></div></plate>',
    },
  ];

  const currentLevel = levels[gameState.level - 1] || levels[0];

  gameContainer.innerHTML = `
        <div class="css-game">
            <h2>CSS Selector Challenge - Level ${gameState.level}</h2>
            <div class="game-instruction">
                <p>${currentLevel.instruction}</p>
            </div>
            
            <div class="game-board">
                <div class="table-preview">
                    ${currentLevel.html}
                </div>
            </div>
            
            <div class="selector-input">
                <input type="text" id="selectorInput" placeholder="Enter CSS selector..." />
                <button onclick="checkCSSAnswer()">Submit</button>
            </div>
            
            <div class="game-stats">
                <span>Score: ${gameState.score}</span>
                <span>Lives: ${"❤️".repeat(gameState.lives)}</span>
            </div>
        </div>
    `;

  // Style the game elements
  addGameStyles();
}

// Memory Game
function initMemoryGame() {
  const gameContainer = document.getElementById("gameContainer");

  const cards = [
    { tag: "<div>", desc: "Generic container" },
    { tag: "<p>", desc: "Paragraph" },
    { tag: "<h1>", desc: "Main heading" },
    { tag: "<img>", desc: "Image" },
    { tag: "<a>", desc: "Link" },
    { tag: "<ul>", desc: "Unordered list" },
    { tag: "<form>", desc: "Form container" },
    { tag: "<input>", desc: "Input field" },
  ];

  // Duplicate and shuffle cards
  const gameCards = [...cards, ...cards].sort(() => Math.random() - 0.5);

  gameContainer.innerHTML = `
        <div class="memory-game">
            <h2>HTML Tag Memory Game</h2>
            <div class="game-stats">
                <span>Score: ${gameState.score}</span>
                <span>Matches: 0/${cards.length}</span>
            </div>
            
            <div class="memory-grid">
                ${gameCards
                  .map(
                    (card, index) => `
                    <div class="memory-card" data-index="${index}" onclick="flipCard(${index})">
                        <div class="card-front">?</div>
                        <div class="card-back">
                            <div class="card-tag">${card.tag}</div>
                            <div class="card-desc">${card.desc}</div>
                        </div>
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>
    `;

  gameState.gameData = {
    cards: gameCards,
    flipped: [],
    matched: [],
    attempts: 0,
  };
}

// Flexbox Froggy Game
function initFlexboxGame() {
  const gameContainer = document.getElementById("gameContainer");

  gameContainer.innerHTML = `
        <div class="flexbox-game">
            <h2>Flexbox Froggy - Level ${gameState.level}</h2>
            <div class="game-instruction">
                <p>Use flexbox properties to help the frogs reach their lily pads!</p>
            </div>
            
            <div class="game-split">
                <div class="code-panel">
                    <pre><code>.pond {
  display: flex;
  <input type="text" id="flexProperty" placeholder="justify-content: ???" />
}</code></pre>
                    <button onclick="applyFlexbox()">Apply</button>
                </div>
                
                <div class="pond-preview">
                    <div class="pond" id="pond">
                        <div class="frog">🐸</div>
                        <div class="lilypad">🌸</div>
                    </div>
                </div>
            </div>
            
            <div class="game-stats">
                <span>Score: ${gameState.score}</span>
                <span>Level: ${gameState.level}/10</span>
            </div>
        </div>
    `;
}

// Robot Game
function initRobotGame() {
  const gameContainer = document.getElementById("gameContainer");

  const grid = createGrid(5, 5);

  gameContainer.innerHTML = `
        <div class="robot-game">
            <h2>Code Robot - Level ${gameState.level}</h2>
            <div class="game-instruction">
                <p>Program the robot to collect all gems!</p>
            </div>
            
            <div class="game-split">
                <div class="code-editor">
                    <h3>JavaScript Commands:</h3>
                    <textarea id="robotCode" rows="10" placeholder="// Available commands:
// robot.moveUp()
// robot.moveDown()
// robot.moveLeft()
// robot.moveRight()
// robot.collect()

// Write your code here:"></textarea>
                    <button onclick="runRobotCode()">Run Code</button>
                    <button onclick="resetRobot()">Reset</button>
                </div>
                
                <div class="game-grid">
                    ${grid}
                </div>
            </div>
            
            <div class="game-stats">
                <span>Gems: 0/3</span>
                <span>Moves: 0</span>
            </div>
        </div>
    `;

  // Place robot and gems
  placeGameElements();
}

// Default Game
function initDefaultGame() {
  const gameContainer = document.getElementById("gameContainer");

  gameContainer.innerHTML = `
        <div class="default-game">
            <h2>Coming Soon!</h2>
            <p>This game is under development. Check back soon!</p>
            <button onclick="closeGame()">Close</button>
        </div>
    `;
}

// Helper Functions
function createGrid(rows, cols) {
  let grid = '<div class="grid">';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid += `<div class="grid-cell" data-row="${i}" data-col="${j}"></div>`;
    }
  }
  grid += "</div>";
  return grid;
}

function placeGameElements() {
  // Place robot at starting position
  const startCell = document.querySelector('[data-row="0"][data-col="0"]');
  if (startCell) {
    startCell.innerHTML = "🤖";
    startCell.classList.add("robot");
  }

  // Place gems randomly
  const gems = [
    [1, 2],
    [2, 4],
    [4, 3],
  ];
  gems.forEach(([row, col]) => {
    const cell = document.querySelector(
      `[data-row="${row}"][data-col="${col}"]`
    );
    if (cell) {
      cell.innerHTML = "💎";
      cell.classList.add("gem");
    }
  });
}

// Game Actions
function checkCSSAnswer() {
  const input = document.getElementById("selectorInput");
  const answer = input.value.trim();

  // Check answer (simplified)
  if (answer === "plate" || answer === ".apple" || answer === "#special") {
    gameState.score += 100;
    gameState.level++;
    showGameNotification("Correct! +100 points", "success");

    setTimeout(() => {
      if (gameState.level <= 4) {
        initCSSGame();
      } else {
        endGame("Victory! You completed all levels!");
      }
    }, 1500);
  } else {
    gameState.lives--;
    showGameNotification("Try again!", "error");

    if (gameState.lives <= 0) {
      endGame("Game Over! Try again?");
    }
  }
}

function flipCard(index) {
  const card = document.querySelector(`.memory-card[data-index="${index}"]`);

  if (
    !card ||
    card.classList.contains("flipped") ||
    gameState.gameData.flipped.length >= 2
  ) {
    return;
  }

  card.classList.add("flipped");
  gameState.gameData.flipped.push(index);

  if (gameState.gameData.flipped.length === 2) {
    checkMemoryMatch();
  }
}

function checkMemoryMatch() {
  const [first, second] = gameState.gameData.flipped;
  const cards = gameState.gameData.cards;

  setTimeout(() => {
    if (cards[first].tag === cards[second].tag) {
      // Match found
      gameState.gameData.matched.push(first, second);
      gameState.score += 50;
      showGameNotification("Match! +50 points", "success");

      if (gameState.gameData.matched.length === cards.length) {
        endGame("Congratulations! You found all matches!");
      }
    } else {
      // No match
      document.querySelectorAll(".memory-card.flipped").forEach((card) => {
        if (
          !gameState.gameData.matched.includes(parseInt(card.dataset.index))
        ) {
          card.classList.remove("flipped");
        }
      });
    }

    gameState.gameData.flipped = [];
  }, 1000);
}

function applyFlexbox() {
  const input = document.getElementById("flexProperty");
  const pond = document.getElementById("pond");

  if (input && pond) {
    const property = input.value.trim();

    // Apply the CSS property
    if (property.includes("justify-content")) {
      const value = property.split(":")[1].trim().replace(";", "");
      pond.style.justifyContent = value;

      // Check if frog reached lilypad (simplified)
      if (value === "flex-end" || value === "space-between") {
        gameState.score += 150;
        gameState.level++;
        showGameNotification("Great job! +150 points", "success");

        setTimeout(() => {
          initFlexboxGame();
        }, 1500);
      }
    }
  }
}

function runRobotCode() {
  const code = document.getElementById("robotCode").value;

  // Create a safe robot object
  const robot = {
    position: { row: 0, col: 0 },
    moves: 0,
    gems: 0,
    moveUp: function () {
      this.move(-1, 0);
    },
    moveDown: function () {
      this.move(1, 0);
    },
    moveLeft: function () {
      this.move(0, -1);
    },
    moveRight: function () {
      this.move(0, 1);
    },
    move: function (dRow, dCol) {
      const newRow = this.position.row + dRow;
      const newCol = this.position.col + dCol;

      if (newRow >= 0 && newRow < 5 && newCol >= 0 && newCol < 5) {
        this.position.row = newRow;
        this.position.col = newCol;
        this.moves++;
        updateRobotPosition();
      }
    },
    collect: function () {
      const cell = document.querySelector(
        `[data-row="${this.position.row}"][data-col="${this.position.col}"]`
      );
      if (cell && cell.classList.contains("gem")) {
        cell.classList.remove("gem");
        cell.innerHTML = "";
        this.gems++;
        gameState.score += 75;
        showGameNotification("Gem collected! +75 points", "success");
      }
    },
  };

  try {
    // Execute user code in a controlled way
    eval(code);

    if (robot.gems >= 3) {
      endGame("Level Complete! All gems collected!");
    }
  } catch (error) {
    showGameNotification("Error in code: " + error.message, "error");
  }
}

function updateRobotPosition() {
  // Update robot display position
  document.querySelectorAll(".grid-cell").forEach((cell) => {
    if (cell.classList.contains("robot")) {
      cell.classList.remove("robot");
      if (!cell.classList.contains("gem")) {
        cell.innerHTML = "";
      }
    }
  });

  // Place robot at new position
  const robot = gameState.gameData.robot;
  if (robot) {
    const cell = document.querySelector(
      `[data-row="${robot.position.row}"][data-col="${robot.position.col}"]`
    );
    if (cell) {
      cell.classList.add("robot");
      cell.innerHTML = "🤖" + (cell.classList.contains("gem") ? "💎" : "");
    }
  }
}

function resetRobot() {
  initRobotGame();
}
// Game Notifications
function showGameNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `game-notification ${type}`;
  notification.textContent = message;

  const gameContainer = document.getElementById("gameContainer");
  if (gameContainer) {
    gameContainer.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);
  }
}

// End Game
function endGame(message) {
  const gameContainer = document.getElementById("gameContainer");

  // Save high score
  saveHighScore();

  gameContainer.innerHTML = `
        <div class="game-over">
            <h2>${message}</h2>
            <div class="final-score">
                <h3>Final Score: ${gameState.score}</h3>
                <p>Level Reached: ${gameState.level}</p>
            </div>
            <div class="game-actions">
                <button onclick="startGame('${gameState.currentGame}')">Play Again</button>
                <button onclick="closeGame()">Exit</button>
            </div>
        </div>
    `;
}

// Save Game Progress
function saveGameProgress() {
  const progress = {
    lastGame: gameState.currentGame,
    totalScore: gameState.score,
    timestamp: new Date().toISOString(),
  };

  localStorage.setItem("codequest_game_progress", JSON.stringify(progress));

  // Add XP to user profile
  if (window.AuthManager && window.AuthManager.currentUser) {
    window.AuthManager.addXP(Math.floor(gameState.score / 10));
  }
}

// High Scores
function saveHighScore() {
  if (!gameState.highScores[gameState.currentGame]) {
    gameState.highScores[gameState.currentGame] = [];
  }

  gameState.highScores[gameState.currentGame].push({
    score: gameState.score,
    level: gameState.level,
    date: new Date().toISOString(),
    player: window.AuthManager?.currentUser?.username || "Anonymous",
  });

  // Sort and keep top 10
  gameState.highScores[gameState.currentGame].sort((a, b) => b.score - a.score);
  gameState.highScores[gameState.currentGame] = gameState.highScores[
    gameState.currentGame
  ].slice(0, 10);

  localStorage.setItem(
    "codequest_highscores",
    JSON.stringify(gameState.highScores)
  );
}

function loadHighScores() {
  // Display high scores in leaderboard section if exists
  const leaderboard = document.getElementById("gameLeaderboard");
  if (leaderboard) {
    // Implementation for displaying high scores
  }
}
// Daily Challenge Timer
function startDailyTimer() {
  updateDailyTimer();
  setInterval(updateDailyTimer, 1000);
}

function updateDailyTimer() {
  const timer = document.getElementById("daily-timer");
  if (!timer) return;

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const diff = tomorrow - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  timer.textContent = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Game Styles
function addGameStyles() {
  const style = document.createElement("style");
  style.textContent = `
        .css-game {
            padding: 2rem;
            text-align: center;
        }
        
        .game-board {
            margin: 2rem 0;
            padding: 2rem;
            background: rgba(30, 41, 59, 0.8);
            border-radius: 12px;
        }
        
        .table-preview {
            display: flex;
            justify-content: center;
            gap: 2rem;
            font-size: 3rem;
        }
        
        .selector-input {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin: 2rem 0;
        }
        
        .selector-input input {
            padding: 0.75rem 1.5rem;
            font-size: 1.1rem;
            border-radius: 8px;
            border: 2px solid var(--primary);
            background: rgba(30, 41, 59, 0.8);
            color: white;
            min-width: 300px;
        }
        
        .memory-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            margin: 2rem 0;
            max-width: 600px;
            margin: 2rem auto;
        }
        
        .memory-card {
            aspect-ratio: 1;
            position: relative;
            cursor: pointer;
            transform-style: preserve-3d;
            transition: transform 0.6s;
        }
        
        .memory-card.flipped {
            transform: rotateY(180deg);
        }
        
        .card-front, .card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }
        
        .card-front {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            font-size: 2rem;
        }
        
        .card-back {
            background: rgba(30, 41, 59, 0.9);
            transform: rotateY(180deg);
            border: 2px solid var(--primary);
        }
        
        .game-notification {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 1rem 2rem;
            border-radius: 12px;
            font-size: 1.2rem;
            font-weight: bold;
            z-index: 100;
            animation: fadeInOut 2s ease;
        }
        
        .game-notification.success {
            background: var(--success);
            color: white;
        }
        
        .game-notification.error {
            background: var(--danger);
            color: white;
        }
        
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
        
        .game-stats {
            display: flex;
            justify-content: center;
            gap: 2rem;
            font-size: 1.2rem;
            margin-top: 2rem;
        }
        
        .game-over {
            text-align: center;
            padding: 3rem;
        }
        
        .game-over h2 {
            font-size: 3rem;
            margin-bottom: 2rem;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .final-score {
            margin: 2rem 0;
            font-size: 1.5rem;
        }
        
        .game-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }
    `;

  document.head.appendChild(style);
}