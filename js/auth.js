// Authentication Module for CodeQuest

// User Management
class UserManager {
  constructor() {
    this.currentUser = this.loadUser();
    this.userProgress = this.loadProgress();
  }

  // Load user from localStorage
  loadUser() {
    const userData = localStorage.getItem("codequest_user");
    return userData ? JSON.parse(userData) : null;
  }

  // Load user progress
  loadProgress() {
    const progressData = localStorage.getItem("codequest_progress");
    return progressData ? JSON.parse(progressData) : this.getDefaultProgress();
  }

  // Get default progress structure
  getDefaultProgress() {
    return {
      totalXP: 0,
      level: 1,
      levelTitle: "Beginner",
      streak: 0,
      lastLogin: new Date().toISOString(),
      completedLessons: [],
      completedChallenges: [],
      badges: [],
      achievements: [],
      projects: [],
      statistics: {
        html: { xp: 0, progress: 0, lessons: 0 },
        css: { xp: 0, progress: 0, lessons: 0 },
        javascript: { xp: 0, progress: 0, lessons: 0 },
      },
    };
  }

  // Register new user
  register(username, email, password) {
    // Validate input
    if (!this.validateEmail(email)) {
      throw new Error("Invalid email address");
    }
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
    if (username.length < 3) {
      throw new Error("Username must be at least 3 characters");
    }

    // Check if user already exists
    const existingUsers = JSON.parse(
      localStorage.getItem("codequest_users") || "[]"
    );
    if (existingUsers.find((u) => u.email === email)) {
      throw new Error("Email already registered");
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username: username,
      email: email,
      password: this.hashPassword(password), // In production, use proper hashing
      createdAt: new Date().toISOString(),
      avatar: this.generateAvatar(username),
    };

    // Save user
    existingUsers.push(newUser);
    localStorage.setItem("codequest_users", JSON.stringify(existingUsers));

    // Log in the new user
    this.login(email, password);

    return newUser;
  }

  // Login user
  login(email, password) {
    const users = JSON.parse(localStorage.getItem("codequest_users") || "[]");
    const user = users.find((u) => u.email === email);

    if (!user) {
      throw new Error("User not found");
    }

    if (!this.verifyPassword(password, user.password)) {
      throw new Error("Invalid password");
    }

    // Set current user
    this.currentUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    };

    localStorage.setItem("codequest_user", JSON.stringify(this.currentUser));

    // Update streak
    this.updateStreak();

    // Trigger UI update
    this.updateAuthUI();

    return this.currentUser;
  }

  // Logout user
  logout() {
    this.currentUser = null;
    localStorage.removeItem("codequest_user");
    this.updateAuthUI();
    window.location.href = "index.html";
  }

  // Update login streak
  updateStreak() {
    const progress = this.userProgress;
    const lastLogin = new Date(progress.lastLogin);
    const today = new Date();
    const daysDiff = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      progress.streak++;
    } else if (daysDiff > 1) {
      progress.streak = 1;
    }

    progress.lastLogin = today.toISOString();
    this.saveProgress();
  }

  // Save progress
  saveProgress() {
    localStorage.setItem(
      "codequest_progress",
      JSON.stringify(this.userProgress)
    );
  }

  // Add XP
  addXP(amount, category = null) {
    this.userProgress.totalXP += amount;

    if (category && this.userProgress.statistics[category]) {
      this.userProgress.statistics[category].xp += amount;
    }

    // Check for level up
    this.checkLevelUp();

    // Save progress
    this.saveProgress();
  }

  // Check for level up
  checkLevelUp() {
    const xp = this.userProgress.totalXP;
    let newLevel = 1;
    let newTitle = "Beginner";

    if (xp >= 5000) {
      newLevel = 10;
      newTitle = "Expert";
    } else if (xp >= 3000) {
      newLevel = 8;
      newTitle = "Advanced";
    } else if (xp >= 1500) {
      newLevel = 6;
      newTitle = "Intermediate";
    } else if (xp >= 500) {
      newLevel = 4;
      newTitle = "Junior Developer";
    } else if (xp >= 100) {
      newLevel = 2;
      newTitle = "Novice";
    }

    if (newLevel > this.userProgress.level) {
      this.userProgress.level = newLevel;
      this.userProgress.levelTitle = newTitle;
      this.showLevelUpNotification(newLevel, newTitle);
    }
  }

  // Show level up notification
  showLevelUpNotification(level, title) {
    if (window.CodeQuest && window.CodeQuest.showNotification) {
      window.CodeQuest.showNotification(
        `🎉 Level Up! You're now Level ${level} - ${title}!`,
        "success",
        5000
      );
    }
  }

  // Complete lesson
  completeLesson(lessonId, xp) {
    if (!this.userProgress.completedLessons.includes(lessonId)) {
      this.userProgress.completedLessons.push(lessonId);
      this.addXP(xp);
      this.checkAchievements();
      this.saveProgress();
    }
  }

  // Complete challenge
  completeChallenge(challengeId, xp) {
    if (!this.userProgress.completedChallenges.includes(challengeId)) {
      this.userProgress.completedChallenges.push(challengeId);
      this.addXP(xp);
      this.checkAchievements();
      this.saveProgress();
    }
  }

  // Check achievements
  checkAchievements() {
    const achievements = [];

    // First lesson achievement
    if (this.userProgress.completedLessons.length === 1) {
      achievements.push("first-steps");
    }

    // 10 lessons achievement
    if (this.userProgress.completedLessons.length === 10) {
      achievements.push("dedicated-learner");
    }

    // First challenge achievement
    if (this.userProgress.completedChallenges.length === 1) {
      achievements.push("challenger");
    }

    // 7-day streak achievement
    if (this.userProgress.streak >= 7) {
      achievements.push("week-warrior");
    }

    // Add new achievements
    achievements.forEach((achievement) => {
      if (!this.userProgress.achievements.includes(achievement)) {
        this.userProgress.achievements.push(achievement);
        this.showAchievementNotification(achievement);
      }
    });

    this.saveProgress();
  }

  // Show achievement notification
  showAchievementNotification(achievement) {
    const achievementData = {
      "first-steps": {
        title: "First Steps",
        desc: "Complete your first lesson",
        icon: "👣",
      },
      "dedicated-learner": {
        title: "Dedicated Learner",
        desc: "Complete 10 lessons",
        icon: "📚",
      },
      challenger: {
        title: "Challenger",
        desc: "Complete your first challenge",
        icon: "🎯",
      },
      "week-warrior": {
        title: "Week Warrior",
        desc: "7-day learning streak",
        icon: "🔥",
      },
    };

    const data = achievementData[achievement];
    if (data && window.CodeQuest && window.CodeQuest.showNotification) {
      window.CodeQuest.showNotification(
        `${data.icon} Achievement Unlocked: ${data.title}!`,
        "success",
        5000
      );
    }
  }

  // Update UI based on auth state
  updateAuthUI() {
    const authButtons = document.getElementById("authButtons");
    const userMenu = document.getElementById("userMenu");
    const userGreeting = document.getElementById("userGreeting");

    if (this.currentUser) {
      if (authButtons) authButtons.style.display = "none";
      if (userMenu) {
        userMenu.style.display = "flex";
        userMenu.style.gap = "1rem";
        userMenu.style.alignItems = "center";
      }
      if (userGreeting) {
        userGreeting.textContent = `Welcome, ${this.currentUser.username}!`;
      }
    } else {
      if (authButtons) {
        authButtons.style.display = "flex";
        authButtons.style.gap = "1rem";
      }
      if (userMenu) userMenu.style.display = "none";
    }
  }

  // Helper functions
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  hashPassword(password) {
    // Simple hash for demo - use bcrypt or similar in production
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  verifyPassword(password, hash) {
    return this.hashPassword(password) === hash;
  }

  generateAvatar(username) {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#F9CA24",
      "#F0932B",
      "#6C5CE7",
    ];
    const color = colors[username.length % colors.length];
    return {
      initials: username.substring(0, 2).toUpperCase(),
      color: color,
    };
  }
}

// Initialize user manager
const userManager = new UserManager();

// Auth Modal Functions
function showLogin() {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "block";
}

function showSignup() {
  const modal = document.getElementById("signupModal");
  if (modal) modal.style.display = "block";
}

function switchToSignup() {
  closeModal("loginModal");
  showSignup();
}

function switchToLogin() {
  closeModal("signupModal");
  showLogin();
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "none";
}

// Handle login form submission
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    userManager.login(email, password);
    closeModal("loginModal");

    if (window.CodeQuest && window.CodeQuest.showNotification) {
      window.CodeQuest.showNotification("Welcome back!", "success");
    }

    // Redirect to dashboard if on homepage
    if (
      window.location.pathname === "/" ||
      window.location.pathname.includes("index.html")
    ) {
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    }
  } catch (error) {
    if (window.CodeQuest && window.CodeQuest.showNotification) {
      window.CodeQuest.showNotification(error.message, "error");
    }
  }
}

// Handle signup form submission
function handleSignup(event) {
  event.preventDefault();

  const username = document.getElementById("signupUsername").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    userManager.register(username, email, password);
    closeModal("signupModal");

    if (window.CodeQuest && window.CodeQuest.showNotification) {
      window.CodeQuest.showNotification(
        "Account created successfully!",
        "success"
      );
    }

    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
  } catch (error) {
    if (window.CodeQuest && window.CodeQuest.showNotification) {
      window.CodeQuest.showNotification(error.message, "error");
    }
  }
}

// Logout function
function logout() {
  userManager.logout();
}

// Update auth UI on page load
function updateAuthUI() {
  userManager.updateAuthUI();
}

// Initialize auth on DOM load
document.addEventListener("DOMContentLoaded", function () {
  // Set up form handlers
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup);
  }

  // Update UI
  updateAuthUI();
});

// Export for use in other modules
window.AuthManager = userManager;
