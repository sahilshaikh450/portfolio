/* ========================= */
/* THEME TOGGLE */
/* ========================= */

function toggleTheme() {

    const body = document.body;
    const icon = document.getElementById("theme-icon");

    body.classList.toggle("light-mode");

    if (body.classList.contains("light-mode")) {

        localStorage.setItem("theme", "light");

        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");

    } else {

        localStorage.setItem("theme", "dark");

        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");

    }

}


/* ========================= */
/* LOAD SAVED THEME */
/* ========================= */

document.addEventListener("DOMContentLoaded", function () {

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
/* INTRO SIGNATURE ANIMATION */
/* ========================= */

/* INTRO ANIMATION ONLY ON FIRST LOAD */

/* INTRO ANIMATION CONTROL */

window.addEventListener("load", function () {

    const intro = document.getElementById("intro");

    // detect if page loaded by refresh
    const isReload =
        performance.getEntriesByType("navigation")[0].type === "reload";

    // detect if coming from another page
    const isFirstVisit = !sessionStorage.getItem("visited");

    if (isFirstVisit || isReload) {

        // mark visited
        sessionStorage.setItem("visited", "true");

        // show animation
        setTimeout(function () {

            intro.style.opacity = "0";

            setTimeout(function () {

                intro.style.display = "none";

            }, 800);

        }, 2500);

    } else {

        // skip animation
        intro.style.display = "none";

    }

});