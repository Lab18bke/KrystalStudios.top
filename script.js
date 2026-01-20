document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.service-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.service-nav-btn.prev');
    const nextBtn = document.querySelector('.service-nav-btn.next');

    let currentIndex = 0;
    let autoPlayInterval;
    let touchStartX = 0;
    let touchEndX = 0;

    function updateCards(newIndex, direction = 'next') {
        const prevIndex = currentIndex;
        currentIndex = newIndex;

        cards.forEach((card, i) => {
            card.classList.remove('active', 'prev');

            if (i === currentIndex) {
                card.classList.add('active');
            } else if (i === prevIndex) {
                if (direction === 'next') {
                    card.classList.add('prev');
                }
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function nextCard() {
        const newIndex = (currentIndex + 1) % cards.length;
        updateCards(newIndex, 'next');
    }

    function prevCard() {
        const newIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCards(newIndex, 'prev');
    }

    function goToCard(index) {
        const direction = index > currentIndex ? 'next' : 'prev';
        updateCards(index, direction);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextCard, 4000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }

    nextBtn.addEventListener('click', () => {
        nextCard();
        startAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
        prevCard();
        startAutoPlay();
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goToCard(i);
            startAutoPlay();
        });
    });

    const showcase = document.querySelector('.service-showcase');

    showcase.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });

    showcase.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextCard();
            } else {
                prevCard();
            }
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextCard();
            startAutoPlay();
        } else if (e.key === 'ArrowLeft') {
            prevCard();
            startAutoPlay();
        }
    });

    showcase.addEventListener('mouseenter', stopAutoPlay);
    showcase.addEventListener('mouseleave', startAutoPlay);

    cards[0].classList.add('active');
    dots[0].classList.add('active');

    startAutoPlay();

    const ctaBtn = document.querySelector('.cta-btn');
    ctaBtn.addEventListener('mouseenter', () => {
        ctaBtn.style.transform = 'translateY(-3px) scale(1.02)';
    });
    ctaBtn.addEventListener('mouseleave', () => {
        ctaBtn.style.transform = '';
    });

    const glows = document.querySelectorAll('.glow');
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 20;

        glows.forEach((glow, i) => {
            const factor = i === 0 ? 1 : -1;
            glow.style.transform = `translate(${mouseX * factor}px, ${mouseY * factor}px)`;
        });
    });

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
        stopAutoPlay();
    }

    function closeTerminal() {
        terminalOverlay.classList.remove('active');
        startAutoPlay();
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
                addOutput('  • Sys-Admin', 'response');
                addOutput('  • Minecraft Server Development', 'response');
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
