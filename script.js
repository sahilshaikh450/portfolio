/* ========================= */
/* THEME TOGGLE */
/* ========================= */

function toggleTheme() {

    const body = document.body;
    const icon = document.getElementById("theme-icon");

    body.classList.toggle("light-mode");

    if (body.classList.contains("light-mode")) {

        localStorage.setItem("theme", "light");

        if (icon) {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        }

    } else {

        localStorage.setItem("theme", "dark");

        if (icon) {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
        }

    }

}


/* ========================= */
/* LOAD SAVED THEME */
/* ========================= */

document.addEventListener("DOMContentLoaded", () => {

    const savedTheme = localStorage.getItem("theme");
    const icon = document.getElementById("theme-icon");

    if (savedTheme === "light") {

        document.body.classList.add("light-mode");

        if (icon) {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        }

    }

});


/* ========================= */
/* FINAL INTRO ANIMATION */
/* ========================= */

/* ========================= */
/* SMART INTRO CONTROL */
/* ========================= */

document.addEventListener("DOMContentLoaded", () => {

    const intro = document.getElementById("intro");

    if (!intro) return;

    // detect refresh
    const nav =
        performance.getEntriesByType("navigation")[0];

    const isReload = nav && nav.type === "reload";

    // detect normal page navigation
    const fromInternalNavigation =
        sessionStorage.getItem("internalNavigation");

    // if coming from another section
    if (fromInternalNavigation && !isReload) {

        intro.style.display = "none";

        return;

    }

    // play intro
    setTimeout(() => {

        intro.classList.add("hide-intro");

        setTimeout(() => {

            intro.style.display = "none";

        }, 300);

    }, 1800);

});


/* ========================= */
/* INTERNAL NAVIGATION */
/* ========================= */

document.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

        sessionStorage.setItem(
            "internalNavigation",
            "true"
        );

    });

});

/* ========================= */
/* PARTICLE SYSTEM */
/* ========================= */

(function initParticles() {

    const canvas = document.getElementById("particle-canvas");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let W, H;

    let particles = [];

    let mouse = {
        x: -9999,
        y: -9999
    };

    function resize() {

        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;

    }

    resize();

    window.addEventListener("resize", resize);

    function createParticle() {

        return {

            x: Math.random() * W,
            y: Math.random() * H,

            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,

            size: Math.random() * 2 + 0.5,

            opacity: Math.random() * 0.5 + 0.1,

            color:
                Math.random() > 0.5
                    ? "108,99,255"
                    : Math.random() > 0.5
                    ? "255,77,166"
                    : "0,212,255"

        };

    }

    for (let i = 0; i < 80; i++) {

        particles.push(createParticle());

    }

    document.addEventListener("mousemove", e => {

        mouse.x = e.clientX;
        mouse.y = e.clientY;

    });

    function draw() {

        ctx.clearRect(0, 0, W, H);

        particles.forEach((p, i) => {

            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;

            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {

                p.x += (dx / dist) * 1.5;
                p.y += (dy / dist) * 1.5;

            }

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;

            ctx.beginPath();

            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

            ctx.fillStyle = `rgba(${p.color},${p.opacity})`;

            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {

                const q = particles[j];

                const dx2 = p.x - q.x;
                const dy2 = p.y - q.y;

                const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                if (d2 < 120) {

                    ctx.beginPath();

                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);

                    ctx.strokeStyle =
                        `rgba(108,99,255,${0.08 * (1 - d2 / 120)})`;

                    ctx.lineWidth = 0.5;

                    ctx.stroke();

                }

            }

        });

        requestAnimationFrame(draw);

    }

    draw();

})();


/* ========================= */
/* CUSTOM CURSOR */
/* ========================= */

(function initCursor() {

    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");

    if (!dot || !ring) return;

    let mx = 0;
    let my = 0;

    let rx = 0;
    let ry = 0;

    document.addEventListener("mousemove", e => {

        mx = e.clientX;
        my = e.clientY;

        dot.style.left = mx + "px";
        dot.style.top = my + "px";

    });

    function animateRing() {

        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;

        ring.style.left = rx + "px";
        ring.style.top = ry + "px";

        requestAnimationFrame(animateRing);

    }

    animateRing();

})();


/* ========================= */
/* TYPING ANIMATION */
/* ========================= */

(function initTyping() {

    const el = document.getElementById("typing");

    if (!el) return;

    const words = [
        "Java Developer",
        "Full Stack Engineer",
        "MCA Student",
        "Problem Solver",
        "React Developer"
    ];

    let wi = 0;
    let ci = 0;

    let deleting = false;

    function type() {

        const word = words[wi];

        el.textContent = deleting
            ? word.slice(0, ci--)
            : word.slice(0, ci++);

        let delay = deleting ? 60 : 100;

        if (!deleting && ci > word.length) {

            deleting = true;
            delay = 1500;

        }

        else if (deleting && ci < 0) {

            deleting = false;

            wi = (wi + 1) % words.length;

            ci = 0;

            delay = 400;

        }

        setTimeout(type, delay);

    }

    type();

})();


/* ========================= */
/* NAVBAR SCROLL EFFECT */
/* ========================= */

(function initNavbar() {

    const nav = document.querySelector(".navbar");

    if (!nav) return;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            nav.classList.add("scrolled");

        } else {

            nav.classList.remove("scrolled");

        }

    });

})();


/* ========================= */
/* SMOOTH SCROLL */
/* ========================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            e.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});
