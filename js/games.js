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