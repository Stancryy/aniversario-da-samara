const LOADING_SCREEN_DELAY = 3000;
const LOADING_REMOVE_DELAY = 1000;
const TYPING_SPEED = 45;
const COUNTER_INTERVAL = 1000;
const SCROLL_DOT_DEBOUNCE = 50;
const AUTO_SCROLL_DELAY = 900;
const CONFETTI_DURATION = 4000;
const CONFETTI_INTERVAL = 80;
const RUNAWAY_PROXIMITY = 60;
const RUNAWAY_PADDING = 20;
const SHOOTING_STAR_MIN_INTERVAL = 4000;
const SHOOTING_STAR_MAX_INTERVAL = 10000;

const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function getAudioCtx() {
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => { });
    }
    return audioCtx;
}
document.addEventListener('userEnteredSite', () => {
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
});
window.addEventListener('beforeunload', () => {
    if (audioCtx) {
        audioCtx.close();
        audioCtx = null;
    }
});

function playSoftClick() {
    try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) { }
}

let lastTypeSoundTime = 0;
function playTypeSound() {
    const now = performance.now();
    if (now - lastTypeSoundTime < 80) return;
    lastTypeSoundTime = now;

    try {
        const ctx = getAudioCtx();
        const bufferSize = ctx.sampleRate * 0.02;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }

        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        source.buffer = buffer;
        filter.type = 'bandpass';
        filter.frequency.value = 2000 + Math.random() * 1000;
        filter.Q.value = 2;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

        source.start(ctx.currentTime);
        source.stop(ctx.currentTime + 0.03);
    } catch (e) { }
}

function playToggleSound() {
    try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
    } catch (e) { }
}

function playSuccessChime() {
    try {
        const ctx = getAudioCtx();
        const notes = [523, 659, 784, 1047];

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.value = freq;
            const startTime = ctx.currentTime + i * 0.12;
            gain.gain.setValueAtTime(0.15, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

            osc.start(startTime);
            osc.stop(startTime + 0.4);
        });
    } catch (e) { }
}

function playBlowSound() {
    try {
        const ctx = getAudioCtx();
        const bufferSize = ctx.sampleRate * 0.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
        }

        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        source.buffer = buffer;
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        filter.Q.value = 1;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        source.start(ctx.currentTime);
        source.stop(ctx.currentTime + 0.5);
    } catch (e) { }
}

document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
    initLoadingScreen();
    initScrollReveal();
    initCarouselDots();
    initSwipeHint();
    initTiltEffect();
    initTimeCounter();
    initReasons();
    initTypewriter();
    initMusicPlayer();
    initThemeToggle();
    initProposalButtons();
    initStars();
    initTimeline();
    initCake();
    initSecretEnvelope();
    initCursorParticles();
    initShootingStars();
    initAudioVisualizer();
});

function initLoadingScreen() {
    const screen = document.getElementById('loading-screen');
    const enterBtn = document.getElementById('loading-enter-btn');
    const loadingDots = document.getElementById('loading-dots');
    if (!screen) return;
    setTimeout(() => {
        if (loadingDots) loadingDots.style.display = 'none';
        if (enterBtn) {
            enterBtn.style.display = 'inline-flex';
            enterBtn.style.animation = 'fadeInUp 0.5s ease forwards';
        }
    }, 2000);
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            screen.classList.add('hidden');
            document.body.classList.add('loaded');
            document.dispatchEvent(new CustomEvent('userEnteredSite'));

            setTimeout(() => {
                screen.remove();
            }, LOADING_REMOVE_DELAY);
        });
    }
}

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
}

function initCarouselDots() {
    const carousel = document.getElementById('carousel');
    const cards = document.querySelectorAll('.memory-card');
    const dotsContainer = document.getElementById('carousel-dots');

    if (!carousel || !cards.length || !dotsContainer) return;

    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Memória ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollLeft = carousel.scrollLeft;
            const cardWidth = cards[0].offsetWidth + 20;
            const activeIndex = Math.round(scrollLeft / cardWidth);
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIndex);
            });
        }, SCROLL_DOT_DEBOUNCE);
    });
}

function initSwipeHint() {
    const hint = document.getElementById('swipe-hint');
    const carousel = document.getElementById('carousel');
    if (!hint || !carousel) return;
    carousel.addEventListener('scroll', () => {
        hint.classList.add('hidden');
    }, { once: true });
    setTimeout(() => {
        hint.classList.add('hidden');
    }, 5000);
}

function initTiltEffect() {
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => handleTilt(e, card));
        card.addEventListener('mouseleave', () => resetTilt(card));
        card.addEventListener(
            'touchmove',
            (e) => { handleTilt(e.touches[0], card); },
            { passive: true }
        );
        card.addEventListener('touchend', () => resetTilt(card));
    });
}

function handleTilt(event, card) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((event.clientY - centerY) / (rect.height / 2)) * -8;
    const rotateY = ((event.clientX - centerX) / (rect.width / 2)) * 8;
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
}

function resetTilt(card) {
    card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
}

function initTimeCounter() {
    const startDate = new Date(Date.UTC(2026, 0, 19, 3, 0, 0));

    const daysEl = document.getElementById('counter-days');
    const hoursEl = document.getElementById('counter-hours');
    const minutesEl = document.getElementById('counter-minutes');
    const secondsEl = document.getElementById('counter-seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function update() {
        const now = new Date();
        const diff = Math.max(0, now - startDate);

        if (diff === 0) {
            daysEl.textContent = '...';
            hoursEl.textContent = '...';
            minutesEl.textContent = '...';
            secondsEl.textContent = '❤️';
            return;
        }

        const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        daysEl.textContent = totalDays;
        hoursEl.textContent = hours;
        minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
        secondsEl.textContent = secs < 10 ? '0' + secs : secs;
    }

    update();
    setInterval(update, COUNTER_INTERVAL);
}

function initReasons() {
    const buttons = document.querySelectorAll('.reason-btn');
    const textEl = document.getElementById('reason-text');

    if (!buttons.length || !textEl) return;

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            playSoftClick();
            btn.classList.add('revealed');
            btn.setAttribute('aria-expanded', 'true');
            const reason = btn.getAttribute('data-reason');
            textEl.textContent = reason;

            textEl.style.animation = 'none';
            textEl.offsetHeight;
            textEl.style.animation = 'fadeInUp 0.4s ease forwards';
        });
    });
}

function initTypewriter() {
    const letterBody = document.getElementById('letter-body');
    const letterCursor = document.getElementById('letter-cursor');
    const letterSection = document.getElementById('letter-section');

    if (!letterBody || !letterSection) return;
    const letterText =
        `Samara,\n\n` +
        `Se eu pudesse guardar todos os momentos que passei ao seu lado em um frasco de vidro, ele seria o meu bem mais precioso.\n\n` +
        `Você chegou na minha vida de um jeito que eu não esperava, e de repente tudo começou a fazer mais sentido.\n\n` +
        `Cada risada sua é a minha música favorita. Cada olhar seu me faz sentir que eu estou exatamente onde deveria estar.\n\n` +
        `Eu não sei o que o futuro reserva, mas sei que eu quero viver ele do seu lado.\n\n` +
        `Com todo o meu coração,\nSeu admirador 💖`;

    let charIndex = 0;
    let hasStarted = false;
    let isComplete = false;
    let typingInterval = null;
    let typeSoundCounter = 0;
    let isPaused = false;
    let textBuffer = '';
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && typingInterval) {
            clearInterval(typingInterval);
            typingInterval = null;
            isPaused = true;
        } else if (isPaused && hasStarted && !isComplete) {
            isPaused = false;
            startTyping();
        }
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasStarted) {
                    hasStarted = true;
                    startTyping();
                }
            });
        },
        { threshold: 0.3 }
    );

    observer.observe(letterSection);

    function startTyping() {
        if (typingInterval) clearInterval(typingInterval);

        typingInterval = setInterval(() => {
            if (charIndex < letterText.length) {
                const char = letterText[charIndex];
                textBuffer += char;
                charIndex++;
                if (charIndex % 3 === 0 || char === '\n' || charIndex >= letterText.length) {
                    letterBody.textContent = textBuffer;
                }
                if (char !== ' ' && char !== '\n') {
                    typeSoundCounter++;
                    if (typeSoundCounter % 3 === 0) {
                        playTypeSound();
                    }
                }

                const paper = letterBody.closest('.letter-paper');
                if (paper) {
                    paper.scrollTop = paper.scrollHeight;
                }
            } else {
                clearInterval(typingInterval);
                typingInterval = null;
                isComplete = true;
                letterBody.textContent = textBuffer;
                if (letterCursor) letterCursor.classList.add('hidden');
            }
        }, TYPING_SPEED);
    }
}

function initMusicPlayer() {
    const btn = document.getElementById('music-btn');
    const audio = document.getElementById('bg-music');
    const label = document.getElementById('music-label');
    const prevBtn = document.getElementById('music-prev');
    const nextBtn = document.getElementById('music-next');

    if (!btn || !audio) return;

    audio.volume = 0.04;
    const playlist = [
        { file: 'Heart_s_Embrace.mp3', name: "Heart's Embrace" },
        { file: 'Midnight_Bloom.mp3', name: 'Midnight Bloom' },
        { file: 'Midnight_Velvet_Serenade.mp3', name: 'Velvet Serenade' },
        { file: 'Moonlit_Reverie.mp3', name: 'Moonlit Reverie' },
    ];

    let currentTrack = 0;
    let isPlaying = false;

    function loadTrack(index) {
        currentTrack = index;
        audio.src = playlist[index].file;
        audio.load();
        if (label) label.textContent = playlist[index].name;
    }

    function playTrack() {
        audio.play().then(() => {
            btn.classList.add('playing');
            if (label) label.textContent = playlist[currentTrack].name;
            isPlaying = true;
        }).catch(() => {
            if (label) label.textContent = 'Toque aqui ♪';
            isPlaying = false;
        });
    }

    function nextTrack() {
        playSoftClick();
        currentTrack = (currentTrack + 1) % playlist.length;
        loadTrack(currentTrack);
        if (isPlaying) playTrack();
    }

    function prevTrack() {
        playSoftClick();
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
        } else {
            currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
            loadTrack(currentTrack);
        }
        if (isPlaying) playTrack();
    }
    document.addEventListener('userEnteredSite', () => {
        playTrack();
    });
    btn.addEventListener('click', (e) => {
        playSoftClick();
        if (isPlaying) {
            audio.pause();
            btn.classList.remove('playing');
            if (label) label.textContent = playlist[currentTrack].name;
            isPlaying = false;
        } else {
            playTrack();
        }
    });
    if (nextBtn) nextBtn.addEventListener('click', nextTrack);
    if (prevBtn) prevBtn.addEventListener('click', prevTrack);
    audio.addEventListener('ended', nextTrack);
    if (label) label.textContent = playlist[0].name;
}

function initAudioVisualizer() {
    const audio = document.getElementById('bg-music');
    const visualizer = document.getElementById('audio-visualizer');
    const bars = visualizer ? visualizer.querySelectorAll('.viz-bar') : [];

    if (!audio || !visualizer || !bars.length) return;

    let vizAnimId = null;
    function animateVizFallback() {
        bars.forEach((bar) => {
            const height = Math.max(3, Math.random() * 18 + 2);
            bar.style.height = `${height}px`;
        });

        vizAnimId = requestAnimationFrame(animateVizFallback);
    }
    audio.addEventListener('play', () => {
        visualizer.classList.add('active');
        animateVizFallback();
    });

    audio.addEventListener('pause', () => {
        visualizer.classList.remove('active');
        if (vizAnimId) cancelAnimationFrame(vizAnimId);
        vizAnimId = null;
    });

    audio.addEventListener('ended', () => {
        visualizer.classList.remove('active');
        if (vizAnimId) cancelAnimationFrame(vizAnimId);
        vizAnimId = null;
    });
}

function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const label = document.getElementById('toggle-label');

    if (!toggle) return;

    const activate = () => {
        const isActive = toggle.getAttribute('aria-checked') === 'true';
        if (isActive) return;

        playToggleSound();
        toggle.setAttribute('aria-checked', 'true');
        document.body.classList.add('dark-theme');
        if (label) label.textContent = 'Tema Romântico ✨';

        setTimeout(() => {
            const proposal = document.getElementById('proposal');
            if (proposal) {
                proposal.scrollIntoView({ behavior: 'smooth' });
            }
        }, AUTO_SCROLL_DELAY);
    };

    toggle.addEventListener('click', activate);
    toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activate();
        }
    });
}

function initProposalButtons() {
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const successMsg = document.getElementById('success-message');
    const proposalButtons = document.querySelector('.proposal-buttons');

    if (!btnYes || !btnNo) return;
    btnYes.addEventListener('click', () => {
        playSuccessChime();
        if (proposalButtons) proposalButtons.style.display = 'none';
        if (successMsg) successMsg.classList.add('visible');
        fireConfetti();
    });
    let hasRunAway = false;

    function runAway() {
        playSoftClick();

        if (!hasRunAway) {
            hasRunAway = true;
            btnNo.classList.add('runaway');
        }

        const btnWidth = btnNo.offsetWidth;
        const btnHeight = btnNo.offsetHeight;
        const vw = (window.visualViewport ? window.visualViewport.width : window.innerWidth);
        const vh = (window.visualViewport ? window.visualViewport.height : window.innerHeight);

        const maxX = vw - btnWidth - RUNAWAY_PADDING;
        const maxY = vh - btnHeight - RUNAWAY_PADDING;

        btnNo.style.left = `${Math.max(RUNAWAY_PADDING, Math.random() * maxX)}px`;
        btnNo.style.top = `${Math.max(RUNAWAY_PADDING, Math.random() * maxY)}px`;
    }

    btnNo.addEventListener('mouseenter', runAway);
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        runAway();
    }, { passive: false });

    document.addEventListener('mousemove', (e) => {
        if (!hasRunAway) return;
        const rect = btnNo.getBoundingClientRect();
        const isNear =
            e.clientX > rect.left - RUNAWAY_PROXIMITY &&
            e.clientX < rect.right + RUNAWAY_PROXIMITY &&
            e.clientY > rect.top - RUNAWAY_PROXIMITY &&
            e.clientY < rect.bottom + RUNAWAY_PROXIMITY;
        if (isNear) runAway();
    });
}

function fireConfetti() {
    if (typeof confetti !== 'function') return;

    const end = Date.now() + CONFETTI_DURATION;
    const colors = ['#e8445a', '#d63352', '#f2788a', '#ff9eae', '#ffc4ce'];

    confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 }, colors });

    const interval = setInterval(() => {
        if (Date.now() > end) { clearInterval(interval); return; }
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
    }, CONFETTI_INTERVAL);
}

function initStars() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let stars = [];
    let starsAnimId = null;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createStars() {
        stars = [];
        const count = Math.floor((canvas.width * canvas.height) / 6000);
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.8 + 0.3,
                alpha: Math.random() * 0.6 + 0.2,
                speed: Math.random() * 0.008 + 0.002,
                direction: Math.random() > 0.5 ? 1 : -1,
            });
        }
    }

    function draw() {
        if (!document.body.classList.contains('dark-theme')) {
            starsAnimId = null;
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach((star) => {
            star.alpha += star.speed * star.direction;
            if (star.alpha >= 1) { star.alpha = 1; star.direction = -1; }
            else if (star.alpha <= 0.1) { star.alpha = 0.1; star.direction = 1; }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 220, 255, ${star.alpha})`;
            ctx.fill();
        });

        starsAnimId = requestAnimationFrame(draw);
    }
    function startStars() {
        if (!starsAnimId) {
            starsAnimId = requestAnimationFrame(draw);
        }
    }

    function stopStars() {
        if (starsAnimId) {
            cancelAnimationFrame(starsAnimId);
            starsAnimId = null;
        }
    }
    const themeObserver = new MutationObserver(() => {
        if (document.body.classList.contains('dark-theme')) {
            startStars();
        } else {
            stopStars();
        }
    });

    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopStars();
        } else if (document.body.classList.contains('dark-theme')) {
            startStars();
        }
    });

    resize();
    createStars();

    window.addEventListener('resize', () => {
        resize();
        createStars();
    });
}

function initTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.3, rootMargin: '0px 0px -60px 0px' }
    );

    items.forEach((item) => observer.observe(item));
}

function initCake() {
    const blowBtn = document.getElementById('blow-btn');
    const candles = document.querySelectorAll('.candle');
    const cakeMessage = document.getElementById('cake-message');

    if (!blowBtn || !candles.length) return;

    let hasBlown = false;
    blowBtn.addEventListener('click', async () => {
        if (hasBlown) return;
        let usedMic = false;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const ctx = getAudioCtx();
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);

            const data = new Uint8Array(analyser.frequencyBinCount);
            let checkCount = 0;

            blowBtn.textContent = '🌬️ Sopre agora!';

            const checkBlow = setInterval(() => {
                analyser.getByteFrequencyData(data);
                const avg = data.reduce((a, b) => a + b, 0) / data.length;
                checkCount++;

                if (avg > 30 || checkCount > 60) {
                    clearInterval(checkBlow);
                    stream.getTracks().forEach(t => t.stop());
                    blowOutCandles();
                    usedMic = true;
                }
            }, 50);
        } catch (e) {
            if (!usedMic) {
                blowOutCandles();
            }
        }
    });

    function blowOutCandles() {
        if (hasBlown) return;
        hasBlown = true;

        playBlowSound();
        candles.forEach((candle, i) => {
            setTimeout(() => {
                candle.setAttribute('data-lit', 'false');
            }, i * 300);
        });

        blowBtn.classList.add('blown');
        blowBtn.textContent = '🕯️ Soprado!';
        setTimeout(() => {
            if (cakeMessage) {
                cakeMessage.textContent = 'Pedido feito! Que todos os seus sonhos se realizem! ✨💖';
            }
        }, candles.length * 300 + 500);
    }
}

function initSecretEnvelope() {
    const envelope = document.getElementById('secret-envelope');
    const couponCard = document.getElementById('coupon-card');

    if (!envelope || !couponCard) return;

    let isOpened = false;

    function openEnvelope() {
        if (isOpened) return;
        isOpened = true;

        playSoftClick();
        envelope.classList.add('opened');

        setTimeout(() => {
            couponCard.classList.add('visible');
        }, 600);
    }

    envelope.addEventListener('click', openEnvelope);
    envelope.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openEnvelope();
        }
    });
}

function initCursorParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleAnimId = null;
    let mouseX = 0;
    let mouseY = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (document.body.classList.contains('dark-theme')) {
            spawnParticle(mouseX, mouseY);
        }
    });

    document.addEventListener('touchmove', (e) => {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        if (document.body.classList.contains('dark-theme')) {
            spawnParticle(mouseX, mouseY);
        }
    }, { passive: true });

    function spawnParticle(x, y) {
        if (particles.length > 50) return;

        particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 1,
            alpha: 1,
            size: Math.random() * 3 + 1,
            color: Math.random() > 0.5 ? '232, 68, 90' : '242, 120, 138',
            decay: 0.02 + Math.random() * 0.02,
        });

        if (!particleAnimId) {
            animateParticles();
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles = particles.filter(p => p.alpha > 0);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.alpha * 0.3})`;
            ctx.fill();
        });

        if (particles.length > 0) {
            particleAnimId = requestAnimationFrame(animateParticles);
        } else {
            particleAnimId = null;
        }
    }
}

function initShootingStars() {
    let shootingStarTimeout = null;

    function createShootingStar() {
        if (!document.body.classList.contains('dark-theme')) {
            scheduleNext();
            return;
        }

        const star = document.createElement('div');
        star.className = 'shooting-star';

        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * (window.innerHeight * 0.4);
        const angle = 30 + Math.random() * 30;
        const distance = 200 + Math.random() * 300;

        star.style.left = `${startX}px`;
        star.style.top = `${startY}px`;
        const rad = (angle * Math.PI) / 180;
        star.style.setProperty('--angle', `${angle}deg`);
        if (star.querySelector || star.style) {
            star.style.cssText += `
                left: ${startX}px;
                top: ${startY}px;
                transition: transform 0.8s linear, opacity 0.8s ease;
            `;
        }

        document.body.appendChild(star);
        requestAnimationFrame(() => {
            const endX = Math.cos(rad) * distance;
            const endY = Math.sin(rad) * distance;
            star.style.transform = `translate(${endX}px, ${endY}px)`;
            star.style.opacity = '0';
        });
        setTimeout(() => {
            star.remove();
            if (Math.random() < 0.2 && document.body.classList.contains('dark-theme')) {
                showWishModal();
            }
        }, 1000);

        scheduleNext();
    }

    function scheduleNext() {
        const delay = SHOOTING_STAR_MIN_INTERVAL +
            Math.random() * (SHOOTING_STAR_MAX_INTERVAL - SHOOTING_STAR_MIN_INTERVAL);
        shootingStarTimeout = setTimeout(createShootingStar, delay);
    }
    const observer = new MutationObserver(() => {
        if (document.body.classList.contains('dark-theme') && !shootingStarTimeout) {
            scheduleNext();
        }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}

let wishShown = false;

function showWishModal() {
    if (wishShown) return;
    wishShown = true;
    const overlay = document.createElement('div');
    overlay.className = 'wish-overlay';
    overlay.innerHTML = `
        <div class="wish-card">
            <h3>🌠 Estrela cadente!</h3>
            <p>Faça um pedido secreto...</p>
            <input type="text" class="wish-input" placeholder="Seu pedido..." maxlength="100" />
            <button class="wish-btn">Enviar ao universo ✨</button>
        </div>
    `;

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.classList.add('visible');
    });

    const input = overlay.querySelector('.wish-input');
    const btn = overlay.querySelector('.wish-btn');

    btn.addEventListener('click', () => {
        playSoftClick();
        overlay.classList.remove('visible');
        setTimeout(() => overlay.remove(), 400);
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.remove(), 400);
        }
    });
    setTimeout(() => input.focus(), 400);
}
