const menu=document.querySelector('.menu'),open=document.querySelector('.menu-toggle'),close=document.querySelector('.menu-close');
function closeMenu(){menu.classList.remove('open');open.setAttribute('aria-expanded','false');menu.setAttribute('aria-hidden','true')}
open.addEventListener('click',()=>{menu.classList.add('open');
open.setAttribute('aria-expanded','true');
menu.setAttribute('aria-hidden','false')});
close.addEventListener('click',closeMenu);
document.querySelectorAll('.menu a').forEach(a=>a.addEventListener('click',closeMenu));
const reveals=document.querySelectorAll('.reveal');
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});reveals.forEach(x=>io.observe(x));
const progress=document.querySelector('.progress span');
window.addEventListener('scroll',()=>{const h=document.documentElement.scrollHeight-innerHeight;
progress.style.height=`${Math.min(100,scrollY/h*100)}%`},{passive:true});
const dot=document.querySelector('.cursor-dot');
window.addEventListener('pointermove',e=>{dot.style.left=e.clientX+'px';
dot.style.top=e.clientY+'px'});

// Cursor nur bei den vier Social-/CTA-Elementen ausblenden:
document.querySelectorAll(
    '.hero-icon, .resume-cta, .round-link'
).forEach(el => {
    el.addEventListener('mouseenter', () => {
        dot.classList.add('hover');
    });

    el.addEventListener('mouseleave', () => {
        dot.classList.remove('hover');
    });
});

document.querySelectorAll('.magnetic').forEach(el=>el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.18,y=(e.clientY-r.top-r.height/2)*.18;
el.style.transform=`translate(${x}px,${y}px)`}));document.querySelectorAll('.magnetic').forEach(el=>el.addEventListener('mouseleave',()=>el.style.transform='translate(0,0)'));

// ============ ABOUT: TEXT ZEILENWEISE AUSFÜLLEN ============
const scrollFillText = document.querySelector(".scroll-fill");
let fillLines = [];
let originalAboutHtml = "";

/* Text entsprechend des aktuellen Bildschirmumbruchs in Zeilen aufteilen */
function createFillLines() {
    if (!scrollFillText) return;

    /* Ursprünglichen Text nur beim ersten Durchlauf sichern */
    if (!originalAboutHtml) {
        originalAboutHtml = scrollFillText.innerHTML.trim();
    }

    /*
      Achtung:
      textContent übernimmt den sichtbaren Text.
      Falls du <em>...</em> im Scroll-Fill-Text nutzt, wird die Kursivschrift
      für diesen einen Effekt nicht übernommen.
    */
    const words = scrollFillText.textContent.trim().split(/\s+/);

    /* Jedes Wort temporär einzeln setzen, um seine Bildschirmzeile zu erkennen */
    scrollFillText.innerHTML = words
        .map(word => `<span class="fill-word">${word}</span>`)
        .join(" ");

    const wordElements = [...scrollFillText.querySelectorAll(".fill-word")];
    const lines = [];
    let currentLine = [];
    let previousTop = null;

    wordElements.forEach((wordElement, index) => {
        const top = Math.round(wordElement.getBoundingClientRect().top);

        /* Neue vertikale Position = neue sichtbare Textzeile */
        if (index > 0 && top !== previousTop) {
            lines.push(currentLine);
            currentLine = [];
        }

        currentLine.push(wordElement.textContent);
        previousTop = top;
    });

    if (currentLine.length) {
        lines.push(currentLine);
    }

    /* Echte Zeilen wieder einsetzen */
    scrollFillText.innerHTML = lines
        .map(line => `<span class="fill-line">${line.join(" ")}</span>`)
        .join("");

    fillLines = [...scrollFillText.querySelectorAll(".fill-line")];
}

/* Jede Zeile wird nacheinander gefüllt */
function updateScrollFill() {
    if (!scrollFillText || !fillLines.length) return;

    const rect = scrollFillText.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    /* Effekt beginnt bei 90 % der Viewporthöhe und endet bei 25 %. Diese Werte kannst du später feinjustieren. */
    const start = viewportHeight * 0.975;
    const end = viewportHeight * 0.35;

    let progress = (start - rect.top) / (start - end);
    progress = Math.max(0, Math.min(1, progress));

    /* Gesamtfortschritt wird auf die Anzahl der Zeilen verteilt: Zeile 1 füllt sich zuerst, danach Zeile 2 usw.*/
    fillLines.forEach((line, index) => {
        const lineProgress = Math.max(
            0,
            Math.min(1, progress * fillLines.length - index)
        );

        line.style.setProperty("--fill", lineProgress * 100);
    });
}

/* Beim Laden aufteilen und füllen */
createFillLines();
updateScrollFill();

window.addEventListener("scroll", updateScrollFill, { passive: true });

/* Bei Größenänderungen umbrechen Zeilen eventuell anders. Daher nach einem kurzen Moment neu berechnen.*/
let resizeTimer;

window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
        createFillLines();
        updateScrollFill();
    }, 150);
});

// ============ HERO: ACID-KREIS MIT GEHEIMEM TEXT ============
const heroTitle = document.querySelector(".hero-title");
const heroSecretText = document.querySelector(".hero-title-secret");

/* Der Effekt wird nur auf Geräten mit Maus aktiviert. Touch-Geräte behalten den normalen Hero-Text.*/
if (
    heroTitle &&
    heroSecretText &&
    window.matchMedia("(pointer: fine)").matches
) {
    heroTitle.addEventListener("mouseenter", () => {
        // Kleinen Standard-Cursor verstecken
        dot.classList.add("hero-text-hover");
        // Größe des Acid-Kreises beim Eintritt
        targetRevealSize = 200;
    });

    heroTitle.addEventListener("mousemove", (event) => {
        const rect = heroTitle.getBoundingClientRect();

        /*
          Mausposition relativ zum großen Text bestimmen. Diese Werte steuern die Kreismitte. */
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        heroSecretText.style.setProperty("--mouse-x", `${x}px`);
        heroSecretText.style.setProperty("--mouse-y", `${y}px`);
    });
    /* Nur der Radius wird weich animiert. Die Position bleibt immer exakt unter der Maus. */
    let currentRevealSize = 0;
    let targetRevealSize = 0;

    function animateHeroReveal() {
        /* 0.22 = weich, aber noch direkt */
        currentRevealSize += (targetRevealSize - currentRevealSize) * 0.08;

        heroSecretText.style.setProperty(
            "--reveal-size",
            `${currentRevealSize}px`
        );

        requestAnimationFrame(animateHeroReveal);
    }

animateHeroReveal();
    heroTitle.addEventListener("mouseleave", () => {
        // Kreis wieder schließen und normalen Cursor zurückbringen
        targetRevealSize = 0;
        dot.classList.remove("hero-text-hover");
    });
}

// ============ HEADER: ÜBERALL HELL ============
const header = document.querySelector(".site-header");

function updateHeaderColor() {
    if (!header) return;

    /*
      Alle großen Bereiche sind nun dunkel:
      Hero, Historie, Portfolio, About und Connect.
    */
    header.classList.remove("on-light");
}

window.addEventListener("scroll", updateHeaderColor, { passive: true });
window.addEventListener("resize", updateHeaderColor);
updateHeaderColor();

// ============ HISTORIE: Jahr zuerst, Rolle + Company danach ============
const historyItems = document.querySelectorAll(".history-item");

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function updateHistoryFill() {
    const viewportHeight = window.innerHeight;

    historyItems.forEach((item) => {
        const rect = item.getBoundingClientRect();

        /* Eine Station erhält insgesamt 200 % Fortschritt: 0–100 %   = Jahr füllt sich 100–200 % = Rolle und Company füllen sich gleichzeitig. */
        const progress = (
            (viewportHeight - rect.top) / (viewportHeight * 0.7)
        ) * 200;

        const yearFill = clamp(progress, 0, 100);
        const contentFill = clamp(progress - 100, 0, 100);

        const year = item.querySelector(".history-year.history-fill");
        const role = item.querySelector(".history-role.history-fill");
        const company = item.querySelector(".history-company.history-fill");

        if (year) {
            year.style.setProperty("--fill", yearFill.toFixed(1));
        }

        if (role) {
            role.style.setProperty("--fill", contentFill.toFixed(1));
        }

        if (company) {
            company.style.setProperty("--fill", contentFill.toFixed(1));
        }
    });
}

// ============ MEHR ÜBER MICH: INTERAKTIVE FENSTER ============
const aboutPanels = document.querySelector(".about-panels");
const aboutPanelItems = document.querySelectorAll(".about-panel");

if (aboutPanels && aboutPanelItems.length) {
    function activateAboutPanel(panel) {
        aboutPanelItems.forEach((item) => {
            item.classList.toggle("is-active", item === panel);
        });

        aboutPanels.classList.add("has-active-panel");
    }

    function deactivateAboutPanels() {
        aboutPanelItems.forEach((item) => {
            item.classList.remove("is-active");
        });

        aboutPanels.classList.remove("has-active-panel");
    }

    aboutPanelItems.forEach((panel) => {
        panel.addEventListener("pointerenter", () => {
            activateAboutPanel(panel);
        });

        panel.addEventListener("focus", () => {
            activateAboutPanel(panel);
        });

        panel.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                panel.blur();
                deactivateAboutPanels();
            }
        });
    });

    aboutPanels.addEventListener("pointerleave", deactivateAboutPanels);

    aboutPanels.addEventListener("focusout", (event) => {
        if (!aboutPanels.contains(event.relatedTarget)) {
            deactivateAboutPanels();
        }
    });
}

// ============ DARK / LIGHT MODE TOGGLE ============
const themeSwitch = document.querySelector("#theme-switch");

/*
  Standard bleibt Dark Mode.
  Die gespeicherte Auswahl wird nur verwendet,
  wenn die Person bereits einmal umgeschaltet hat.
*/
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    document.body.classList.add("light-mode");

    if (themeSwitch) {
        themeSwitch.checked = true;
        themeSwitch.setAttribute("aria-label", "Dunklen Modus aktivieren");
    }
}

if (themeSwitch) {
    themeSwitch.addEventListener("change", () => {
        const isLightMode = themeSwitch.checked;

        document.body.classList.toggle("light-mode", isLightMode);

        localStorage.setItem(
            "theme",
            isLightMode ? "light" : "dark"
        );

        themeSwitch.setAttribute(
            "aria-label",
            isLightMode
                ? "Dunklen Modus aktivieren"
                : "Hellen Modus aktivieren"
        );
    });
}

window.addEventListener("scroll", updateHistoryFill, { passive: true });
window.addEventListener("resize", updateHistoryFill);
updateHistoryFill();