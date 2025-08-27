// Challenges JavaScript Functionality

// Challenge State
const challengeState = {
  currentChallenge: null,
  currentFilter: "all",
  currentSort: "newest",
  completedChallenges: [],
  activeTimer: null,
  startTime: null,
};

// Challenge Data
const challengesData = {
  "contact-card": {
    title: "Create a Contact Card",
    difficulty: "beginner",
    xp: 25,
    description:
      "Build a professional contact card using semantic HTML elements.",
    requirements: [
      "Use semantic HTML5 elements",
      "Include name, title, and contact info",
      "Add a profile image",
      "Make it accessible with proper ARIA labels",
    ],
    starterCode: {
      html: '<!-- Create your contact card here -->\n<div class="contact-card">\n  \n</div>',
      css: ".contact-card {\n  /* Add your styles */\n}",
      js: "// Add any interactivity if needed",
    },
    solution: {
      html: '<article class="contact-card">\n  <img src="profile.jpg" alt="Profile photo">\n  <h2>John Doe</h2>\n  <p>Web Developer</p>\n  <address>\n    <a href="mailto:john@example.com">john@example.com</a>\n    <a href="tel:+1234567890">+1 (234) 567-890</a>\n  </address>\n</article>',
    },
  },
  "responsive-nav": {
    title: "Build a Responsive Navigation Menu",
    difficulty: "intermediate",
    xp: 100,
    description:
      "Create a fully responsive navigation menu with mobile hamburger.",
    requirements: [
      "Mobile-first responsive design",
      "Animated hamburger menu",
      "Smooth transitions",
      "Keyboard navigation support",
      "ARIA labels for accessibility",
    ],
    starterCode: {
      html: "<nav>\n  <!-- Build your navigation -->\n</nav>",
      css: "/* Mobile-first approach */\nnav {\n  \n}",
      js: "// Add hamburger functionality",
    },
  },
  // More challenges would be defined here
};

// Initialize Challenges Page
document.addEventListener("DOMContentLoaded", function () {
  initializeChallenges();
  loadChallenges();
  setupChallengeEventListeners();
  updateProgressStats();
  startWeeklyCountdown();
});

// Initialize Challenges
function initializeChallenges() {
  // Load completed challenges from localStorage
  const saved = localStorage.getItem("codequest_completed_challenges");
  if (saved) {
    challengeState.completedChallenges = JSON.parse(saved);
  }

  // Set up filters
  setupFilters();
}

// Setup Filters
function setupFilters() {
  // Difficulty filter
  const difficultyFilter = document.getElementById("difficultyFilter");
  if (difficultyFilter) {
    difficultyFilter.addEventListener("change", function () {
      filterChallenges("difficulty", this.value);
    });
  }

  // Topic filter
  const topicFilter = document.getElementById("topicFilter");
  if (topicFilter) {
    topicFilter.addEventListener("change", function () {
      filterChallenges("topic", this.value);
    });
  }

  // Sort filter
  const sortFilter = document.getElementById("sortFilter");
  if (sortFilter) {
    sortFilter.addEventListener("change", function () {
      sortChallenges(this.value);
    });
  }
}

// Setup Event Listeners
function setupChallengeEventListeners() {
  // Challenge cards click handlers are added inline
  // Additional event listeners can be added here
}

// Load Challenges
function loadChallenges() {
  const grid = document.getElementById("challengesGrid");
  if (!grid) return;

  // In a real app, this would fetch from an API
  // For now, we'll use the existing HTML structure
  updateChallengeCards();
}

// Update Challenge Cards
function updateChallengeCards() {
  const cards = document.querySelectorAll(".challenge-card");

  cards.forEach((card) => {
    const challengeId = card
      .querySelector("button")
      .getAttribute("onclick")
      .match(/'([^']+)'/)[1];

    if (challengeState.completedChallenges.includes(challengeId)) {
      card.classList.add("completed");
      const button = card.querySelector("button");
      button.textContent = "Review";
      button.classList.remove("btn-primary");
      button.classList.add("btn-success");
    }
  });
}

// Start Challenge
function startChallenge(challengeId) {
  challengeState.currentChallenge = challengeId;
  challengeState.startTime = Date.now();

  const challenge = challengesData[challengeId];

  if (!challenge) {
    // For challenges not in our data, show a placeholder
    openChallengeEditor(challengeId);
    return;
  }

  // Open challenge in editor with instructions
  openChallengeEditor(challengeId, challenge);
}

// Open Challenge Editor
function openChallengeEditor(challengeId, challengeData) {
  // Save challenge data to sessionStorage
  if (challengeData) {
    sessionStorage.setItem("current_challenge", JSON.stringify(challengeData));
  }

  // Redirect to editor with challenge mode
  window.location.href = `editor.html?challenge=${challengeId}`;
}

// Filter Challenges
function filterChallenges(filterType, value) {
  const cards = document.querySelectorAll(".challenge-card");

  cards.forEach((card) => {
    const shouldShow = value === "all" || card.dataset[filterType] === value;

    if (shouldShow) {
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

// Filter by Category
function filterByCategory(category) {
  const cards = document.querySelectorAll(".challenge-card");

  cards.forEach((card) => {
    const cardTopic = card.dataset.topic;

    if (category === "all" || cardTopic === category) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });

  // Update active filter button
  document.querySelectorAll(".category-tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  event.target.classList.add("active");
}

// Filter by Difficulty
function filterByDifficulty(difficulty) {
  document.getElementById("difficultyFilter").value = difficulty;
  filterChallenges("difficulty", difficulty);
}

// Sort Challenges
function sortChallenges(sortBy) {
  const grid = document.getElementById("challengesGrid");
  const cards = Array.from(grid.querySelectorAll(".challenge-card"));

  cards.sort((a, b) => {
    switch (sortBy) {
      case "easiest":
        return (
          getDifficultyValue(a.dataset.difficulty) -
          getDifficultyValue(b.dataset.difficulty)
        );
      case "hardest":
        return (
          getDifficultyValue(b.dataset.difficulty) -
          getDifficultyValue(a.dataset.difficulty)
        );
      case "popular":
        const aSolved =
          parseInt(
            a.querySelector(".challenge-stats span:last-child").textContent
          ) || 0;
        const bSolved =
          parseInt(
            b.querySelector(".challenge-stats span:last-child").textContent
          ) || 0;
        return bSolved - aSolved;
      case "newest":
      default:
        const aNum = parseInt(
          a.querySelector(".challenge-number").textContent.replace("#", "")
        );
        const bNum = parseInt(
          b.querySelector(".challenge-number").textContent.replace("#", "")
        );
        return bNum - aNum;
    }
  });

  // Re-append sorted cards
  cards.forEach((card) => grid.appendChild(card));
}

// Get Difficulty Value
function getDifficultyValue(difficulty) {
  const values = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    expert: 4,
  };
  return values[difficulty] || 0;
}

// Update Progress Stats
function updateProgressStats() {
  const stats = document.querySelectorAll(".progress-stat .stat-value");

  if (stats[0])
    stats[0].textContent = challengeState.completedChallenges.length;
  if (stats[1]) stats[1].textContent = "45"; // Total available
  if (stats[2]) stats[2].textContent = calculateTotalXP();
  if (stats[3]) stats[3].textContent = getCurrentStreak();
}

// Calculate Total XP
function calculateTotalXP() {
  let totalXP = 0;

  challengeState.completedChallenges.forEach((challengeId) => {
    const challenge = challengesData[challengeId];
    if (challenge) {
      totalXP += challenge.xp;
    }
  });

  return totalXP;
}

// Get Current Streak
function getCurrentStreak() {
  const user = window.AuthManager?.currentUser;
  if (user) {
    return window.AuthManager.userProgress.streak;
  }
  return 0;
}

// Complete Challenge
function completeChallenge(challengeId, xp) {
  if (!challengeState.completedChallenges.includes(challengeId)) {
    challengeState.completedChallenges.push(challengeId);

    // Save to localStorage
    localStorage.setItem(
      "codequest_completed_challenges",
      JSON.stringify(challengeState.completedChallenges)
    );

    // Add XP if user is logged in
    if (window.AuthManager && window.AuthManager.currentUser) {
      window.AuthManager.completeChallenge(challengeId, xp);
    }

    // Calculate time taken
    const timeTaken = challengeState.startTime
      ? Math.floor((Date.now() - challengeState.startTime) / 1000)
      : 0;

    // Show completion message
    showChallengeComplete(xp, timeTaken);
  }
}

// Show Challenge Complete
function showChallengeComplete(xp, timeTaken) {
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  const modal = document.createElement("div");
  modal.className = "challenge-complete-modal";
  modal.innerHTML = `
        <div class="modal-content">
            <h2>🎉 Challenge Complete!</h2>
            <div class="completion-stats">
                <div class="stat">
                    <span class="stat-value">+${xp} XP</span>
                    <span class="stat-label">Earned</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${minutes}:${seconds
    .toString()
    .padStart(2, "0")}</span>
                    <span class="stat-label">Time</span>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="reviewSolution()">Review Solution</button>
                <button class="btn btn-primary" onclick="nextChallenge()">Next Challenge</button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  setTimeout(() => {
    modal.classList.add("show");
  }, 100);
}

// Review Solution
function reviewSolution() {
  const challenge = challengesData[challengeState.currentChallenge];
  if (challenge && challenge.solution) {
    // Show solution in a modal or redirect to solution page
    console.log("Solution:", challenge.solution);
  }
  closeCompletionModal();
}

// Next Challenge
function nextChallenge() {
  closeCompletionModal();

  // Find next uncompleted challenge
  const cards = document.querySelectorAll(".challenge-card:not(.completed)");
  if (cards.length > 0) {
    const nextButton = cards[0].querySelector("button");
    if (nextButton) {
      nextButton.click();
    }
  }
}

// Close Completion Modal
function closeCompletionModal() {
  const modal = document.querySelector(".challenge-complete-modal");
  if (modal) {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

// Load More Challenges
function loadMoreChallenges() {
  // In a real app, this would load more challenges from the server
  showNotification("Loading more challenges...", "info");

  // Simulate loading
  setTimeout(() => {
    showNotification("More challenges coming soon!", "success");
  }, 1000);
}

// Weekly Challenge Countdown
function startWeeklyCountdown() {
  updateWeeklyCountdown();
  setInterval(updateWeeklyCountdown, 1000);
}

function updateWeeklyCountdown() {
  const countdown = document.getElementById("weekly-countdown");
  if (!countdown) return;

  const now = new Date();
  const endOfWeek = new Date();
  endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
  endOfWeek.setHours(23, 59, 59, 999);

  const diff = endOfWeek - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  countdown.textContent = `${days}d ${hours}h ${minutes}m`;
}

// Pagination
function changePage(direction) {
  const currentPage = document.querySelector(".page-number.active");
  const pageNumbers = document.querySelectorAll(".page-number");

  let currentIndex = Array.from(pageNumbers).indexOf(currentPage);

  if (direction === "next" && currentIndex < pageNumbers.length - 1) {
    currentIndex++;
  } else if (direction === "prev" && currentIndex > 0) {
    currentIndex--;
  }

  pageNumbers.forEach((page) => page.classList.remove("active"));
  pageNumbers[currentIndex].classList.add("active");

  // Load challenges for the new page
  loadChallengesForPage(currentIndex + 1);
}

function loadChallengesForPage(pageNumber) {
  // In a real app, this would fetch challenges for the specific page
  console.log("Loading page", pageNumber);
}

// Show Notification
function showNotification(message, type = "info") {
  if (window.CodeQuest && window.CodeQuest.showNotification) {
    window.CodeQuest.showNotification(message, type);
  }
}

// Export functions for global use
window.challengeFunctions = {
  startChallenge,
  completeChallenge,
  filterByCategory,
  filterByDifficulty,
  loadMoreChallenges,
  changePage,
};
