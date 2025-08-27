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
// Run Code
function runCode() {
  try {
    const html = document.getElementById("htmlCode").value;
    const css = document.getElementById("cssCode").value;
    const js = document.getElementById("jsCode").value;

    const preview = document.getElementById("preview");

    // Create the combined HTML
    const combinedCode = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    ${css}
                </style>
            </head>
            <body>
                ${html}
                <script>
                    // Capture console output
                    const originalLog = console.log;
                    const originalError = console.error;
                    const originalWarn = console.warn;
                    
                    console.log = function(...args) {
                        parent.postMessage({
                            type: 'console',
                            level: 'log',
                            message: args.join(' ')
                        }, '*');
                        originalLog.apply(console, args);
                    };
                    
                    console.error = function(...args) {
                        parent.postMessage({
                            type: 'console',
                            level: 'error',
                            message: args.join(' ')
                        }, '*');
                        originalError.apply(console, args);
                    };
                    
                    console.warn = function(...args) {
                        parent.postMessage({
                            type: 'console',
                            level: 'warn',
                            message: args.join(' ')
                        }, '*');
                        originalWarn.apply(console, args);
                    };
                    
                    try {
                        ${js}
                    } catch(error) {
                        console.error('Error:', error.message);
                    }
                </script>
            </body>
            </html>
        `;

    // Update preview
    preview.srcdoc = combinedCode;

    // Update status
    updateStatus("Code executed successfully", "success");
  } catch (error) {
    console.error("Error running code:", error);
    updateStatus("Error: " + error.message, "error");
    addConsoleMessage("Error: " + error.message, "error");
  }
}
// Format Code
function formatCode() {
  const activeTab = editorState.currentTab;
  let codeElement;

  if (activeTab === "html") {
    codeElement = document.getElementById("htmlCode");
    codeElement.value = formatHTML(codeElement.value);
  } else if (activeTab === "css") {
    codeElement = document.getElementById("cssCode");
    codeElement.value = formatCSS(codeElement.value);
  } else if (activeTab === "js") {
    codeElement = document.getElementById("jsCode");
    codeElement.value = formatJS(codeElement.value);
  }

  updateLineNumbers();
  updateStatus("Code formatted", "success");
}

// Format HTML
function formatHTML(html) {
  // Basic HTML formatting
  let formatted = html.replace(/></g, ">\n<").replace(/(\r\n|\n|\r)/gm, "\n");

  // Indentation
  let indent = 0;
  const lines = formatted.split("\n");
  const formattedLines = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("</")) {
      indent = Math.max(0, indent - 1);
    }

    formattedLines.push("    ".repeat(indent) + trimmed);

    if (
      trimmed.startsWith("<") &&
      !trimmed.startsWith("</") &&
      !trimmed.endsWith("/>") &&
      !trimmed.includes("</")
    ) {
      indent++;
    }
  });

  return formattedLines.join("\n");
}

// Format CSS
function formatCSS(css) {
  return css
    .replace(/\s*{\s*/g, " {\n    ")
    .replace(/;\s*/g, ";\n    ")
    .replace(/\s*}\s*/g, "\n}\n\n")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

// Format JavaScript
function formatJS(js) {
  // Basic JS formatting
  return js
    .replace(/\s*{\s*/g, " {\n    ")
    .replace(/;\s*/g, ";\n    ")
    .replace(/\s*}\s*/g, "\n}\n")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}
// Save Project
function saveProject() {
  const project = {
    name: document.getElementById("projectName").value || "Untitled Project",
    html: document.getElementById("htmlCode").value,
    css: document.getElementById("cssCode").value,
    js: document.getElementById("jsCode").value,
    timestamp: new Date().toISOString(),
  };

  // Save to localStorage
  localStorage.setItem("codequest_current_project", JSON.stringify(project));

  // Save to projects list
  const projects = JSON.parse(
    localStorage.getItem("codequest_projects") || "[]"
  );
  const existingIndex = projects.findIndex((p) => p.name === project.name);

  if (existingIndex !== -1) {
    projects[existingIndex] = project;
  } else {
    projects.push(project);
  }

  localStorage.setItem("codequest_projects", JSON.stringify(projects));

  updateStatus("✓ Project saved", "success");
}
