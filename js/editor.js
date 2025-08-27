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
// Setup Event Listeners
function setupEditorEventListeners() {
  // Code input listeners
  ["htmlCode", "cssCode", "jsCode"].forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("input", () => {
        updateLineNumbers(id);
        saveToHistory(id);
      });

      element.addEventListener("scroll", () => {
        syncLineNumberScroll(id);
      });

      element.addEventListener("keydown", handleTabKey);
    }
  });
}

// Tab Key Handler
function handleTabKey(e) {
  if (e.key === "Tab") {
    e.preventDefault();
    const start = this.selectionStart;
    const end = this.selectionEnd;
    const spaces = " ".repeat(editorState.settings.tabSize);

    this.value =
      this.value.substring(0, start) + spaces + this.value.substring(end);
    this.selectionStart = this.selectionEnd =
      start + editorState.settings.tabSize;
  }
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
  document.addEventListener("keydown", function (e) {
    // Ctrl/Cmd + S - Save
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      saveProject();
    }

    // Ctrl/Cmd + Enter - Run Code
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runCode();
    }

    // Ctrl/Cmd + / - Toggle Comment
    if ((e.ctrlKey || e.metaKey) && e.key === "/") {
      e.preventDefault();
      toggleComment();
    }

    // Ctrl/Cmd + D - Duplicate Line
    if ((e.ctrlKey || e.metaKey) && e.key === "d") {
      e.preventDefault();
      duplicateLine();
    }

    // Alt + Shift + F - Format Code
    if (e.altKey && e.shiftKey && e.key === "F") {
      e.preventDefault();
      formatCode();
    }

    // Ctrl/Cmd + Z - Undo
    if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      undoAction();
    }

    // Ctrl/Cmd + Shift + Z - Redo
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z") {
      e.preventDefault();
      redoAction();
    }

    // F11 - Fullscreen
    if (e.key === "F11") {
      e.preventDefault();
      toggleFullscreen();
    }
  });
}