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
