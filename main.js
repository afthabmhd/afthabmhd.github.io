// ---------- Scramble-from-blank ----------
function scrambleText(el, finalText) {
  el.textContent = '';
  let idx = 0;
  const tick = () => {
    if (idx > finalText.length) return;
    const visible = finalText.slice(0, idx);
    const scramble = finalText
      .slice(idx)
      .split('')
      .map(() => String.fromCharCode(33 + Math.floor(Math.random() * 94)))
      .join('');
    el.textContent = visible + scramble;
    idx++;
    setTimeout(tick, 60);
  };
  tick();
}

// ---------- Boot sequence ----------
const loadingLines = document.querySelectorAll('#loading-text .line');
const loadingScreen = document.getElementById('loading-screen');
const mainTerminal = document.getElementById('main-terminal');
const beepSound = document.getElementById('beep-sound');

const finalLines = [
  '> AFTAB MUHAMMAD',
  '> Initializing Portfolio...',
  '> Loading modules...',
  '> Connecting to creativity engine...',
  '✔️ Terminal ready.'
];

document.getElementById('loading-text').style.display = 'block';
loadingLines.forEach((line, idx) => {
  setTimeout(() => scrambleText(line, finalLines[idx]), idx * 600);
});

setTimeout(() => {
  loadingScreen.style.animation = 'fadeOut 0.5s forwards';
  setTimeout(() => {
    loadingScreen.style.display = 'none';
    mainTerminal.classList.remove('hidden');
    initTerminal();
  }, 500);
}, 5000);

// ---------- Terminal Logic ----------
const commands = {
  help: [
    'Available commands:',
    '  about     - Learn more about me',
    '  projects  - View my projects',
    '  contact   - Get in touch',
    '  clear     - Clear the terminal'
  ],
  about: [
    ' ',
    'ABOUT ME',
    '=========',
    ' ',
    'Hi, I am Aftab Mohamed — a tinkerer by heart and habit.',
    'I build things that are useful, expressive, or both.',
    ' ',
    'I primarily write code in Python, but I also write stories,',
    'poetry, and occasionally — lecture notes.',
    ' ',
    'If I am not coding or writing, I am probably reading,',
    'overthinking something, or playing football.',
    ' ',
    'Known for:',
    '• Making actually useful utilities',
    '• Teaching in ways that do not put you to sleep',
    '• Writing verses better than most commits',
    '• Running on low sleep and bad puns',
    ' '
  ],
  projects: [
    '',
    'PROJECTS',
    '=========',
    '',
    '1. Terminal Portfolio - This website!',
    '2. Araknid - Visual block-based coding platform for C',
    '3. High School Robotics Bootcamp (Arduino-based)',
    '4. Flare - A private decentralized messaging app (in progress)',
    '',
    'All projects built with passion and creativity.',
    ''
  ],
  contact: [
    'CONTACT',
    '=======',
    'Feel free to reach out!',
    '',
    'Email: <a href="mailto:afthabmuhammadthayyil@gmail.com" style="color: #51cf66; text-decoration: none;">Email</a>',
    'WhatsApp: <a href="https://wa.me/919061672490" target="_blank" style="color: #51cf66; text-decoration: none;">WhatsApp</a>',
    'Instagram: <a href="https://instagram.com/ftb.mhd" target="_blank" style="color: #51cf66; text-decoration: none;">Instagram</a>',
    'LinkedIn: <a href="https://www.linkedin.com/in/afthab-muhammad-619698257" target="_blank" style="color: #51cf66; text-decoration: none;">LinkedIn</a>'
  ],
  sudo: ['Permission denied: You are not root.'],
  joke: ['Why do Java developers wear glasses?', 'Because they do not C#.']
};

let commandHistory = [];
let historyIndex = 0;

// ---------- Typing Animation Function ----------
function typeText(element, text, speed = 30) {
  return new Promise((resolve) => {
    let i = 0;
    element.innerHTML = ''; // Changed from textContent to innerHTML
    
    function type() {
      if (i < text.length) {
        element.innerHTML = text.substring(0, i + 1); // Use innerHTML to preserve HTML tags
        i++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }
    
    // Handle empty lines by adding a non-breaking space
    if (text.trim() === '') {
      element.innerHTML = '&nbsp;';
      resolve();
    } else {
      setTimeout(type, 100);
    }
  });
}

// ---------- Command Handler with Animation ----------
async function handleCommand(command, output) {
  if (command === 'clear') {
    // Clear all content except the pinned header
    const outputLines = output.querySelectorAll('.output-line');
    outputLines.forEach(line => line.remove());
    return;
  }

  if (commands[command]) {
    // Special handling for message command
    if (command === 'message') {
      await showContactForm(output);
      return;
    }
    
    // Process each line with typing animation
    for (let i = 0; i < commands[command].length; i++) {
      const line = commands[command][i];
      const lineDiv = document.createElement('div');
      lineDiv.className = 'output-line';
      output.appendChild(lineDiv);
      
      // Scroll to keep new content visible
      output.scrollTop = output.scrollHeight;
      
      await typeText(lineDiv, line, 25);
    }
  } else if (command) {
    const errorLine = document.createElement('div');
    errorLine.className = 'output-line';
    output.appendChild(errorLine);
    
    const errorText = 'Command not found: ' + command;
    errorLine.innerHTML = '<span style="color: #ff6b6b;"></span>';
    const errorSpan = errorLine.querySelector('span');
    
    output.scrollTop = output.scrollHeight;
    await typeText(errorSpan, errorText, 30);
  }
}





// ---------- Helper Function to Add Terminal Lines ----------
async function addTerminalLine(output, text) {
  const lineDiv = document.createElement('div');
  lineDiv.className = 'output-line';
  output.appendChild(lineDiv);
  output.scrollTop = output.scrollHeight;
  await typeText(lineDiv, text, 25);
}

// ---------- Terminal Initialization ----------
function initTerminal() {
  const input = document.getElementById('command-input');
  const output = document.getElementById('terminal-output');
  const contentArea = document.querySelector('.content-area');
  const characterArea = document.querySelector('.character-area');
  
  // Make character bigger and crop overflow
  const characterImg = document.getElementById('character-png');
  if (characterImg) {
    characterImg.style.width = '500px';
    characterImg.style.height = 'auto';
    characterImg.style.objectFit = 'cover';
    characterImg.style.objectPosition = 'center top';
  }
  
  // Add overflow hidden to character area to crop excess
  if (characterArea) {
    characterArea.style.overflow = 'hidden';
  }
  
  // Create the pinned header with two separate elements
  const headerDiv = document.createElement('div');
  headerDiv.className = 'terminal-header';
  
  const promptSpan = document.createElement('span');
  promptSpan.className = 'terminal-prompt';
  promptSpan.textContent = 'welcome@portfolio:~ $';
  
  const helpSpan = document.createElement('span');
  helpSpan.className = 'terminal-help-text';
  helpSpan.textContent = 'TYPE HELP TO VIEW COMMANDS';
  
  headerDiv.appendChild(promptSpan);
  headerDiv.appendChild(helpSpan);
  
  // Insert header before the terminal output
  contentArea.insertBefore(headerDiv, output);
  
  input.focus();

  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const command = input.value.trim().toLowerCase();
      beepSound.currentTime = 0;
      beepSound.play().catch(() => {});
      commandHistory.push(command);
      historyIndex = commandHistory.length;

      const commandLine = document.createElement('div');
      commandLine.className = 'output-line';
      commandLine.innerHTML = '<span style="color: #87d7ff;">welcome@portfolio:~ $</span> ' + input.value;
      output.appendChild(commandLine);

      // Disable input during command processing
      input.disabled = true;
      input.placeholder = 'Processing...';
      
      await handleCommand(command, output);
      
      // Re-enable input after command completes
      input.disabled = false;
      input.placeholder = 'type your command here...';
      input.value = '';
      input.focus();
      output.scrollTop = output.scrollHeight;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input.value = '';
      }
    }
  });

  document.addEventListener('click', () => input.focus());
}

// ---------- Dynamic Status Updates ----------
let startTime = Date.now();

// ---------- CSS Animation Helper ----------
const style = document.createElement('style');
style.textContent = '@keyframes fadeOut { to { opacity: 0; visibility: hidden; } }';
document.head.appendChild(style);
