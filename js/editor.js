// Editor JavaScript Functionality

// Editor State
const editorState = {
  currentFile: "index.html",
  currentTab: "html",
  files: {
    "index.html": { content: "", language: "html" },
    "styles.css": { content: "", language: "css" },
    "script.js": { content: "", language: "javascript" },
  },
  settings: {
    theme: "dark",
    fontSize: 14,
    tabSize: 4,
    wordWrap: false,
    lineNumbers: true,
    autoSave: false,
  },
  history: {
    html: [],
    css: [],
    js: [],
  },
  historyIndex: {
    html: -1,
    css: -1,
    js: -1,
  },
};

// Initialize Editor
document.addEventListener("DOMContentLoaded", function () {
  initializeEditor();
  setupEditorEventListeners();
  updateLineNumbers();
  runCode(); // Initial preview

  // Auto-save interval
  setInterval(() => {
    if (editorState.settings.autoSave) {
      saveProject();
    }
  }, 30000); // Every 30 seconds
});

// Initialize Editor
function initializeEditor() {
  // Check if we're in challenge mode
  const urlParams = new URLSearchParams(window.location.search);
  const challengeId = urlParams.get('challenge');
  
  if (challengeId) {
    // Load challenge data
    const challengeData = sessionStorage.getItem("current_challenge");
    if (challengeData) {
      const challenge = JSON.parse(challengeData);
      initializeChallengeMode(challenge);
    }
  } else {
    // Load saved content if exists
    const savedProject = localStorage.getItem("codequest_current_project");
    if (savedProject) {
      const project = JSON.parse(savedProject);
      document.getElementById("htmlCode").value = project.html || "";
      document.getElementById("cssCode").value = project.css || "";
      document.getElementById("jsCode").value = project.js || "";
    }
  }

  // Initialize line numbers
  updateAllLineNumbers();

  // Set up keyboard shortcuts
  setupKeyboardShortcuts();

  // Initialize console
  initializeConsole();
}
