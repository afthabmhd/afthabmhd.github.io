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

// ---------- Set appropriate character image and placeholder based on screen size ----------
function setCharacterImage() {
  const characterImg = document.getElementById('character-png');
  const commandInput = document.getElementById('command-input');
  const isMobile = window.innerWidth <= 768;
  
  if (characterImg) {
    if (isMobile) {
      characterImg.src = 'assets/gifs/mob.gif';
    } else {
      characterImg.src = 'assets/gifs/char.gif';
    }
  }
  
  // Set appropriate placeholder text based on screen size
  if (commandInput) {
    if (window.innerWidth <= 480) {
      commandInput.placeholder = 'type here...';
    } else {
      commandInput.placeholder = 'type your command here...';
    }
  }
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
    setCharacterImage(); // Set the appropriate image on load
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
    '  skills    - Technical skills',
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
    '   Interactive terminal-style portfolio',
    '',
    '2. Araknid - Visual block-based coding platform for C',
    '   Drag-and-drop programming interface',
    '',
    '3. High School Robotics Bootcamp (Arduino-based)',
    '   Educational robotics curriculum',
    '',
    '4. Flare - A private decentralized messaging app',
    '   Secure peer-to-peer communication (in progress)',
    '',
    'All projects built with passion and creativity.',
    ''
  ],
  skills: [
    '',
    'TECHNICAL SKILLS',
    '================',
    '',
    'Programming Languages:',
    '• Python (Advanced)',
    '• JavaScript/HTML/CSS (Intermediate)',
    '• C/C++ (Intermediate)',
    '• Arduino Programming',
    '',
    'Technologies & Tools:',
    '• Web Development',
    '• Terminal/CLI Applications',
    '• Version Control (Git)',
    '• Educational Content Creation',
    '',
    'Other Skills:',
    '• Technical Writing',
    '• Creative Writing & Poetry',
    '• Teaching & Mentoring',
    ''
  ],
  contact: [
    'CONTACT',
    '=======',
    'Feel free to reach out!',
    '',
    'Email: <a href="mailto:afthabmuhammadthayyil@gmail.com" style="color: #51cf66; text-decoration: none;">afthabmuhammadthayyil@gmail.com</a>',
    'WhatsApp: <a href="https://wa.me/919061672490" target="_blank" style="color: #51cf66; text-decoration: none;">+91 90616 72490</a>',
    'Instagram: <a href="https://instagram.com/ftb.mhd" target="_blank" style="color: #51cf66; text-decoration: none;">@ftb.mhd</a>',
    'LinkedIn: <a href="https://www.linkedin.com/in/afthab-muhammad-619698257" target="_blank" style="color: #51cf66; text-decoration: none;">Afthab Muhammad</a>',
    '',
    'Available for freelance work and collaborations!'
  ],
  sudo: ['Permission denied: You are not root.'],
  whoami: ['aftab@portfolio:~ $ You are viewing Aftab Muhammad\'s portfolio'],
  pwd: ['/home/aftab/portfolio'],
  ls: ['about.txt  projects.txt  contact.txt  skills.txt'],
  date: [new Date().toString()],
  joke: ['Why do Java developers wear glasses?', 'Because they do not C#.'],
  quote: [
    '"The best way to predict the future is to create it."',
    '- Alan Kay'
  ]
};

let commandHistory = [];
let historyIndex = 0;

// ---------- Typing Animation Function ----------
function typeText(element, text, speed = 30) {
  return new Promise((resolve) => {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
      if (i < text.length) {
        element.innerHTML = text.substring(0, i + 1);
        i++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }
    
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
    const outputLines = output.querySelectorAll('.output-line');
    outputLines.forEach(line => line.remove());
    return;
  }

  if (commands[command]) {
    for (let i = 0; i < commands[command].length; i++) {
      const line = commands[command][i];
      const lineDiv = document.createElement('div');
      lineDiv.className = 'output-line';
      output.appendChild(lineDiv);
      
      output.scrollTop = output.scrollHeight;
      
      await typeText(lineDiv, line, 25);
    }
  } else if (command) {
    const errorLine = document.createElement('div');
    errorLine.className = 'output-line';
    output.appendChild(errorLine);
    
    const errorText = 'Command not found: ' + command + '. Type "help" for available commands.';
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

// ---------- Mobile Touch Handling ----------
function handleMobileInput() {
  const input = document.getElementById('command-input');
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // Prevent zoom on focus for mobile
    input.addEventListener('focus', (e) => {
      const originalSize = e.target.style.fontSize;
      e.target.style.fontSize = '16px';
      setTimeout(() => {
        e.target.style.fontSize = originalSize;
      }, 100);
    });
    
    // Handle virtual keyboard
    let initialViewportHeight = window.innerHeight;
    
    window.addEventListener('resize', () => {
      const currentHeight = window.innerHeight;
      const terminalOutput = document.getElementById('terminal-output');
      
      if (currentHeight < initialViewportHeight * 0.75) {
        // Virtual keyboard is likely open
        if (terminalOutput) {
          terminalOutput.style.maxHeight = '25vh';
        }
      } else {
        // Virtual keyboard is likely closed
        if (terminalOutput) {
          terminalOutput.style.maxHeight = '';
        }
      }
    });
  }
}

// ---------- Terminal Initialization ----------
function initTerminal() {
  const input = document.getElementById('command-input');
  const output = document.getElementById('terminal-output');
  const contentArea = document.querySelector('.content-area');
  
  // Create the pinned header
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
  
  contentArea.insertBefore(headerDiv, output);
  
  // Initialize mobile handling
  handleMobileInput();
  
  // Welcome message
  setTimeout(async () => {
    await addTerminalLine(output, 'Welcome to my terminal portfolio!');
    await addTerminalLine(output, 'Type "help" to see available commands.');
    await addTerminalLine(output, '');
  }, 500);
  
  input.focus();

  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const command = input.value.trim().toLowerCase();
      
      // Play beep sound (with error handling for mobile)
      try {
        if (beepSound) {
          beepSound.currentTime = 0;
          await beepSound.play();
        }
      } catch (error) {
        // Ignore audio errors on mobile/browsers that block autoplay
        console.log('Audio play blocked - this is normal on mobile');
      }
      
      if (command) {
        commandHistory.push(command);
      }
      historyIndex = commandHistory.length;

      const commandLine = document.createElement('div');
      commandLine.className = 'output-line';
      commandLine.innerHTML = '<span style="color: #87d7ff;">welcome@portfolio:~ $</span> ' + input.value;
      output.appendChild(commandLine);

      input.disabled = true;
      input.placeholder = 'Processing...';
      
      await handleCommand(command, output);
      
      input.disabled = false;
      input.placeholder = window.innerWidth <= 480 ? 'type here...' : 'type your command here...';
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

  // Focus input when clicking anywhere on the page
  document.addEventListener('click', (e) => {
    // Don't focus if clicking on a link or if input is already focused
    if (e.target.tagName !== 'A' && e.target !== input) {
      input.focus();
    }
  });
  
  // Handle touch events for mobile
  document.addEventListener('touchend', (e) => {
    if (e.target.tagName !== 'A' && e.target !== input) {
      setTimeout(() => input.focus(), 100);
    }
  });
}

// ---------- Dynamic Status Updates ----------
let startTime = Date.now();

// Update date command periodically
setInterval(() => {
  commands.date = [new Date().toString()];
}, 60000);

// ---------- CSS Animation Helper ----------
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut { 
    to { 
      opacity: 0; 
      visibility: hidden; 
    } 
  }
  
  /* Prevent zoom on input focus for iOS */
  @media screen and (-webkit-min-device-pixel-ratio: 0) {
    select:focus,
    textarea:focus,
    input:focus {
      font-size: 16px !important;
      transform: translateZ(0);
    }
  }
  
  /* Hide scrollbar on mobile for cleaner look */
  @media (max-width: 768px) {
    #terminal-output::-webkit-scrollbar {
      width: 3px;
    }
  }
  
  /* Smooth transitions */
  .output-line {
    transition: opacity 0.2s ease;
  }
  
  /* Loading animation improvements */
  #loading-bar {
    transition: width 0.1s ease;
  }
`;
document.head.appendChild(style);

// ---------- Responsive Font Size Adjustment ----------
function adjustFontSize() {
  const root = document.documentElement;
  const width = window.innerWidth;
  
  if (width <= 320) {
    root.style.fontSize = '9px';
  } else if (width <= 480) {
    root.style.fontSize = '10px';
  } else if (width <= 768) {
    root.style.fontSize = '11px';
  } else {
    root.style.fontSize = '12px';
  }
}

// ---------- Handle window resize for responsive image switching ----------
function handleResize() {
  adjustFontSize();
  setCharacterImage();
  
  const input = document.getElementById('command-input');
  if (input) {
    input.blur();
    setTimeout(() => input.focus(), 100);
  }
}

// Adjust font size and image on load and resize
window.addEventListener('load', () => {
  adjustFontSize();
  setCharacterImage();
});
window.addEventListener('resize', handleResize);

// ---------- Prevent zoom on double tap for mobile ----------
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// ---------- Handle orientation change ----------
window.addEventListener('orientationchange', function() {
  setTimeout(() => {
    adjustFontSize();
    setCharacterImage();
    const input = document.getElementById('command-input');
    if (input) {
      input.blur();
      setTimeout(() => input.focus(), 100);
    }
  }, 500);
});

// ---------- Error handling for missing elements ----------
window.addEventListener('DOMContentLoaded', function() {
  // Check if all required elements exist
  const requiredElements = ['loading-screen', 'main-terminal', 'command-input', 'terminal-output'];
  const missingElements = requiredElements.filter(id => !document.getElementById(id));
  
  if (missingElements.length > 0) {
    console.warn('Missing required elements:', missingElements);
  }
  
  // Ensure beep sound is properly initialized
  const audio = document.getElementById('beep-sound');
  if (audio) {
    audio.volume = 0.3; // Set a reasonable volume
  }
  
  // Set initial character image
  setCharacterImage();
});
