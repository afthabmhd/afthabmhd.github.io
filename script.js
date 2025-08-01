document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const contactInput = document.getElementById('contact-input');
    const output = document.getElementById('output');
    const keySound = document.getElementById('key-sound');
    const enterSound = document.getElementById('enter-sound');
    const clearSound = document.getElementById('clear-sound');
    let isTyping = false;
    const messageQueue = [];

    const about = "I’m a software developer, teacher, designer, and writer. I love building things, teaching people, and making ideas real.";
    const projects = {
        "devlog-site": {
            description: "A static blog platform for coders",
            tech: ["React", "Gatsby", "GraphQL"],
            live: "#",
            code: "#"
        },
        "tuitionhub": {
            description: "A tool I built to manage my students",
            tech: ["React", "Firebase", "Node.js"],
            live: "#",
            code: "#"
        },
        "pixelfolio": {
            description: "A creative pixel-art themed portfolio",
            tech: ["HTML", "CSS", "JavaScript"],
            live: "#",
            code: "#"
        }
    };
    const testimonials = [
        "Aftab is a great developer to work with.",
        "He is very passionate about his work.",
        "He is a great teacher."
    ];
    const fortunes = [
        "The best way to predict the future is to create it.",
        "The only way to do great work is to love what you do.",
        "The journey of a thousand miles begins with a single step.",
        "Error: Fortune not found. Abort, Retry, Ignore?",
        "404: Fortune not found."
    ];
    let contactState = null;
    let contactData = {};
    let wrongCommandCount = 0;
    let soundEnabled = false;

    function playSound(sound) {
        if (soundEnabled) {
            sound.currentTime = 0;
            sound.play();
        }
    }

    input.addEventListener('input', () => playSound(keySound));
    contactInput.addEventListener('input', () => playSound(keySound));

    input.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter' && !isTyping) {
            playSound(enterSound);
            const command = input.value.trim();
            input.value = '';

            if (command) {
                // Display the command entered by the user
                await displayOutput(`<span class="prompt">></span> <span class="command">${command}</span>`, false);
                await processCommand(command);
                // Scroll to the bottom of the output
                output.scrollTop = output.scrollHeight;
            }
        }
    });

    contactInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Escape') {
            playSound(enterSound);
            const message = contactInput.value;
            contactInput.value = '';
            contactInput.classList.add('hidden');
            input.classList.remove('hidden');
            input.focus();
            await displayOutput(`<span class="prompt">></span> <span class="command">${message}</span>`, false);
            await processContact(message);
        }
    });

    async function processCommand(command) {
        const [cmd, ...args] = command.toLowerCase().split(' ');
        const isValidCommand = [
            'help', 'about', 'cat', 'projects', 'view', 'resume', 
            'testimonials', 'contact', 'clear', 'exit', 'fortune', 
            'sudo', 'ls', 'hack', 'theme', 'sound', 'eject'
        ].includes(cmd);

        if (isValidCommand) {
            wrongCommandCount = 0;
        }

        switch (cmd) {
            case 'help':
                await displayOutput('Available Commands:');
                await displayOutput('&nbsp;&nbsp;about&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Learn who I am');
                await displayOutput('&nbsp;&nbsp;projects&nbsp;&nbsp;&nbsp;&nbsp;- View my portfolio');
                await displayOutput('&nbsp;&nbsp;resume&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Get my resume');
                await displayOutput('&nbsp;&nbsp;testimonials - See what people say');
                await displayOutput('&nbsp;&nbsp;contact&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Send me a message');
                await displayOutput('&nbsp;&nbsp;clear&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clear the screen');
                await displayOutput('&nbsp;&nbsp;exit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- End this session');
                await displayOutput('<br>There are also some hidden commands to discover...');
                break;
            case 'about':
                await displayOutput(about);
                break;
            case 'cat':
                if (args[0] === 'aftab.txt') {
                    await displayOutput(about);
                } else {
                    await displayOutput(`<span class="error">File not found: ${args[0]}</span>`);
                }
                break;
            case 'projects':
                await displayOutput('[ Projects Loaded ]', true, true);
                for (const key in projects) {
                    await displayOutput(`- ${key}`);
                }
                await displayOutput('<br>Type "view <project_name>" to see more details.');
                break;
            case 'view':
                const projectName = args[0];
                if (projectName && projects[projectName]) {
                    const project = projects[projectName];
                    let projectHTML = `<div class="project-panel">`;
                    projectHTML += `<h3>${projectName}</h3>`;
                    projectHTML += `<p>${project.description}</p>`;
                    projectHTML += `<p><b>Tech:</b> ${project.tech.join(', ')}</p>`;
                    projectHTML += `<p><a href="${project.live}" target="_blank" class="link">Live</a> | <a href="${project.code}" target="_blank" class="link">Code</a></p>`;
                    projectHTML += `</div>`;
                    await displayOutput(projectHTML, false);
                } else {
                    await displayOutput(`<span class="error">Project not found: ${projectName}</span>`);
                }
                break;
            case 'resume':
                await displayOutput('Here is my resume: <a href="resume.pdf" target="_blank" class="link">resume.pdf</a>');
                break;
            case 'testimonials':
                await displayOutput('Testimonials:');
                for (const t of testimonials) {
                    await displayOutput(`- "${t}"`);
                }
                break;
            case 'contact':
                await displayOutput('Enter your message (hit ESC to send):');
                input.classList.add('hidden');
                contactInput.classList.remove('hidden');
                contactInput.focus();
                break;
            case 'clear':
                playSound(clearSound);
                output.innerHTML = '';
                break;
            case 'exit':
                await displayOutput('Goodbye!');
                input.disabled = true;
                break;
            case 'fortune':
                const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
                await displayOutput(fortune);
                break;
            case 'sudo':
                await displayOutput('<span class="error">Permission denied. Nice try.</span>');
                break;
            case 'ls':
                await displayOutput('This isn’t Linux, but I see what you did there.');
                break;
            case 'hack':
                await hack();
                break;
            case 'theme':
                document.body.classList.toggle('light-mode');
                await displayOutput('Theme changed.');
                break;
            case 'sound':
                soundEnabled = !soundEnabled;
                await displayOutput(`Sound ${soundEnabled ? 'enabled' : 'disabled'}.`);
                break;
            case 'eject':
                await eject();
                break;
            default:
                wrongCommandCount++;
                if (wrongCommandCount >= 3) {
                    await displayOutput("<span class='error'>Need a hand? Try 'help'. I won't judge.</span>");
                    wrongCommandCount = 0;
                } else {
                    const wittyReplies = [
                        `Unknown command: '${command}'. Type 'help' before going rogue.`,
                        `'${command}'? That's not a command. Are you making things up?`,
                        `I'm sorry, Dave. I'm afraid I can't do that. ('${command}')`,
                        `Error: '${command}' is not a valid command. Maybe try 'help'?`
                    ];
                    const reply = wittyReplies[Math.floor(Math.random() * wittyReplies.length)];
                    await displayOutput(`<span class="error">${reply}</span>`);
                }
                break;
        }
    }

    async function eject() {
        await displayOutput('> Switching to graphic interface...');
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'white';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 1s';
        document.body.appendChild(overlay);
        await new Promise(resolve => setTimeout(resolve, 100));
        overlay.style.opacity = '1';
        await new Promise(resolve => setTimeout(resolve, 1000));
        overlay.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, 1000));
        document.body.removeChild(overlay);
        await displayOutput('Just kidding. This is all you get. :)');
    }

    async function hack() {
        input.disabled = true;
        await displayOutput('<span class="glitch">Hacking in progress...</span>', true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await displayOutput('<span class="glitch">Bypassing firewall...</span>', true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await displayOutput('<span class="glitch">Accessing main server...</span>', true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await displayOutput('<span class="success glitch">Hack successful!</span>', true);
        await new Promise(resolve => setTimeout(resolve, 500));
        await displayOutput('Just kidding, of course. :)', true);
        input.disabled = false;
        input.focus();
    }

    async function processContact(message) {
        contactData.message = message;
        await displayOutput('<span class="success">[ Message sent successfully. Thank you. ]</span>');
        // Here you would typically send the data to a server
        console.log('Contact data:', contactData);
        contactData = {};
    }

    function scrambleText(element, final_text) {
        let text = element.innerText;
        let i = 0;
        const interval = setInterval(() => {
            if (i < final_text.length) {
                let new_text = '';
                for (let j = 0; j < final_text.length; j++) {
                    if (j <= i) {
                        new_text += final_text[j];
                    } else {
                        new_text += String.fromCharCode(Math.random() * (126 - 33) + 33);
                    }
                }
                element.innerHTML = new_text;
                i++;
            } else {
                clearInterval(interval);
                element.innerHTML = final_text;
            }
        }, 50);
    }

    function displayOutput(message, useTyping = true, scramble = false) {
        return new Promise((resolve) => {
            const div = document.createElement('div');
            output.appendChild(div);

            if (scramble) {
                scrambleText(div, message);
                resolve();
            } else if (useTyping) {
                input.disabled = true;
                new TypeIt(div, {
                    strings: message,
                    speed: 20,
                    lifeLike: true,
                    afterComplete: (instance) => {
                        instance.destroy();
                        input.disabled = false;
                        input.focus();
                        output.scrollTop = output.scrollHeight;
                        resolve();
                    }
                }).go();
            } else {
                div.innerHTML = message;
                output.scrollTop = output.scrollHeight;
                resolve();
            }
        });
    }

    // Focus the input field on any click on the terminal
    document.getElementById('terminal').addEventListener('click', () => {
        if (!isTyping) {
            input.focus();
        }
    });

    // Initial boot sequence
    (async () => {
        await displayOutput('> AFTAB MUHAMMAD', true, true);
        await new Promise(resolve => setTimeout(resolve, 500));
        await displayOutput('> Initializing Portfolio...', true, true);
        await displayOutput('> Loading modules...', true, true);
        await displayOutput('> Connecting to creativity engine...', true, true);
        await displayOutput('<span class="success">✔️ Terminal ready.</span>');
        await new Promise(resolve => setTimeout(resolve, 500)); // short delay
        await displayOutput("Welcome to my interactive portfolio!");
        await displayOutput('Type "help" to see the list of available commands.');
        await displayOutput('');
    })();
});
