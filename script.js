document.addEventListener('DOMContentLoaded', () => {
    const terminalToggle = document.getElementById('terminalToggle');
    const terminalOverlay = document.getElementById('terminalOverlay');
    const terminalClose = document.getElementById('terminalClose');
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalBody = document.getElementById('terminalBody');

    let commandHistory = [];
    let historyIndex = -1;

    function openTerminal() {
        terminalOverlay.classList.add('active');
        setTimeout(() => terminalInput.focus(), 100);
    }

    function closeTerminal() {
        terminalOverlay.classList.remove('active');
    }

    function addOutput(text, type = 'response') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        terminalOutput.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function processCommand(cmd) {
        const trimmed = cmd.trim();
        if (!trimmed) return;

        commandHistory.unshift(trimmed);
        historyIndex = -1;

        addOutput(trimmed, 'command');

        const commands = {
            'help': () => {
                addOutput('Available commands:', 'response');
                addOutput('  help', 'response');
                addOutput('  founder', 'response');
                addOutput('  discord', 'response');
                addOutput('  services', 'response');
                addOutput('  quality', 'response');
                addOutput('  clear', 'response');
                addOutput('  close', 'response');
            },
            'founder': () => {
                addOutput('@lab18bke', 'success');
            },
            'discord': () => {
                addOutput('Opening Discord...', 'success');
                window.open('https://discord.gg/J3FmkPyhuA', '_blank');
            },
            'services': () => {
                addOutput('Our Services:', 'success');
                addOutput('  • Discord Bots', 'response');
                addOutput('  • Web Development', 'response');
                addOutput('  • Minecraft Plugins & Mods', 'response');
                addOutput('  • Minecraft Datapacks', 'response');

            },
            'quality': () => {
                addOutput('Top-Notch', 'success');
            },
            'clear': () => {
                terminalOutput.innerHTML = '';
            },
            'close': () => {
                closeTerminal();
            }
        };

        const handler = commands[trimmed.toLowerCase()];
        if (handler) {
            handler();
        } else {
            addOutput(`Command not found: ${trimmed}`, 'error');
            addOutput("Type 'help' for available commands.", 'response');
        }
    }

    terminalToggle.addEventListener('click', openTerminal);
    terminalClose.addEventListener('click', closeTerminal);

    terminalOverlay.addEventListener('click', (e) => {
        if (e.target === terminalOverlay) {
            closeTerminal();
        }
    });

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            processCommand(terminalInput.value);
            terminalInput.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = -1;
                terminalInput.value = '';
            }
        } else if (e.key === 'Escape') {
            closeTerminal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === '`' && !terminalOverlay.classList.contains('active')) {
            e.preventDefault();
            openTerminal();
        }
    });

    window.krystalTerminal = {
        addOutput,
        processCommand,
        open: openTerminal,
        close: closeTerminal
    };
});
