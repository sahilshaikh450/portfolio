/* ========================= */
/* SAFE STORAGE HELPERS */
/* ========================= */

function readStorage(store, key) {
    try {
        return window[store].getItem(key);
    } catch (e) {
        return null;
    }
}

function writeStorage(store, key, value) {
    try {
        window[store].setItem(key, value);
    } catch (e) {
        /* storage blocked (private mode etc.) - ignore */
    }
}


/* ========================= */
/* THEME TOGGLE */
/* ========================= */

function syncThemeIcon() {

    const icon = document.getElementById("theme-icon");

    if (!icon) return;

    const isLight = document.body.classList.contains("light-mode");

    icon.classList.toggle("fa-sun", isLight);
    icon.classList.toggle("fa-moon", !isLight);

}

function toggleTheme() {

    document.body.classList.toggle("light-mode");

    const isLight = document.body.classList.contains("light-mode");

    writeStorage("localStorage", "theme", isLight ? "light" : "dark");

    syncThemeIcon();

}

(function initTheme() {

    if (readStorage("localStorage", "theme") === "light") {
        document.body.classList.add("light-mode");
    }

    syncThemeIcon();

    const toggle = document.getElementById("theme-toggle");

    if (toggle) toggle.addEventListener("click", toggleTheme);

})();


/* ========================= */
/* INTRO (once per session) */
/* ========================= */

(function initIntro() {

    const intro = document.getElementById("intro");

    if (!intro) return;

    if (readStorage("sessionStorage", "introShown")) {
        intro.remove();
        return;
    }

    writeStorage("sessionStorage", "introShown", "true");

    setTimeout(() => {

        intro.classList.add("hide-intro");

        setTimeout(() => intro.remove(), 500);

    }, 2400);

})();


/* ========================= */
/* NAVBAR SCROLL EFFECT */
/* ========================= */

(function initNavbar() {

    const nav = document.querySelector(".navbar");

    if (!nav) return;

    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 50);

    window.addEventListener("scroll", onScroll, { passive: true });

    onScroll();

})();


/* ========================= */
/* MOBILE MENU */
/* ========================= */

(function initMenu() {

    const nav = document.querySelector(".navbar");
    const toggle = document.getElementById("menu-toggle");

    if (!nav || !toggle) return;

    function setOpen(open) {
        nav.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));

    nav.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") setOpen(false);
    });

    document.addEventListener("click", e => {
        if (!nav.contains(e.target)) setOpen(false);
    });

    window.matchMedia("(min-width: 769px)").addEventListener("change", e => {
        if (e.matches) setOpen(false);
    });

})();


/* ========================= */
/* TIMELINE PROGRESS */
/* ========================= */

(function initTimeline() {

    const timeline = document.querySelector(".timeline");
    const progress = document.querySelector(".timeline-progress");

    if (!timeline || !progress) return;

    const items = timeline.querySelectorAll(".timeline-item");

    function update() {

        const rect = timeline.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const visible = windowHeight / 2 - rect.top;
        const percent = Math.min(Math.max(visible / rect.height, 0), 1) * 100;

        progress.style.height = percent + "%";

        items.forEach(item => {
            const top = item.getBoundingClientRect().top;
            item.classList.toggle("active", top < windowHeight / 2);
        });

    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    update();

})();


/* ========================= */
/* SCROLL REVEAL */
/* ========================= */

(function initReveal() {

    const groups = [
        ".page-header", ".tech-section > *", ".project-card", ".info-card", ".stat",
        ".photo-card", ".timeline-item", ".contact-card", ".panel",
        ".section-cta", ".footer-box > *"
    ];

    const items = document.querySelectorAll(groups.join(","));

    if (!("IntersectionObserver" in window)) return;

    // stagger siblings of the same kind (computed before classes change)
    const delays = Array.from(items, el => {
        const siblings = Array.from(el.parentElement.children).filter(c => c.className === el.className);
        return Math.min(Math.max(siblings.indexOf(el), 0), 6) * 0.08;
    });

    items.forEach((el, i) => {
        el.style.setProperty("--delay", delays[i] + "s");
        el.classList.add("reveal");
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    items.forEach(el => observer.observe(el));

})();


/* ========================= */
/* TYPING ROLE (home hero) */
/* ========================= */

(function initTyping() {

    const el = document.getElementById("typing");

    if (!el) return;

    const words = JSON.parse(el.dataset.words || "[]");

    if (!words.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let wordIndex = 0;
    let charIndex = words[0].length;
    let deleting = true;

    function tick() {

        const word = words[wordIndex];

        charIndex += deleting ? -1 : 1;
        el.textContent = word.slice(0, charIndex);

        let delay = deleting ? 45 : 85;

        if (!deleting && charIndex === word.length) {
            deleting = true;
            delay = 1800;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 350;
        }

        setTimeout(tick, delay);

    }

    setTimeout(tick, 2600);

})();


/* ========================= */
/* PROJECT CARD SPOTLIGHT */
/* ========================= */

document.querySelectorAll(".project-card").forEach(card => {

    card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - rect.left + "px");
        card.style.setProperty("--my", e.clientY - rect.top + "px");
    });

});

