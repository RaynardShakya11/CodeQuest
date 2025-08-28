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
// Load Recent Activity
function loadRecentActivity() {
  const timeline = document.getElementById("activityTimeline");
  if (!timeline) return;

  const activities = getRecentActivities();

  timeline.innerHTML = activities
    .map(
      (activity) => `
        <div class="activity-item">
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        </div>
    `
    )
    .join("");
}

// Get Recent Activities
function getRecentActivities() {
  const activities = [];
  const progress = window.AuthManager.userProgress;

  // Add completed lessons
  progress.completedLessons.slice(-3).forEach((lessonId) => {
    activities.push({
      icon: "📚",
      title: `Completed Lesson #${lessonId}`,
      description: "Earned XP and made progress",
      time: "Recently",
    });
  });

  // Add completed challenges
  progress.completedChallenges.slice(-2).forEach((challengeId) => {
    activities.push({
      icon: "🎯",
      title: `Solved Challenge`,
      description: "Successfully completed a coding challenge",
      time: "Recently",
    });
  });

  // Add achievements
  progress.achievements.slice(-2).forEach((achievement) => {
    activities.push({
      icon: "🏆",
      title: `Earned Achievement`,
      description: getAchievementName(achievement),
      time: "Recently",
    });
  });

  // Add default activity if empty
  if (activities.length === 0) {
    activities.push({
      icon: "👋",
      title: "Welcome to CodeQuest!",
      description: "Start your learning journey today",
      time: "Just now",
    });
  }

  return activities;
}

// Load Achievements
function loadAchievements() {
  const grid = document.getElementById("achievementsGrid");
  if (!grid) return;

  const achievements = [
    {
      id: "first-steps",
      icon: "🎯",
      title: "First Steps",
      description: "Complete your first lesson",
      requirement: 1,
      type: "lessons",
    },
    {
      id: "knowledge-seeker",
      icon: "📚",
      title: "Knowledge Seeker",
      description: "Complete 10 lessons",
      requirement: 10,
      type: "lessons",
    },
    {
      id: "on-fire",
      icon: "🔥",
      title: "On Fire",
      description: "Maintain a 7-day streak",
      requirement: 7,
      type: "streak",
    },
    {
      id: "challenge-master",
      icon: "🏆",
      title: "Challenge Master",
      description: "Complete 25 challenges",
      requirement: 25,
      type: "challenges",
    },
    {
      id: "code-warrior",
      icon: "⭐",
      title: "Code Warrior",
      description: "Reach Level 10",
      requirement: 10,
      type: "level",
    },
    {
      id: "expert-developer",
      icon: "💎",
      title: "Expert Developer",
      description: "Complete all courses",
      requirement: 100,
      type: "completion",
    },
  ];

  const progress = window.AuthManager.userProgress;

  grid.innerHTML = achievements
    .map((achievement) => {
      const isEarned = progress.achievements.includes(achievement.id);
      const currentProgress = getAchievementProgress(achievement, progress);
      const percentage = (currentProgress / achievement.requirement) * 100;

      return `
            <div class="achievement-card ${isEarned ? "earned" : ""} ${
        percentage === 0 ? "locked" : ""
      }">
                <div class="achievement-icon">${achievement.icon}</div>
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
                <div class="achievement-progress">
                    ${
                      isEarned
                        ? "✅ Earned"
                        : percentage === 0
                        ? "🔒 Locked"
                        : `
                        <div class="mini-progress">
                            <div class="mini-progress-fill" style="width: ${percentage}%"></div>
                        </div>
                        <span>${currentProgress}/${achievement.requirement}</span>
                    `
                    }
                </div>
            </div>
        `;
    })
    .join("");
}

// Get Achievement Progress
function getAchievementProgress(achievement, progress) {
  switch (achievement.type) {
    case "lessons":
      return progress.completedLessons.length;
    case "challenges":
      return progress.completedChallenges.length;
    case "streak":
      return progress.streak;
    case "level":
      return progress.level;
    case "completion":
      const totalLessons = 45 + 52 + 68; // HTML + CSS + JS
      return Math.round(
        (progress.completedLessons.length / totalLessons) * 100
      );
    default:
      return 0;
  }
}

// Get Achievement Name
function getAchievementName(achievementId) {
  const names = {
    "first-steps": "First Steps - Completed first lesson",
    "dedicated-learner": "Dedicated Learner - 10 lessons completed",
    challenger: "Challenger - First challenge solved",
    "week-warrior": "Week Warrior - 7-day streak achieved",
  };

  return names[achievementId] || "New Achievement";
}

// Load Study Plan
function loadStudyPlan() {
  const tasks = document.querySelectorAll('.study-task input[type="checkbox"]');

  // Load saved task states
  const savedTasks = JSON.parse(
    localStorage.getItem("codequest_daily_tasks") || "{}"
  );
  const today = new Date().toDateString();

  if (savedTasks.date === today) {
    tasks.forEach((task, index) => {
      task.checked = savedTasks.tasks?.[index] || false;
    });
  } else {
    // New day, reset tasks
    localStorage.setItem(
      "codequest_daily_tasks",
      JSON.stringify({
        date: today,
        tasks: {},
      })
    );
  }

  // Add event listeners
  tasks.forEach((task, index) => {
    task.addEventListener("change", function () {
      handleTaskComplete(this, index);
    });
  });
}