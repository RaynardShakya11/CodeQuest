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

// Setup Authentication State Listener
function setupAuthStateListener() {
  // Listen for auth state changes from AuthManager
  if (window.AuthManager) {
    // Override the updateAuthUI method to also update our local state
    const originalUpdateAuthUI = window.AuthManager.updateAuthUI;
    window.AuthManager.updateAuthUI = function () {
      // Call original method
      originalUpdateAuthUI.call(this);

      // Sync our local state
      currentUser = this.currentUser;
      if (this.currentUser) {
        localStorage.setItem(
          "codequest_user",
          JSON.stringify(this.currentUser)
        );
      } else {
        localStorage.removeItem("codequest_user");
      }
    };
  }
}
// Update Authentication UI
function updateAuthUI() {
  // Use AuthManager if available, otherwise fall back to basic logic
  if (
    typeof window.AuthManager !== "undefined" &&
    window.AuthManager.updateAuthUI
  ) {
    window.AuthManager.updateAuthUI();
  } else {
    // Fallback UI update logic
    const authButtons = document.getElementById("authButtons");
    const userMenu = document.getElementById("userMenu");
    const userGreeting = document.getElementById("userGreeting");

    if (currentUser && authButtons && userMenu && userGreeting) {
      authButtons.style.display = "none";
      userMenu.style.display = "inline-flex";
      userGreeting.textContent = `Welcome, ${currentUser.username}!`;
    } else if (authButtons && userMenu) {
      authButtons.style.display = "inline-flex";
      userMenu.style.display = "none";
    }
  }
}
// Setup Event Listeners
function setupEventListeners() {
  // Hamburger menu
  const hamburger = document.getElementById("hamburger");
  if (hamburger) {
    hamburger.addEventListener("click", toggleMobileMenu);
  }

  // Close modals on outside click
  window.addEventListener("click", function (event) {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none";
    }
  });

  // Form submissions
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup);
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", handleKeyboardShortcuts);
}

// Toggle Mobile Menu
function toggleMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
}

// Close Mobile Menu
function closeMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
  }
}
// Smooth Scrolling
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        closeMobileMenu();
      }
    });
  });
}
// Initialize Tooltips
function initTooltips() {
  const tooltips = document.querySelectorAll("[data-tooltip]");
  tooltips.forEach((element) => {
    element.addEventListener("mouseenter", showTooltip);
    element.addEventListener("mouseleave", hideTooltip);
  });
}

function showTooltip(e) {
  const text = e.target.getAttribute("data-tooltip");
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.textContent = text;
  document.body.appendChild(tooltip);

  const rect = e.target.getBoundingClientRect();
  tooltip.style.left =
    rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
  tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + "px";
}

function hideTooltip() {
  const tooltip = document.querySelector(".tooltip");
  if (tooltip) {
    tooltip.remove();
  }
}

// Page Specific Initialization
function initializePageSpecific(page) {
  switch (page) {
    case "index.html":
    case "":
      initHomePage();
      break;
    case "learn.html":
      initLearnPage();
      break;
    case "editor.html":
      initEditorPage();
      break;
    case "challenges.html":
      initChallengesPage();
      break;
    case "games.html":
      initGamesPage();
      break;
    case "leaderboard.html":
      initLeaderboard();
      break;
    case "dashboard.html":
      initDashboard();
      break;
  }
}
/ Home Page Initialization
function initHomePage() {
  // Add any home page specific initialization
  animateStats();
}
// Animate Statistics
function animateStats() {
  const stats = document.querySelectorAll(".stat-number");
  stats.forEach((stat) => {
    const target = parseInt(stat.textContent.replace(/\D/g, ""));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
        stat.textContent =
          formatNumber(current) + stat.textContent.replace(/[\d,]/g, "");
      } else {
        stat.textContent =
          formatNumber(Math.floor(current)) +
          stat.textContent.replace(/[\d,]/g, "");
      }
    }, 16);
  });
}
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Keyboard Shortcuts
function handleKeyboardShortcuts(e) {
  // Ctrl/Cmd + K - Focus search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.focus();
    }
  }

  // Escape - Close modals
  if (e.key === "Escape") {
    closeAllModals();
  }
}
// Close All Modals
function closeAllModals() {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.style.display = "none";
  });
}

// Close Specific Modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}
// Show Notification
function showNotification(message, type = "info", duration = 3000) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);