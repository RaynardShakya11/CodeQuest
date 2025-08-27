// Main JavaScript for CodeQuest

// Global Variables
let currentUser = JSON.parse(localStorage.getItem("codequest_user")) || null;

// DOM Ready
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  setupEventListeners();

  // Initialize authentication system
  initializeAuth();

  updateAuthUI();
});
