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