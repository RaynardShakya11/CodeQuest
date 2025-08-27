
// Learn State
const learnState = {
  currentTrack: "all",
  currentModule: null,
  completedLessons: [],
  progress: {
    html: { completed: 0, total: 45 },
    css: { completed: 0, total: 52 },
    javascript: { completed: 0, total: 68 },
  },
};
// Lesson Data (expanded)
const lessonsData = {
  html: [
    // Module 1: Getting Started
    {
      id: "html-1",
      module: 1,
      title: "Introduction to HTML",
      duration: 15,
      xp: 10,
      difficulty: "beginner",
    },
    {
      id: "html-2",
      module: 1,
      title: "Your First HTML Page",
      duration: 20,
      xp: 15,
      difficulty: "beginner",
    },
    {
      id: "html-3",
      module: 1,
      title: "HTML Tags & Elements",
      duration: 25,
      xp: 15,
      difficulty: "beginner",
    },
    {
      id: "html-4",
      module: 1,
      title: "HTML Attributes",
      duration: 20,
      xp: 20,
      difficulty: "beginner",
    },
    {
      id: "html-5",
      module: 1,
      title: "Document Structure",
      duration: 25,
      xp: 20,
      difficulty: "beginner",
    },
    // Module 2: Text Content
    {
      id: "html-6",
      module: 2,
      title: "Headings & Paragraphs",
      duration: 20,
      xp: 15,
      difficulty: "beginner",
    },
    {
      id: "html-7",
      module: 2,
      title: "Text Formatting",
      duration: 15,
      xp: 15,
      difficulty: "beginner",
    },
    {
      id: "html-8",
      module: 2,
      title: "Quotes & Citations",
      duration: 20,
      xp: 20,
      difficulty: "beginner",
    },
    {
      id: "html-9",
      module: 2,
      title: "Line Breaks & Horizontal Rules",
      duration: 10,
      xp: 10,
      difficulty: "beginner",
    },
    // Module 3: Lists & Links
    {
      id: "html-10",
      module: 3,
      title: "Ordered Lists",
      duration: 15,
      xp: 15,
      difficulty: "beginner",
    },
    {
      id: "html-11",
      module: 3,
      title: "Unordered Lists",
      duration: 15,
      xp: 15,
      difficulty: "beginner",
    },
    {
      id: "html-12",
      module: 3,
      title: "Description Lists",
      duration: 20,
      xp: 20,
      difficulty: "intermediate",
    },
    {
      id: "html-13",
      module: 3,
      title: "Hyperlinks Basics",
      duration: 25,
      xp: 20,
      difficulty: "beginner",
    },
    {
      id: "html-14",
      module: 3,
      title: "Internal & External Links",
      duration: 30,
      xp: 25,
      difficulty: "intermediate",
    },
    // More lessons...
  ],
  css: [
    // Module 1: CSS Fundamentals
    {
      id: "css-1",
      module: 1,
      title: "Introduction to CSS",
      duration: 15,
      xp: 10,
      difficulty: "beginner",
    },
    {
      id: "css-2",
      module: 1,
      title: "CSS Syntax",
      duration: 20,
      xp: 15,
      difficulty: "beginner",
    },
    {
      id: "css-3",
      module: 1,
      title: "Selectors",
      duration: 25,
      xp: 20,
      difficulty: "beginner",
    },
    {
      id: "css-4",
      module: 1,
      title: "Colors & Backgrounds",
      duration: 30,
      xp: 25,
      difficulty: "beginner",
    },
    // Module 2: Typography
    {
      id: "css-5",
      module: 2,
      title: "Font Properties",
      duration: 25,
      xp: 20,
      difficulty: "beginner",
    },
    {
      id: "css-6",
      module: 2,
      title: "Text Properties",
      duration: 20,
      xp: 20,
      difficulty: "beginner",
    },
    {
      id: "css-7",
      module: 2,
      title: "Web Fonts",
      duration: 30,
      xp: 25,
      difficulty: "intermediate",
    },
    // More lessons...
  ],
  javascript: [
    // Module 1: JavaScript Basics
    {
      id: "js-1",
      module: 1,
      title: "Introduction to JavaScript",
      duration: 20,
      xp: 15,
      difficulty: "beginner",
    },
    {
      id: "js-2",
      module: 1,
      title: "Variables & Constants",
      duration: 25,
      xp: 20,
      difficulty: "beginner",
    },
    {
      id: "js-3",
      module: 1,
      title: "Data Types",
      duration: 30,
      xp: 25,
      difficulty: "beginner",
    },
    {
      id: "js-4",
      module: 1,
      title: "Operators",
      duration: 25,
      xp: 20,
      difficulty: "beginner",
    },
    // Module 2: Control Flow
    {
      id: "js-5",
      module: 2,
      title: "If Statements",
      duration: 30,
      xp: 25,
      difficulty: "beginner",
    },
    {
      id: "js-6",
      module: 2,
      title: "Switch Statements",
      duration: 25,
      xp: 20,
      difficulty: "intermediate",
    },
    {
      id: "js-7",
      module: 2,
      title: "Loops",
      duration: 35,
      xp: 30,
      difficulty: "intermediate",
    },
    // More lessons...
  ],
};
// Initialize Learn Page
document.addEventListener("DOMContentLoaded", function () {
  initializeLearnPage();
  loadProgress();
  setupTrackSelector();
  updateProgressDisplay();
});

// Initialize Learn Page
function initializeLearnPage() {
  // Load completed lessons from localStorage
  const saved = localStorage.getItem("codequest_completed_lessons");
  if (saved) {
    learnState.completedLessons = JSON.parse(saved);
  }

  // Check URL hash for specific track
  const hash = window.location.hash.substring(1);
  if (hash && ["html", "css", "javascript"].includes(hash)) {
    learnState.currentTrack = hash;
    showTrack(hash);
  }
}
// Setup Track Selector
function setupTrackSelector() {
  const trackButtons = document.querySelectorAll(".track-btn");

  trackButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      trackButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      const track = this.dataset.track;
      learnState.currentTrack = track;
      filterCourses(track);
    });
  });
}
// Filter Courses
function filterCourses(track) {
  const sections = document.querySelectorAll(".course-section");

  sections.forEach((section) => {
    if (track === "all") {
      section.style.display = "block";
    } else {
      const sectionId = section.id;
      if (sectionId.includes(track)) {
        section.style.display = "block";
      } else {
        section.style.display = "none";
      }
    }
  });
}

// Show Specific Track
function showTrack(track) {
  // Update track selector
  const trackButtons = document.querySelectorAll(".track-btn");
  trackButtons.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.track === track) {
      btn.classList.add("active");
    }
  });

  // Filter courses
  filterCourses(track);

  // Scroll to course section
  const targetSection = document.getElementById(`${track}-course`);
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: "smooth" });
  }
}

// Load Progress
function loadProgress() {
  // Calculate progress for each track
  ["html", "css", "javascript"].forEach((track) => {
    const lessons = lessonsData[track] || [];
    const completed = lessons.filter((lesson) =>
      learnState.completedLessons.includes(lesson.id)
    ).length;

    learnState.progress[track].completed = completed;
  });
}

// Update Progress Display
function updateProgressDisplay() {
  // Update progress bars and stats for each track
  Object.keys(learnState.progress).forEach((track) => {
    const progress = learnState.progress[track];
    const percentage = (progress.completed / progress.total) * 100;

    // Update progress bar if exists
    const progressBar = document.querySelector(`.${track}-progress`);
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }

    // Update text displays
    const progressText = document.querySelector(`#${track}Percent`);
    if (progressText) {
      progressText.textContent = `${Math.round(percentage)}%`;
    }
  });
}
