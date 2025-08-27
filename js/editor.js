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

// Create New Project
function createNewProject() {
  if (confirm("Create a new project? Unsaved changes will be lost.")) {
    document.getElementById("projectName").value = "Untitled Project";
    document.getElementById("htmlCode").value =
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>New Project</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n</body>\n</html>';
    document.getElementById("cssCode").value =
      "* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nbody {\n    font-family: Arial, sans-serif;\n    padding: 2rem;\n}";
    document.getElementById("jsCode").value =
      '// Start coding here\nconsole.log("Hello, CodeQuest!");';

    updateAllLineNumbers();
    runCode();
    updateStatus("New project created", "success");
  }
}

// Open Project
function openProject() {
  const projects = JSON.parse(
    localStorage.getItem("codequest_projects") || "[]"
  );

  if (projects.length === 0) {
    alert("No saved projects found.");
    return;
  }

  const projectNames = projects.map((p) => p.name).join("\n");
  const projectName = prompt(
    `Enter project name to open:\n\nAvailable projects:\n${projectNames}`
  );

  if (projectName) {
    const project = projects.find((p) => p.name === projectName);
    if (project) {
      document.getElementById("projectName").value = project.name;
      document.getElementById("htmlCode").value = project.html || "";
      document.getElementById("cssCode").value = project.css || "";
      document.getElementById("jsCode").value = project.js || "";

      updateAllLineNumbers();
      runCode();
      updateStatus(`Project "${project.name}" loaded`, "success");
    } else {
      alert("Project not found.");
    }
  }
}

// Switch Tab
function switchTab(tab) {
  // Update active tab
  document
    .querySelectorAll(".editor-tab")
    .forEach((t) => t.classList.remove("active"));
  event.currentTarget.classList.add("active");

  // Update active editor
  document
    .querySelectorAll(".editor-wrapper")
    .forEach((e) => e.classList.remove("active"));
  document.getElementById(tab + "Editor").classList.add("active");

  editorState.currentTab = tab;

  // Update footer
  const fileTypes = { html: "HTML", css: "CSS", js: "JavaScript" };
  document.getElementById("fileType").textContent = fileTypes[tab];
}

// Close Tab
function closeTab(tab) {
  event.stopPropagation();
  // In a real implementation, this would handle closing tabs
  console.log("Close tab:", tab);
}
// Update Line Numbers
function updateLineNumbers(editorId) {
  const map = {
    htmlCode: "htmlLineNumbers",
    cssCode: "cssLineNumbers",
    jsCode: "jsLineNumbers",
  };

  if (!editorId) {
    updateAllLineNumbers();
    return;
  }

  const textarea = document.getElementById(editorId);
  const lineNumbers = document.getElementById(map[editorId]);

  if (textarea && lineNumbers) {
    const lines = textarea.value.split("\n");
    const numbers = [];

    for (let i = 1; i <= lines.length; i++) {
      numbers.push(i);
    }

    lineNumbers.innerHTML = numbers.join("<br>");

    // Update cursor position
    updateCursorPosition(textarea);
  }
}

// Update All Line Numbers
function updateAllLineNumbers() {
  updateLineNumbers("htmlCode");
  updateLineNumbers("cssCode");
  updateLineNumbers("jsCode");
}

// Sync Line Number Scroll
function syncLineNumberScroll(editorId) {
  const map = {
    htmlCode: "htmlLineNumbers",
    cssCode: "cssLineNumbers",
    jsCode: "jsLineNumbers",
  };

  const textarea = document.getElementById(editorId);
  const lineNumbers = document.getElementById(map[editorId]);

  if (textarea && lineNumbers) {
    lineNumbers.scrollTop = textarea.scrollTop;
  }
}

// Update Cursor Position
function updateCursorPosition(textarea) {
  const text = textarea.value.substring(0, textarea.selectionStart);
  const lines = text.split("\n");
  const currentLine = lines.length;
  const currentColumn = lines[lines.length - 1].length + 1;

  document.getElementById(
    "cursorPosition"
  ).textContent = `Line ${currentLine}, Column ${currentColumn}`;
}

// Initialize Challenge Mode
function initializeChallengeMode(challenge) {
  // Update project name
  document.getElementById("projectName").value = challenge.title;
  
  // Load starter code
  if (challenge.starterCode) {
    document.getElementById("htmlCode").value = challenge.starterCode.html || "";
    document.getElementById("cssCode").value = challenge.starterCode.css || "";
    document.getElementById("jsCode").value = challenge.starterCode.js || "";
  }
  
  // Add challenge instructions panel
  addChallengeInstructions(challenge);
  
  // Update line numbers
  updateAllLineNumbers();
  
  // Run initial preview
  runCode();
}

// Add Challenge Instructions
function addChallengeInstructions(challenge) {
  const instructionsPanel = document.createElement("div");
  instructionsPanel.className = "challenge-instructions";
  instructionsPanel.innerHTML = `
    <div class="challenge-header">
      <h3>🎯 ${challenge.title}</h3>
      <div class="challenge-meta">
        <span class="difficulty ${challenge.difficulty}">${challenge.difficulty}</span>
        <span class="xp-reward">🏆 ${challenge.xp} XP</span>
      </div>
    </div>
    <div class="challenge-description">
      <p>${challenge.description}</p>
    </div>
    <div class="challenge-requirements">
      <h4>Requirements:</h4>
      <ul>
        ${challenge.requirements.map(req => `<li>✓ ${req}</li>`).join('')}
      </ul>
    </div>
    <div class="challenge-actions">
      <button class="btn btn-success" onclick="submitChallenge('${challenge.id || 'unknown'}')">Submit Solution</button>
      <button class="btn btn-secondary" onclick="viewSolution()">View Solution</button>
    </div>
  `;
  
  // Insert at the top of the editor
  const editorContainer = document.querySelector('.editor-container');
  editorContainer.insertBefore(instructionsPanel, editorContainer.firstChild);
  
  // Add styles
  addChallengeStyles();
}







// Submit Challenge
function submitChallenge(challengeId) {
  const html = document.getElementById("htmlCode").value;
  const css = document.getElementById("cssCode").value;
  const js = document.getElementById("jsCode").value;
  
  // Basic validation (in a real app, this would be more sophisticated)
  if (!html.trim() || !css.trim()) {
    showNotification("Please complete both HTML and CSS sections", "warning");
    return;
  }
  
  // Check if user is logged in
  const user = window.AuthManager?.currentUser;
  if (!user) {
    showNotification("Please log in to submit your solution", "warning");
    return;
  }
  
  // Mark challenge as completed
  if (window.challengeFunctions && window.challengeFunctions.completeChallenge) {
    window.challengeFunctions.completeChallenge(challengeId, 100); // Default XP
  }
  
  // Show success message
  showNotification("🎉 Challenge completed! +100 XP earned", "success");
  
  // Remove challenge mode after a delay
  setTimeout(() => {
    const instructions = document.querySelector('.challenge-instructions');
    if (instructions) {
      instructions.remove();
    }
    // Reset to normal editor mode
    document.getElementById("projectName").value = "My Project";
  }, 3000);
}

// View Solution
function viewSolution() {
  const challengeData = sessionStorage.getItem("current_challenge");
  if (challengeData) {
    const challenge = JSON.parse(challengeData);
    if (challenge.solution) {
      // Load solution code
      document.getElementById("htmlCode").value = challenge.solution.html || "";
      document.getElementById("cssCode").value = challenge.solution.css || "";
      document.getElementById("jsCode").value = challenge.solution.js || "";
      
      // Update line numbers and preview
      updateAllLineNumbers();
      runCode();
      
      showNotification("Solution loaded! Study the code to learn", "info");
    } else {
      showNotification("No solution available for this challenge", "info");
    }
  }
}

// Add Challenge Styles
function addChallengeStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .challenge-instructions {
      background: rgba(15, 23, 42, 0.95);
      border: 2px solid rgba(99, 102, 241, 0.5);
      border-radius: 15px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      backdrop-filter: blur(10px);
    }
    
    .challenge-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .challenge-header h3 {
      color: #f8fafc;
      margin: 0;
    }
    
    .challenge-meta {
      display: flex;
      gap: 1rem;
    }
    
    .difficulty {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    
    .difficulty.beginner { background: #10b981; color: white; }
    .difficulty.intermediate { background: #f59e0b; color: white; }
    .difficulty.advanced { background: #ef4444; color: white; }
    .difficulty.expert { background: #8b5cf6; color: white; }
    
    .xp-reward {
      color: #fbbf24;
      font-weight: 600;
    }
    
    .challenge-description {
      color: #cbd5e1;
      margin-bottom: 1rem;
      line-height: 1.6;
    }
    
    .challenge-requirements h4 {
      color: #f8fafc;
      margin-bottom: 0.5rem;
    }
    
    .challenge-requirements ul {
      color: #cbd5e1;
      margin-left: 1.5rem;
    }
    
    .challenge-requirements li {
      margin-bottom: 0.25rem;
    }
    
    .challenge-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #333;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
    }
    
    .notification.show {
      transform: translateX(0);
    }
    
    .notification.success {
      background: #10b981;
    }
    
    .notification.warning {
      background: #f59e0b;
    }
    
    .notification.error {
      background: #ef4444;
    }
    
    .notification.info {
      background: #3b82f6;
    }
  `;
  
  document.head.appendChild(style);
}

// Show Notification
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);
  
  // Hide and remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

// Console Functions
function initializeConsole() {
  // Listen for messages from iframe
  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "console") {
      addConsoleMessage(e.data.message, e.data.level);
    }
  });
}

function toggleConsole() {
  const consolePanel = document.getElementById("consolePanel");
  consolePanel.classList.toggle("active");
}

function clearConsole() {
  const consoleContent = document.getElementById("consoleContent");
  consoleContent.innerHTML =
    '<div class="console-line"><span class="console-time">' +
    getCurrentTime() +
    '</span><span class="console-message">Console cleared</span></div>';
}

function addConsoleMessage(message, level = "log") {
  const consoleContent = document.getElementById("consoleContent");
  const consoleLine = document.createElement("div");
  consoleLine.className = "console-line";

  const levelClass =
    level === "error"
      ? "console-error"
      : level === "warn"
      ? "console-warning"
      : "console-message";

  consoleLine.innerHTML = `
        <span class="console-time">${getCurrentTime()}</span>
        <span class="${levelClass}">${escapeHtml(message)}</span>
    `;

  consoleContent.appendChild(consoleLine);
  consoleContent.scrollTop = consoleContent.scrollHeight;
}

// Utility Functions
function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().split(" ")[0];
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function updateStatus(message, type = "info") {
  const saveStatus = document.getElementById("saveStatus");
  if (saveStatus) {
    saveStatus.textContent = message;
    setTimeout(() => {
      saveStatus.textContent = "✓ All changes saved";
    }, 3000);
  }
}

// History Management
function saveToHistory(editorId) {
  const content = document.getElementById(editorId).value;
  const historyKey = editorId.replace("Code", "");

  if (!editorState.history[historyKey]) {
    editorState.history[historyKey] = [];
  }

  editorState.history[historyKey].push(content);
  editorState.historyIndex[historyKey] =
    editorState.history[historyKey].length - 1;

  // Limit history to 50 entries
  if (editorState.history[historyKey].length > 50) {
    editorState.history[historyKey].shift();
    editorState.historyIndex[historyKey]--;
  }
}

function undoAction() {
  const tab = editorState.currentTab;
  const history = editorState.history[tab];

  if (history && editorState.historyIndex[tab] > 0) {
    editorState.historyIndex[tab]--;
    const content = history[editorState.historyIndex[tab]];
    document.getElementById(tab + "Code").value = content;
    updateLineNumbers(tab + "Code");
  }
}

function redoAction() {
  const tab = editorState.currentTab;
  const history = editorState.history[tab];

  if (history && editorState.historyIndex[tab] < history.length - 1) {
    editorState.historyIndex[tab]++;
    const content = history[editorState.historyIndex[tab]];
    document.getElementById(tab + "Code").value = content;
    updateLineNumbers(tab + "Code");
  }
}

// Snippets
function insertSnippet(snippetType) {
  const snippets = {
    "html-boilerplate": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`,
    "flexbox-center": `.center {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}`,
    "fetch-api": `fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });`,
    "event-listener": `document.addEventListener('DOMContentLoaded', function() {
    // Your code here
});`,
  };

  const activeTab = editorState.currentTab;
  const textarea = document.getElementById(activeTab + "Code");

  if (textarea && snippets[snippetType]) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    textarea.value =
      text.substring(0, start) + snippets[snippetType] + text.substring(end);
    textarea.selectionStart = textarea.selectionEnd =
      start + snippets[snippetType].length;

    updateLineNumbers(activeTab + "Code");
    textarea.focus();
  }
}
// Settings Functions
function changeTheme(theme) {
  editorState.settings.theme = theme;
  document.body.className = "theme-" + theme;
  updateStatus("Theme changed to " + theme, "success");
}

function changeFontSize(size) {
  editorState.settings.fontSize = parseInt(size);
  document.querySelectorAll(".code-input").forEach((input) => {
    input.style.fontSize = size + "px";
  });
  document.querySelectorAll(".line-numbers").forEach((ln) => {
    ln.style.fontSize = size + "px";
  });
}

function changeTabSize(size) {
  editorState.settings.tabSize = parseInt(size);
}

function toggleWordWrap() {
  editorState.settings.wordWrap = !editorState.settings.wordWrap;
  const wrap = editorState.settings.wordWrap ? "wrap" : "nowrap";
  document.querySelectorAll(".code-input").forEach((input) => {
    input.style.whiteSpace = wrap;
  });
}

function toggleLineNumbers() {
  editorState.settings.lineNumbers = !editorState.settings.lineNumbers;
  document.querySelectorAll(".line-numbers").forEach((ln) => {
    ln.style.display = editorState.settings.lineNumbers ? "block" : "none";
  });
}

function toggleAutoSave() {
  editorState.settings.autoSave = !editorState.settings.autoSave;
  updateStatus(
    editorState.settings.autoSave ? "Auto-save enabled" : "Auto-save disabled",
    "info"
  );
}

// Preview Functions
function refreshPreview() {
  runCode();
}

function toggleFullscreen() {
  const preview = document.getElementById("previewFrame");
  if (!document.fullscreenElement) {
    preview.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function openInNewTab() {
  const html = document.getElementById("htmlCode").value;
  const css = document.getElementById("cssCode").value;
  const js = document.getElementById("jsCode").value;

  const newWindow = window.open("", "_blank");
  newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview - ${
              document.getElementById("projectName").value
            }</title>
            <style>${css}</style>
        </head>
        <body>
            ${html}
            <script>${js}</script>
        </body>
        </html>
    `);
}

function setDevice(device) {
  const preview = document.getElementById("preview");
  const previewFrame = document.getElementById("previewFrame");

  document
    .querySelectorAll(".device-btn")
    .forEach((btn) => btn.classList.remove("active"));
  event.currentTarget.classList.add("active");

  switch (device) {
    case "mobile":
      previewFrame.style.width = "375px";
      previewFrame.style.margin = "0 auto";
      break;
    case "tablet":
      previewFrame.style.width = "768px";
      previewFrame.style.margin = "0 auto";
      break;
    default:
      previewFrame.style.width = "100%";
      previewFrame.style.margin = "0";
  }
}

// Sidebar Functions
function showSidebarPanel(panel) {
  document
    .querySelectorAll(".sidebar-tab")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelectorAll(".sidebar-panel")
    .forEach((p) => p.classList.remove("active"));

  event.currentTarget.classList.add("active");
  document.getElementById(panel + "Panel").classList.add("active");
}

function openFile(filename) {
  document
    .querySelectorAll(".file-item")
    .forEach((item) => item.classList.remove("active"));
  event.currentTarget.classList.add("active");

  // In a real implementation, this would load the file content
  console.log("Opening file:", filename);
}

function addNewFile() {
  const filename = prompt("Enter file name:");
  if (filename) {
    // In a real implementation, this would create a new file
    console.log("Creating file:", filename);
  }
}

// Share Project
function shareProject() {
  const projectData = {
    name: document.getElementById("projectName").value,
    html: document.getElementById("htmlCode").value,
    css: document.getElementById("cssCode").value,
    js: document.getElementById("jsCode").value,
  };

  const shareUrl =
    window.location.origin +
    "/editor.html?project=" +
    btoa(encodeURIComponent(JSON.stringify(projectData)));

  navigator.clipboard.writeText(shareUrl).then(() => {
    updateStatus("Share link copied to clipboard!", "success");
  });
}

// Keyboard Shortcuts Modal
function showShortcuts() {
  document.getElementById("shortcutsModal").style.display = "block";
}

function showHelp() {
  alert(
    "CodeQuest Editor Help:\n\n" +
      "• Use the tabs to switch between HTML, CSS, and JavaScript\n" +
      "• Click Run or press Ctrl+Enter to preview your code\n" +
      "• Save your project with Ctrl+S\n" +
      "• Format your code with Alt+Shift+F\n" +
      "• Toggle console to see JavaScript output\n" +
      "• Use snippets for quick code templates"
  );
}

// Toggle Comment
function toggleComment() {
  const activeTab = editorState.currentTab;
  const textarea = document.getElementById(activeTab + "Code");

  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);

  let commentedText;
  if (activeTab === "html") {
    commentedText = `<!-- ${selectedText} -->`;
  } else if (activeTab === "css") {
    commentedText = `/* ${selectedText} */`;
  } else {
    commentedText = `// ${selectedText}`;
  }

  textarea.value =
    textarea.value.substring(0, start) +
    commentedText +
    textarea.value.substring(end);
  textarea.selectionStart = start;
  textarea.selectionEnd = start + commentedText.length;
}