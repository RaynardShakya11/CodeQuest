// Dashboard JavaScript Functionality

// Initialize Dashboard
document.addEventListener("DOMContentLoaded", function () {
  if (!checkAuthentication()) {
    return;
  }

  initializeDashboard();
  loadUserData();
  loadUserProjects();
  loadRecentActivity();
  loadAchievements();
  loadStudyPlan();
  setupEventListeners();
});

// Check Authentication
function checkAuthentication() {
  const user = window.AuthManager?.currentUser;

  if (!user) {
    // Redirect to login
    window.location.href = "index.html";
    return false;
  }

  return true;
}

// Initialize Dashboard
function initializeDashboard() {
  // Update welcome message
  const user = window.AuthManager.currentUser;
  const progress = window.AuthManager.userProgress;

  // Update user info
  document.getElementById(
    "userName"
  ).textContent = `Welcome back, ${user.username}!`;
  document.getElementById("avatarInitials").textContent = user.avatar.initials;
  document.getElementById(
    "userAvatar"
  ).style.background = `linear-gradient(135deg, ${user.avatar.color}, var(--secondary))`;

  // Update level and badges
  document.getElementById(
    "userLevel"
  ).textContent = `Level ${progress.level} - ${progress.levelTitle}`;
  document.getElementById(
    "userStreak"
  ).textContent = `🔥 ${progress.streak} Day Streak`;
  document.getElementById("userXP").textContent = `${progress.totalXP} XP`;

  // Update greeting in navbar
  const userGreeting = document.getElementById("userGreeting");
  if (userGreeting) {
    userGreeting.textContent = `Welcome, ${user.username}!`;
  }
}

// Load User Data
function loadUserData() {
  const progress = window.AuthManager.userProgress;

  // Update progress cards
  animateNumber("completedLessons", progress.completedLessons.length);
  animateNumber("completedChallenges", progress.completedChallenges.length);
  animateNumber("earnedBadges", progress.badges.length);
  animateNumber("projectsCreated", progress.projects?.length || 0);

  // Update learning progress
  updateLearningProgress();
}

// Update Learning Progress
function updateLearningProgress() {
  const progress = window.AuthManager.userProgress;
  const stats = progress.statistics;

  // HTML Progress
  const htmlProgress = calculateProgress("html");
  document.getElementById("htmlProgress").style.width = `${htmlProgress}%`;
  document.getElementById("htmlXP").textContent = `${stats.html.xp} XP`;
  document.getElementById(
    "htmlLessons"
  ).textContent = `${stats.html.lessons}/45 Lessons`;
  document.getElementById("htmlPercent").textContent = `${Math.round(
    htmlProgress
  )}%`;

  // CSS Progress
  const cssProgress = calculateProgress("css");
  document.getElementById("cssProgress").style.width = `${cssProgress}%`;
  document.getElementById("cssXP").textContent = `${stats.css.xp} XP`;
  document.getElementById(
    "cssLessons"
  ).textContent = `${stats.css.lessons}/52 Lessons`;
  document.getElementById("cssPercent").textContent = `${Math.round(
    cssProgress
  )}%`;

  // JavaScript Progress
  const jsProgress = calculateProgress("javascript");
  document.getElementById("jsProgress").style.width = `${jsProgress}%`;
  document.getElementById("jsXP").textContent = `${stats.javascript.xp} XP`;
  document.getElementById(
    "jsLessons"
  ).textContent = `${stats.javascript.lessons}/68 Lessons`;
  document.getElementById("jsPercent").textContent = `${Math.round(
    jsProgress
  )}%`;
}

// Calculate Progress
function calculateProgress(track) {
  const progress = window.AuthManager.userProgress;
  const stats = progress.statistics[track];
  const totalLessons = { html: 45, css: 52, javascript: 68 };

  return (stats.lessons / totalLessons[track]) * 100;
}

// Load User Projects
function loadUserProjects() {
  const projects = JSON.parse(
    localStorage.getItem("codequest_projects") || "[]"
  );
  const projectsGrid = document.getElementById("userProjects");

  if (!projectsGrid) return;

  // Clear existing projects
  projectsGrid.innerHTML = "";

  // Add project cards
  projects.slice(0, 5).forEach((project) => {
    const projectCard = createProjectCard(project);
    projectsGrid.appendChild(projectCard);
  });

  // Add "Create New" card
  const addCard = document.createElement("div");
  addCard.className = "empty-project-card";
  addCard.innerHTML = `
        <a href="editor.html">
            <span class="add-icon">+</span>
            <p>Create New Project</p>
        </a>
    `;
  projectsGrid.appendChild(addCard);
}

// Create Project Card
function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "project-card";

  const date = new Date(project.timestamp);
  const daysAgo = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
  const dateText =
    daysAgo === 0
      ? "Today"
      : daysAgo === 1
      ? "Yesterday"
      : `${daysAgo} days ago`;

  card.innerHTML = `
        <div class="project-thumbnail">
            <span class="project-type">HTML/CSS/JS</span>
        </div>
        <div class="project-info">
            <h3>${project.name}</h3>
            <p>Custom web project</p>
            <div class="project-meta">
                <span>📅 ${dateText}</span>
            </div>
            <div class="project-actions">
                <button class="btn btn-secondary" onclick="editProject('${project.name}')">Edit</button>
                <button class="btn btn-primary" onclick="viewProject('${project.name}')">View</button>
            </div>
        </div>
    `;

  return card;
}