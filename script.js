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
