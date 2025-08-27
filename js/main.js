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

// Initialize Application
function initializeApp() {
  // Check for saved user session
  if (currentUser) {
    console.log("Welcome back,", currentUser.username);
  }

  // Initialize tooltips
  initTooltips();

  // Setup smooth scrolling
  setupSmoothScroll();

  // Check current page and initialize specific features
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  initializePageSpecific(currentPage);
}
// Initialize Authentication System
function initializeAuth() {
  // Wait for AuthManager to be available
  if (typeof window.AuthManager !== "undefined") {
    // Initialize AuthManager with current user
    if (currentUser) {
      window.AuthManager.currentUser = currentUser;
      window.AuthManager.isLoggedIn = true;
    }

    // Update UI immediately
    window.AuthManager.updateAuthUI();

    // Set up listener for auth state changes
    setupAuthStateListener();
  } else {
    // If AuthManager isn't loaded yet, wait a bit and try again
    setTimeout(initializeAuth, 100);
  }
}
