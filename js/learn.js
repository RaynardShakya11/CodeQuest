
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

// Start Lesson
function startLesson(lessonId, track) {
  // Check if user is logged in
  const user = window.AuthManager?.currentUser;
  if (!user) {
    if (window.CodeQuest && window.CodeQuest.showLogin) {
      window.CodeQuest.showLogin();
    }
    return;
  }

  // Find lesson data
  const lesson = lessonsData[track]?.find((l) => l.id === lessonId);
  if (!lesson) {
    showNotification("Lesson not found", "error");
    return;
  }

  // Check prerequisites
  if (!checkPrerequisites(lessonId, track)) {
    showNotification("Complete previous lessons first!", "warning");
    return;
  }

  // Start lesson
  openLessonModal(lesson, track);
}

// Check Prerequisites
function checkPrerequisites(lessonId, track) {
  const lessons = lessonsData[track] || [];
  const lessonIndex = lessons.findIndex((l) => l.id === lessonId);

  // Check if previous lesson is completed
  if (lessonIndex > 0) {
    const previousLesson = lessons[lessonIndex - 1];
    if (!learnState.completedLessons.includes(previousLesson.id)) {
      return false;
    }
  }

  return true;
}

// Open Lesson Modal
function openLessonModal(lesson, track) {
  // Create lesson modal
  const modal = document.createElement("div");
  modal.className = "lesson-modal";
  modal.innerHTML = `
        <div class="lesson-modal-content">
            <button class="close-lesson" onclick="closeLessonModal()">&times;</button>
            <div class="lesson-header">
                <h2>${lesson.title}</h2>
                <div class="lesson-meta">
                    <span>⏱️ ${lesson.duration} min</span>
                    <span>🏆 ${lesson.xp} XP</span>
                    <span class="difficulty ${lesson.difficulty}">${lesson.difficulty}</span>
                </div>
            </div>
            <div class="lesson-body">
                <div class="lesson-content" id="lessonContent">
                    <!-- Lesson content would be loaded here -->
                    <p>Loading lesson content...</p>
                </div>
                <div class="lesson-actions">
                    <button class="btn btn-secondary" onclick="previousLesson()">Previous</button>
                    <button class="btn btn-primary" onclick="completeLesson('${lesson.id}', '${track}', ${lesson.xp})">Complete Lesson</button>
                    <button class="btn btn-secondary" onclick="nextLesson()">Next</button>
                </div>
            </div>
            <div class="lesson-progress-bar">
                <div class="lesson-progress-fill" id="lessonProgress" style="width: 0%"></div>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  // Load lesson content
  loadLessonContent(lesson.id);

  // Show modal
  setTimeout(() => {
    modal.classList.add("show");
  }, 100);
}

// Load Lesson Content
function loadLessonContent(lessonId) {
  // In a real app, this would fetch lesson content from backend
  const content = getLessonContent(lessonId);

  const contentElement = document.getElementById("lessonContent");
  if (contentElement) {
    contentElement.innerHTML = content;

    // Add syntax highlighting if code examples
    highlightCode();
  }
}

// Get Lesson Content (Mock)
function getLessonContent(lessonId) {
  // Mock lesson content
  const content = {
    "html-1": `
            <h3>Welcome to HTML!</h3>
            <p>HTML (HyperText Markup Language) is the standard markup language for creating web pages.</p>
            <h4>What is HTML?</h4>
            <ul>
                <li>HTML stands for Hyper Text Markup Language</li>
                <li>HTML is the standard markup language for creating Web pages</li>
                <li>HTML describes the structure of a Web page</li>
                <li>HTML consists of a series of elements</li>
            </ul>
            <h4>Basic Structure</h4>
            <pre><code class="language-html">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;Page Title&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;This is a Heading&lt;/h1&gt;
    &lt;p&gt;This is a paragraph.&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
            <h4>Try It Yourself</h4>
            <p>Click the "Complete Lesson" button when you're ready to move on!</p>
        `,
  };

  return content[lessonId] || "<p>Lesson content coming soon!</p>";
}
// Complete Lesson
function completeLesson(lessonId, track, xp) {
  // Mark lesson as completed
  if (!learnState.completedLessons.includes(lessonId)) {
    learnState.completedLessons.push(lessonId);

    // Save to localStorage
    localStorage.setItem(
      "codequest_completed_lessons",
      JSON.stringify(learnState.completedLessons)
    );

    // Update progress
    learnState.progress[track].completed++;
    updateProgressDisplay();

    // Add XP if user is logged in
    if (window.AuthManager && window.AuthManager.currentUser) {
      window.AuthManager.completeLesson(lessonId, xp);
    }

    // Show completion message
    showLessonComplete(xp);
  }

  // Close modal
  closeLessonModal();
}

// Show Lesson Complete
function showLessonComplete(xp) {
  showNotification(`🎉 Lesson completed! +${xp} XP earned`, "success");
}

// Close Lesson Modal
function closeLessonModal() {
  const modal = document.querySelector(".lesson-modal");
  if (modal) {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

// Navigation Functions
function previousLesson() {
  // Navigate to previous lesson
  // Implementation depends on current lesson tracking
}

function nextLesson() {
  // Navigate to next lesson
  // Implementation depends on current lesson tracking
}

// Highlight Code
function highlightCode() {
  // Add syntax highlighting to code blocks
  const codeBlocks = document.querySelectorAll("pre code");
  codeBlocks.forEach((block) => {
    // Simple syntax highlighting (in real app, use library like Prism.js)
    let html = block.innerHTML;

    // Highlight HTML tags
    html = html.replace(
      /&lt;([^&]+)&gt;/g,
      '&lt;<span class="tag">$1</span>&gt;'
    );

    // Highlight attributes
    html = html.replace(/(\w+)=/g, '<span class="attribute">$1</span>=');

    // Highlight strings
    html = html.replace(/"([^"]*)"/g, '"<span class="string">$1</span>"');

    block.innerHTML = html;
  });
}

// Show Notification
function showNotification(message, type = "info") {
  if (window.CodeQuest && window.CodeQuest.showNotification) {
    window.CodeQuest.showNotification(message, type);
  }
}

// Start Project
function startProject(projectType) {
  // Check if user is logged in
  const user = window.AuthManager?.currentUser;
  if (!user) {
    if (window.CodeQuest && window.CodeQuest.showLogin) {
      window.CodeQuest.showLogin();
    }
    return;
  }

  // Redirect to editor with project template
  const projectTemplates = {
    portfolio: {
      name: "Portfolio Website",
      html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>My Portfolio</title>\n</head>\n<body>\n    <header>\n        <h1>Welcome to My Portfolio</h1>\n        <nav>\n            <a href="#about">About</a>\n            <a href="#projects">Projects</a>\n            <a href="#contact">Contact</a>\n        </nav>\n    </header>\n    \n    <main>\n        <section id="about">\n            <h2>About Me</h2>\n            <p>I am a passionate web developer...</p>\n        </section>\n        \n        <section id="projects">\n            <h2>My Projects</h2>\n            <div class="project-grid">\n                <!-- Add your projects here -->\n            </div>\n        </section>\n        \n        <section id="contact">\n            <h2>Contact Me</h2>\n            <p>Get in touch at: your.email@example.com</p>\n        </section>\n    </main>\n    \n    <footer>\n        <p>&copy; 2025 My Portfolio. All rights reserved.</p>\n    </footer>\n</body>\n</html>',
      css: '* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nbody {\n    font-family: Arial, sans-serif;\n    line-height: 1.6;\n    color: #333;\n}\n\nheader {\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: white;\n    text-align: center;\n    padding: 2rem;\n}\n\nnav {\n    margin-top: 1rem;\n}\n\nnav a {\n    color: white;\n    text-decoration: none;\n    margin: 0 1rem;\n    padding: 0.5rem 1rem;\n    border-radius: 5px;\n    transition: background 0.3s;\n}\n\nnav a:hover {\n    background: rgba(255, 255, 255, 0.2);\n}\n\nmain {\n    max-width: 1200px;\n    margin: 0 auto;\n    padding: 2rem;\n}\n\nsection {\n    margin-bottom: 3rem;\n}\n\nh2 {\n    color: #667eea;\n    margin-bottom: 1rem;\n}\n\n.project-grid {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n    gap: 2rem;\n    margin-top: 1rem;\n}\n\nfooter {\n    background: #333;\n    color: white;\n    text-align: center;\n    padding: 1rem;\n    margin-top: 2rem;\n}',
      js: '// Portfolio JavaScript\nconsole.log("Portfolio loaded!");\n\n// Add smooth scrolling for navigation\ndocument.querySelectorAll("nav a").forEach(link => {\n    link.addEventListener("click", function(e) {\n        e.preventDefault();\n        const targetId = this.getAttribute("href");\n        const targetSection = document.querySelector(targetId);\n        if (targetSection) {\n            targetSection.scrollIntoView({ behavior: "smooth" });\n        }\n    });\n});\n\n// Add some interactivity\nwindow.addEventListener("scroll", () => {\n    const header = document.querySelector("header");\n    if (window.scrollY > 100) {\n        header.style.background = "rgba(102, 126, 234, 0.9)";\n    } else {\n        header.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";\n    }\n});'
    },
    ecommerce: {
      name: "E-Commerce Landing",
      html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Product Landing Page</title>\n</head>\n<body>\n    <header>\n        <nav>\n            <div class="logo">Brand</div>\n            <ul class="nav-links">\n                <li><a href="#home">Home</a></li>\n                <li><a href="#features">Features</a></li>\n                <li><a href="#pricing">Pricing</a></li>\n            </ul>\n        </nav>\n    </header>\n    \n    <main>\n        <section id="home" class="hero">\n            <h1>Amazing Product</h1>\n            <p>The best solution for your needs</p>\n            <button class="cta-button">Get Started</button>\n        </section>\n        \n        <section id="features">\n            <h2>Features</h2>\n            <div class="features-grid">\n                <div class="feature">\n                    <h3>Feature 1</h3>\n                    <p>Description of feature 1</p>\n                </div>\n                <div class="feature">\n                    <h3>Feature 2</h3>\n                    <p>Description of feature 2</p>\n                </div>\n            </div>\n        </section>\n        \n        <section id="pricing">\n            <h2>Pricing</h2>\n            <div class="pricing-grid">\n                <div class="price-card">\n                    <h3>Basic</h3>\n                    <p class="price">$9.99</p>\n                    <button>Choose Plan</button>\n                </div>\n            </div>\n        </section>\n    </main>\n</body>\n</html>',
      css: '* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nbody {\n    font-family: Arial, sans-serif;\n    line-height: 1.6;\n}\n\nheader {\n    background: #333;\n    color: white;\n    padding: 1rem;\n}\n\nnav {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    max-width: 1200px;\n    margin: 0 auto;\n}\n\n.nav-links {\n    display: flex;\n    list-style: none;\n    gap: 2rem;\n}\n\n.nav-links a {\n    color: white;\n    text-decoration: none;\n}\n\n.hero {\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: white;\n    text-align: center;\n    padding: 4rem 2rem;\n}\n\n.hero h1 {\n    font-size: 3rem;\n    margin-bottom: 1rem;\n}\n\n.cta-button {\n    background: #f39c12;\n    color: white;\n    border: none;\n    padding: 1rem 2rem;\n    font-size: 1.2rem;\n    border-radius: 5px;\n    cursor: pointer;\n    margin-top: 2rem;\n}\n\n.features-grid, .pricing-grid {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n    gap: 2rem;\n    max-width: 1200px;\n    margin: 0 auto;\n    padding: 2rem;\n}\n\n.feature, .price-card {\n    text-align: center;\n    padding: 2rem;\n    border: 1px solid #ddd;\n    border-radius: 10px;\n}\n\n.price {\n    font-size: 2rem;\n    color: #667eea;\n    margin: 1rem 0;\n}',
      js: '// E-Commerce JavaScript\nconsole.log("E-Commerce landing page loaded!");\n\n// Smooth scrolling for navigation\ndocument.querySelectorAll("nav a").forEach(link => {\n    link.addEventListener("click", function(e) {\n        e.preventDefault();\n        const targetId = this.getAttribute("href");\n        const targetSection = document.querySelector(targetId);\n        if (targetSection) {\n            targetSection.scrollIntoView({ behavior: "smooth" });\n        }\n    });\n});\n\n// CTA button functionality\nconst ctaButton = document.querySelector(".cta-button");\nif (ctaButton) {\n    ctaButton.addEventListener("click", () => {\n        alert("Thank you for your interest! This would open a signup form.");\n    });\n}\n\n// Pricing card interactions\ndocument.querySelectorAll(".price-card button").forEach(button => {\n    button.addEventListener("click", function() {\n        const plan = this.parentElement.querySelector("h3").textContent;\n        alert(`You selected the ${plan} plan!`);\n    });\n});'
    },
    weather: {
      name: "Weather App",
      html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Weather App</title>\n</head>\n<body>\n    <div class="container">\n        <h1>Weather App</h1>\n        <div class="search-box">\n            <input type="text" id="cityInput" placeholder="Enter city name">\n            <button id="searchBtn">Search</button>\n        </div>\n        \n        <div class="weather-display" id="weatherDisplay">\n            <div class="weather-card">\n                <h2 id="cityName">City Name</h2>\n                <div class="temperature">\n                    <span id="temp">--</span>°C\n                </div>\n                <div class="weather-info">\n                    <p id="description">Weather description</p>\n                    <p>Humidity: <span id="humidity">--</span>%</p>\n                    <p>Wind: <span id="wind">--</span> km/h</p>\n                </div>\n            </div>\n        </div>\n    </div>\n</body>\n</html>',
      css: '* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nbody {\n    font-family: Arial, sans-serif;\n    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);\n    min-height: 100vh;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n\n.container {\n    background: white;\n    padding: 2rem;\n    border-radius: 20px;\n    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);\n    text-align: center;\n    min-width: 300px;\n}\n\nh1 {\n    color: #2d3436;\n    margin-bottom: 2rem;\n}\n\n.search-box {\n    display: flex;\n    gap: 1rem;\n    margin-bottom: 2rem;\n}\n\n#cityInput {\n    flex: 1;\n    padding: 0.75rem;\n    border: 2px solid #ddd;\n    border-radius: 8px;\n    font-size: 1rem;\n}\n\n#searchBtn {\n    background: #0984e3;\n    color: white;\n    border: none;\n    padding: 0.75rem 1.5rem;\n    border-radius: 8px;\n    cursor: pointer;\n    font-size: 1rem;\n}\n\n.weather-card {\n    background: #f8f9fa;\n    padding: 2rem;\n    border-radius: 15px;\n    border: 1px solid #e9ecef;\n}\n\n.temperature {\n    font-size: 3rem;\n    font-weight: bold;\n    color: #2d3436;\n    margin: 1rem 0;\n}\n\n.weather-info p {\n    margin: 0.5rem 0;\n    color: #636e72;\n}',
      js: '// Weather App JavaScript\nconsole.log("Weather app loaded!");\n\n// Mock weather data (in real app, this would come from an API)\nconst mockWeatherData = {\n    "London": { temp: 18, description: "Partly Cloudy", humidity: 65, wind: 12 },\n    "New York": { temp: 22, description: "Sunny", humidity: 45, wind: 8 },\n    "Tokyo": { temp: 25, description: "Clear", humidity: 70, wind: 5 },\n    "Sydney": { temp: 28, description: "Sunny", humidity: 55, wind: 15 }\n};\n\n// Get DOM elements\nconst cityInput = document.getElementById("cityInput");\nconst searchBtn = document.getElementById("searchBtn");\nconst cityName = document.getElementById("cityName");\nconst temp = document.getElementById("temp");\nconst description = document.getElementById("description");\nconst humidity = document.getElementById("humidity");\nconst wind = document.getElementById("wind");\n\n// Search functionality\nsearchBtn.addEventListener("click", searchWeather);\ncityInput.addEventListener("keypress", function(e) {\n    if (e.key === "Enter") {\n        searchWeather();\n    }\n});\n\nfunction searchWeather() {\n    const city = cityInput.value.trim();\n    if (!city) return;\n    \n    // Check if we have mock data for this city\n    if (mockWeatherData[city]) {\n        displayWeather(city, mockWeatherData[city]);\n    } else {\n        // Simulate API call for unknown cities\n        const randomTemp = Math.floor(Math.random() * 30) + 5;\n        const randomHumidity = Math.floor(Math.random() * 40) + 30;\n        const randomWind = Math.floor(Math.random() * 20) + 5;\n        \n        const weatherData = {\n            temp: randomTemp,\n            description: "Partly Cloudy",\n            humidity: randomHumidity,\n            wind: randomWind\n        };\n        \n        displayWeather(city, weatherData);\n    }\n}\n\nfunction displayWeather(city, data) {\n    cityName.textContent = city;\n    temp.textContent = data.temp;\n    description.textContent = data.description;\n    humidity.textContent = data.humidity;\n    wind.textContent = data.wind;\n    \n    // Add some animation\n    document.querySelector(".weather-card").style.transform = "scale(1.05)";\n    setTimeout(() => {\n        document.querySelector(".weather-card").style.transform = "scale(1)";\n    }, 200);\n}'
    },
    game: {
      name: "JavaScript Game",
      html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Simple Game</title>\n</head>\n<body>\n    <div class="game-container">\n        <h1>Color Clicker Game</h1>\n        <div class="game-info">\n            <span>Score: <span id="score">0</span></span>\n            <span>Time: <span id="time">30</span>s</span>\n        </div>\n        \n        <div class="game-area" id="gameArea">\n            <!-- Game elements will be generated here -->\n        </div>\n        \n        <button id="startBtn" class="start-button">Start Game</button>\n        <button id="resetBtn" class="reset-button">Reset</button>\n    </div>\n</body>\n</html>',
      css: '* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nbody {\n    font-family: Arial, sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    min-height: 100vh;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n\n.game-container {\n    background: white;\n    padding: 2rem;\n    border-radius: 20px;\n    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);\n    text-align: center;\n    min-width: 400px;\n}\n\nh1 {\n    color: #2d3436;\n    margin-bottom: 1rem;\n}\n\n.game-info {\n    display: flex;\n    justify-content: space-around;\n    margin-bottom: 2rem;\n    font-size: 1.2rem;\n    font-weight: bold;\n}\n\n.game-area {\n    height: 300px;\n    border: 2px solid #ddd;\n    border-radius: 10px;\n    margin-bottom: 2rem;\n    position: relative;\n    overflow: hidden;\n}\n\n.start-button, .reset-button {\n    background: #0984e3;\n    color: white;\n    border: none;\n    padding: 1rem 2rem;\n    border-radius: 8px;\n    cursor: pointer;\n    font-size: 1rem;\n    margin: 0 0.5rem;\n}\n\n.reset-button {\n    background: #e74c3c;\n}\n\n.target {\n    position: absolute;\n    width: 50px;\n    height: 50px;\n    border-radius: 50%;\n    cursor: pointer;\n    transition: all 0.3s ease;\n}\n\n.target:hover {\n    transform: scale(1.1);\n}',
      js: '// Simple Game JavaScript\nconsole.log("Game loaded!");\n\nlet score = 0;\nlet timeLeft = 30;\nlet gameInterval;\nlet targetInterval;\nlet isPlaying = false;\n\n// Get DOM elements\nconst scoreElement = document.getElementById("score");\nconst timeElement = document.getElementById("time");\nconst gameArea = document.getElementById("gameArea");\nconst startBtn = document.getElementById("startBtn");\nconst resetBtn = document.getElementById("resetBtn");\n\n// Event listeners\nstartBtn.addEventListener("click", startGame);\nresetBtn.addEventListener("click", resetGame);\n\nfunction startGame() {\n    if (isPlaying) return;\n    \n    isPlaying = true;\n    startBtn.disabled = true;\n    score = 0;\n    timeLeft = 30;\n    \n    updateDisplay();\n    \n    // Start timer\n    gameInterval = setInterval(() => {\n        timeLeft--;\n        updateDisplay();\n        \n        if (timeLeft <= 0) {\n            endGame();\n        }\n    }, 1000);\n    \n    // Start spawning targets\n    spawnTarget();\n    targetInterval = setInterval(spawnTarget, 2000);\n}\n\nfunction spawnTarget() {\n    if (!isPlaying) return;\n    \n    const target = document.createElement("div");\n    target.className = "target";\n    \n    // Random position\n    const x = Math.random() * (gameArea.offsetWidth - 50);\n    const y = Math.random() * (gameArea.offsetHeight - 50);\n    \n    target.style.left = x + "px";\n    target.style.top = y + "px";\n    \n    // Random color\n    const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6"];\n    target.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];\n    \n    // Click event\n    target.addEventListener("click", () => {\n        score += 10;\n        updateDisplay();\n        target.remove();\n    });\n    \n    gameArea.appendChild(target);\n    \n    // Remove target after 3 seconds if not clicked\n    setTimeout(() => {\n        if (target.parentNode) {\n            target.remove();\n        }\n    }, 3000);\n}\n\nfunction updateDisplay() {\n    scoreElement.textContent = score;\n    timeElement.textContent = timeLeft;\n}\n\nfunction endGame() {\n    isPlaying = false;\n    clearInterval(gameInterval);\n    clearInterval(targetInterval);\n    startBtn.disabled = false;\n    \n    // Clear all targets\n    const targets = document.querySelectorAll(".target");\n    targets.forEach(target => target.remove());\n    \n    alert(`Game Over! Final Score: ${score}`);\n}\n\nfunction resetGame() {\n    endGame();\n    score = 0;\n    timeLeft = 30;\n    updateDisplay();\n}'
    }
  };

  const template = projectTemplates[projectType];
  if (!template) {
    showNotification("Project template not found", "error");
    return;
  }

  // Save project template to localStorage
  const project = {
    name: template.name,
    html: template.html,
    css: template.css,
    js: template.js,
    timestamp: new Date().toISOString()
  };

  localStorage.setItem("codequest_current_project", JSON.stringify(project));
  
  // Redirect to editor
  window.location.href = "editor.html";
}

// Export functions for global use
window.learnFunctions = {
  startLesson,
  completeLesson,
  showTrack,
  filterCourses,
  startProject,
};

// Add styles for lesson modal
const style = document.createElement("style");
style.textContent = `
    .lesson-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lesson-modal.show {
        opacity: 1;
    }
    
    .lesson-modal-content {
        background: var(--darker);
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 20px;
        width: 90%;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    }
    
    .close-lesson {
        position: absolute;
        right: 1rem;
        top: 1rem;
        background: none;
        border: none;
        color: rgba(248, 250, 252, 0.7);
        font-size: 2rem;
        cursor: pointer;
    }
    
    .lesson-header {
        padding: 2rem;
        border-bottom: 1px solid rgba(99, 102, 241, 0.2);
    }
    
    .lesson-body {
        padding: 2rem;
    }
    
    .lesson-content {
        margin-bottom: 2rem;
    }
    
    .lesson-content pre {
        background: rgba(15, 23, 42, 0.8);
        padding: 1rem;
        border-radius: 8px;
        overflow-x: auto;
    }
    
    .lesson-content code {
        font-family: 'Monaco', 'Courier New', monospace;
    }
    
    .lesson-actions {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .lesson-progress-bar {
        height: 4px;
        background: rgba(99, 102, 241, 0.2);
    }
    
    .lesson-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary), var(--accent));
        transition: width 0.3s;
    }
    
    .tag { color: #f472b6; }
    .attribute { color: #60a5fa; }
    .string { color: #a78bfa; }
`;
document.head.appendChild(style);