document.addEventListener("DOMContentLoaded", () => {
    const $ = (id) => document.getElementById(id);

    const SHEETS_URL =
        "https://script.google.com/macros/s/AKfycbx8vCGbZMpzx06wDVemsT30ODxTCCU2W24XrmY7SfNqzg3_9tp8lsKE6-ddfTE5LQjnTw/exec";

    // ─── LOADER ─────────────────────────────────────────
    const loaderFill = $("loaderFill");
    const loaderStatus = $("loaderStatus");
    const loader = $("loader");

    const loadSteps = [
        { msg: "Booting kernel modules...", pct: 0 },
        { msg: "Loading cryptographic libraries...", pct: 25 },
        { msg: "Calibrating IoT sensor mesh...", pct: 50 },
        { msg: "Establishing TLS 1.3 tunnel...", pct: 75 },
        { msg: "Scanning for threats...", pct: 90 },
        { msg: "Access granted. Welcome.", pct: 100 },
    ];

    let step = 0;
    function advanceLoader() {
        if (!loader || !loaderFill || !loaderStatus) return;

        if (step >= loadSteps.length) {
            setTimeout(() => loader.classList.add("hide"), 900);
            return;
        }

        const { msg, pct } = loadSteps[step];
        loaderFill.style.width = pct + "%";
        loaderStatus.textContent = msg;
        step++;
        setTimeout(advanceLoader, step === loadSteps.length ? 1200 : 850);
    }
    advanceLoader();

    window.addEventListener("load", () => {
        if (loader) {
            setTimeout(() => loader.classList.add("hide"), 1800);
        }
    });

    // ─── CUSTOM CURSOR ──────────────────────────────────
    const cursorOuter = $("cursorOuter");
    const cursorDot = $("cursorDot");
    let mx = 0,
        my = 0,
        ox = 0,
        oy = 0;

    if (cursorOuter && cursorDot) {
        document.addEventListener("mousemove", (e) => {
            mx = e.clientX;
            my = e.clientY;
            cursorDot.style.left = mx + "px";
            cursorDot.style.top = my + "px";
        });

        (function tickCursor() {
            ox += (mx - ox) * 0.12;
            oy += (my - oy) * 0.12;
            cursorOuter.style.left = ox + "px";
            cursorOuter.style.top = oy + "px";
            requestAnimationFrame(tickCursor);
        })();

        document
            .querySelectorAll("a, button, .team-card, .event-card, .proj-card, .ach-card, .bitem")
            .forEach((el) => {
                el.addEventListener("mouseenter", () => {
                    cursorOuter.style.transform = "translate(-50%,-50%) scale(1.6)";
                    cursorOuter.style.borderColor = "var(--green)";
                });
                el.addEventListener("mouseleave", () => {
                    cursorOuter.style.transform = "translate(-50%,-50%) scale(1)";
                    cursorOuter.style.borderColor = "var(--cyan)";
                });
            });
    }

    // ─── NAVBAR ─────────────────────────────────────────
    const navbar = $("navbar");
    const hamburger = $("hamburger");
    const navLinks = $("navLinks");

    if (navbar) {
        window.addEventListener(
            "scroll",
            () => {
                navbar.classList.toggle("scrolled", window.scrollY > 60);
            },
            { passive: true }
        );
    }

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("open");
            hamburger.classList.toggle("open");
            document.body.classList.toggle("menu-open");
        });

        document.querySelectorAll(".nl").forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                hamburger.classList.remove("open");
                document.body.classList.remove("menu-open");
            });
        });
    }

    // ─── HERO NETWORK CANVAS ────────────────────────────
    (function initNetwork() {
        const canvas = $("networkCanvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener("resize", resize);

        const nodes = Array.from({ length: 70 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            r: Math.random() * 2 + 1,
            pulse: Math.random() * Math.PI * 2,
        }));

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 160) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0,229,255,${(1 - dist / 160) * 0.35})`;
                        ctx.lineWidth = 0.6;
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            nodes.forEach((n) => {
                n.pulse += 0.03;
                const glow = (Math.sin(n.pulse) + 1) / 2;
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r + glow * 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,255,136,${0.5 + glow * 0.5})`;
                ctx.fill();

                n.x += n.vx;
                n.y += n.vy;

                if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
                if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
            });

            requestAnimationFrame(draw);
        }
        draw();
    })();

    // ─── TYPING EFFECT ──────────────────────────────────
    (function initTyping() {
        const el = $("typeTarget");
        if (!el) return;

        const phrases = [
            "Securing IoT Devices...",
            "Analyzing Network Threats...",
            "Building Ethical Hackers...",
            "Encrypting Data Streams...",
            "Reverse Engineering Firmware...",
            "Running CTF Challenges...",
        ];

        let pi = 0,
            ci = 0,
            deleting = false;

        function tick() {
            const phrase = phrases[pi];

            if (!deleting) {
                el.textContent = phrase.slice(0, ++ci);
                if (ci === phrase.length) {
                    deleting = true;
                    setTimeout(tick, 1800);
                    return;
                }
            } else {
                el.textContent = phrase.slice(0, --ci);
                if (ci === 0) {
                    deleting = false;
                    pi = (pi + 1) % phrases.length;
                }
            }

            setTimeout(tick, deleting ? 40 : 80);
        }

        setTimeout(tick, 1200);
    })();

    // ─── COUNTDOWN ──────────────────────────────────────
    (function initCountdown() {
        const hEl = $("cd-h");
        const mEl = $("cd-m");
        const sEl = $("cd-s");

        if (!hEl || !mEl || !sEl) return;

        const target = new Date();
        target.setDate(target.getDate() );
        target.setHours(13, 0, 0, 0);

        const pad = (n) => String(n).padStart(2, "0");

        function tick() {
            const diff = target - Date.now();

            if (diff <= 0) {
                hEl.textContent = "00";
                mEl.textContent = "00";
                sEl.textContent = "00";
                return;
            }

            hEl.textContent = pad(Math.floor(diff / 3600000));
            mEl.textContent = pad(Math.floor((diff % 3600000) / 60000));
            sEl.textContent = pad(Math.floor((diff % 60000) / 1000));
        }

        tick();
        setInterval(tick, 1000);
    })();

    // ─── COUNTER ANIMATION ──────────────────────────────
    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const start = performance.now();

        function frame(now) {
            const progress = Math.min((now - start) / 2700, 1);
            const value = Math.floor(progress * target);
            el.textContent = value;

            if (progress < 1) {
                requestAnimationFrame(frame);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(frame);
    }

    (function initThreat() {
        const canvas = document.getElementById("threatCanvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight || 220;
        }
        resize();
        window.addEventListener("resize", resize);

        const COLORS = { attack: "#ff3a5c", scan: "#ffd700", secure: "#00ff88" };
        const types = ["attack", "attack", "scan", "scan", "secure", "secure", "secure"];

        function hexToRgba(hex, alpha) {
            const clean = hex.replace("#", "");
            const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
            const int = parseInt(full, 16);
            const r = (int >> 16) & 255;
            const g = (int >> 8) & 255;
            const b = int & 255;
            return `rgba(${r},${g},${b},${alpha})`;
        }

        const nodes = [
            { x: 0.5, y: 0.5, label: "Core", type: "secure" },
            ...Array.from({ length: 10 }, (_, i) => ({
                x: 0.1 + Math.random() * 0.8,
                y: 0.1 + Math.random() * 0.8,
                label: "Node " + (i + 1),
                type: types[Math.floor(Math.random() * types.length)],
            })),
        ];

        const packets = [];

        function spawnPacket() {
            const src = Math.floor(Math.random() * nodes.length);
            let dst = Math.floor(Math.random() * nodes.length);
            while (dst === src) dst = Math.floor(Math.random() * nodes.length);

            packets.push({
                sx: nodes[src].x,
                sy: nodes[src].y,
                ex: nodes[dst].x,
                ey: nodes[dst].y,
                t: 0,
                speed: 0.005 + Math.random() * 0.008,
                type: nodes[src].type,
                trail: [],
            });
        }

        let frame = 0;
        function draw() {
            const W = canvas.width;
            const H = canvas.height;

            ctx.fillStyle = "rgba(13,20,32,0.4)";
            ctx.fillRect(0, 0, W, H);

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = (nodes[i].x - nodes[j].x) * W;
                    const dy = (nodes[i].y - nodes[j].y) * H;
                    if (Math.sqrt(dx * dx + dy * dy) < 200) {
                        ctx.beginPath();
                        ctx.strokeStyle = "rgba(26,45,69,0.8)";
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(nodes[i].x * W, nodes[i].y * H);
                        ctx.lineTo(nodes[j].x * W, nodes[j].y * H);
                        ctx.stroke();
                    }
                }
            }

            packets.forEach((p, idx) => {
                p.t += p.speed;

                const px = (p.sx + (p.ex - p.sx) * p.t) * W;
                const py = (p.sy + (p.ey - p.sy) * p.t) * H;
                p.trail.push({ x: px, y: py });
                if (p.trail.length > 10) p.trail.shift();

                p.trail.forEach((pt, ti) => {
                    const alpha = (ti / p.trail.length) * 0.5;
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = hexToRgba(COLORS[p.type], alpha);
                    ctx.fill();
                });

                ctx.beginPath();
                ctx.arc(px, py, 4, 0, Math.PI * 2);
                ctx.fillStyle = COLORS[p.type];
                ctx.shadowColor = COLORS[p.type];
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowBlur = 0;

                if (p.t >= 1) packets.splice(idx, 1);
            });

            nodes.forEach((n) => {
                const nx = n.x * W;
                const ny = n.y * H;

                ctx.beginPath();
                ctx.arc(nx, ny, n.label === "Core" ? 10 : 6, 0, Math.PI * 2);
                ctx.fillStyle = COLORS[n.type];
                ctx.shadowColor = COLORS[n.type];
                ctx.shadowBlur = 12;
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.beginPath();
                ctx.arc(nx, ny, n.label === "Core" ? 16 : 10, 0, Math.PI * 2);
                ctx.strokeStyle = COLORS[n.type];
                ctx.globalAlpha = 0.25;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.globalAlpha = 1;
            });

            if (frame % 30 === 0 && packets.length < 12) spawnPacket();
            frame++;
            requestAnimationFrame(draw);
        }

        setInterval(() => {
            const n = nodes[Math.floor(Math.random() * nodes.length)];
            if (n.label !== "Core") {
                n.type = types[Math.floor(Math.random() * types.length)];
            }
        }, 2000);

        draw();
    })();

    // Event Slider Functionality
    function initEventSlider() {
        const sliderContainer = document.getElementById("eventsSlider");
        const prevBtn = document.getElementById("prevEvent");
        const nextBtn = document.getElementById("nextEvent");
        const eventCards = document.querySelectorAll(".event-card");

        if (!sliderContainer || !prevBtn || !nextBtn || !eventCards.length) return;

        let currentSlide = 0;

        function updateSliderPosition() {
            const translateX = -currentSlide * 100;
            sliderContainer.style.transform = `translateX(${translateX}%)`;
        }

        updateSliderPosition();

        nextBtn.addEventListener("click", () => {
            currentSlide = (currentSlide + 1) % eventCards.length;
            updateSliderPosition();
        });

        prevBtn.addEventListener("click", () => {
            currentSlide = (currentSlide - 1 + eventCards.length) % eventCards.length;
            updateSliderPosition();
        });

        setInterval(() => {
            currentSlide = (currentSlide + 1) % eventCards.length;
            updateSliderPosition();
        }, 5000);
    }
    initEventSlider();

    // ─── JOIN FORM ──────────────────────────────────────
    const joinForm = $("joinForm");
    const toast = $("toast");

    function showToast(msg, isError = false) {
        if (!toast) {
            alert(msg);
            return;
        }

        toast.textContent = msg;
        toast.style.borderColor = isError ? "var(--red)" : "var(--green)";
        toast.style.color = isError ? "var(--red)" : "var(--green)";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 4500);
    }

    if (joinForm) {
        joinForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const btn = this.querySelector(".submit-btn");
            const inputs = [...this.querySelectorAll("input, select, textarea")];
            const [nameEl, emailEl, idEl, interestEl, expEl, whyEl] = inputs;

            const payload = {
                name: nameEl?.value.trim() || "",
                email: emailEl?.value.trim() || "",
                studentId: idEl?.value.trim() || "",
                interest: interestEl?.value || "",
                experience: expEl?.value || "",
                why: whyEl?.value.trim() || "",
            };

            if (!SHEETS_URL || SHEETS_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
                showToast("⚠ Sheet URL not configured.", true);
                return;
            }

            if (btn) {
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>&nbsp;Submitting...';
                btn.disabled = true;
            }

            inputs.forEach((i) => (i.disabled = true));

            try {
                await fetch(SHEETS_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                showToast("✓ Application submitted!");
                this.reset();
            } catch (err) {
                console.error(err);
                showToast("✗ Submission failed.", true);
            } finally {
                if (btn) {
                    btn.innerHTML = '<span>Execute Join Request</span><i class="fas fa-paper-plane"></i>';
                    btn.disabled = false;
                }

                inputs.forEach((i) => (i.disabled = false));
            }
        });
    }

    // ─── ACTIVE NAV LINK ────────────────────────────────
    const sections = document.querySelectorAll("section[id]");
    const navAnchors = document.querySelectorAll(".nl");

    if (sections.length && navAnchors.length) {
        window.addEventListener(
            "scroll",
            () => {
                let current = "";
                sections.forEach((s) => {
                    if (window.scrollY >= s.offsetTop - 100) current = s.id;
                });

                navAnchors.forEach((a) => {
                    a.classList.toggle("active", a.getAttribute("href") === "#" + current);
                });
            },
            { passive: true }
        );
    }

    document.querySelectorAll(".stat-num").forEach(animateCounter);
});
