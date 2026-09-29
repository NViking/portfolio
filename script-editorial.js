document.addEventListener("DOMContentLoaded", () => {
  const clamp = (value, min = 0, max = 1) => {
    return Math.min(Math.max(value, min), max);
  };

  const easeInOut = (value) => {
    return value * value * (3 - 2 * value);
  };

  /* ============ MENU ============ */

  const menu = document.querySelector(".menu");
  const menuOpenButton = document.querySelector(".menu-toggle");
  const menuCloseButton = document.querySelector(".menu-close");

  function closeMenu() {
    if (!menu || !menuOpenButton) return;

    menu.classList.remove("open");
    menuOpenButton.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
  }

  function openMenu() {
    if (!menu || !menuOpenButton) return;

    menu.classList.add("open");
    menuOpenButton.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
  }

  if (menuOpenButton) {
    menuOpenButton.addEventListener("click", openMenu);
  }

  if (menuCloseButton) {
    menuCloseButton.addEventListener("click", closeMenu);
  }

  document.querySelectorAll(".menu a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /* ============ REVEAL ELEMENTS ============ */

  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /* ============ SCROLL PROGRESS ============ */

  const progressBar = document.querySelector(".progress span");

  function updateProgressBar() {
    if (!progressBar) return;

    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress =
      scrollableHeight > 0
        ? Math.min(100, (window.scrollY / scrollableHeight) * 100)
        : 0;

    progressBar.style.height = `${progress}%`;
  }

  /* ============ CUSTOM CURSOR ============ */

  const cursorDot = document.querySelector(".cursor-dot");

  if (cursorDot) {
    window.addEventListener("pointermove", (event) => {
      cursorDot.style.left = `${event.clientX}px`;
      cursorDot.style.top = `${event.clientY}px`;
    });

    document
      .querySelectorAll(
        ".hero-icon, .resume-cta, .round-link"
      )
      .forEach((element) => {
        element.addEventListener("mouseenter", () => {
          cursorDot.classList.add("hover");
        });

        element.addEventListener("mouseleave", () => {
          cursorDot.classList.remove("hover");
        });
      });
  }

  /* ============ MAGNETIC ELEMENTS ============ */

  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();

      const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.18;

      element.style.transform = `translate(${x}px, ${y}px)`;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "translate(0, 0)";
    });
  });

  /* ============ ABOUT: TEXT ZEILENWEISE AUSFÜLLEN ============ */

  const scrollFillText = document.querySelector(".scroll-fill");
  let fillLines = [];

  function createFillLines() {
    if (!scrollFillText) return;

    const words = scrollFillText.textContent.trim().split(/\s+/);

    scrollFillText.innerHTML = words
      .map((word) => `<span class="fill-word">${word}</span>`)
      .join(" ");

    const wordElements = [
      ...scrollFillText.querySelectorAll(".fill-word")
    ];

    const lines = [];
    let currentLine = [];
    let previousTop = null;

    wordElements.forEach((wordElement, index) => {
      const top = Math.round(wordElement.getBoundingClientRect().top);

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

    scrollFillText.innerHTML = lines
      .map((line) => {
        return `<span class="fill-line">${line.join(" ")}</span>`;
      })
      .join("");

    fillLines = [...scrollFillText.querySelectorAll(".fill-line")];
  }

  function updateScrollFill() {
    if (!scrollFillText || !fillLines.length) return;

    const rect = scrollFillText.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const start = viewportHeight * 0.975;
    const end = viewportHeight * 0.35;

    const progress = clamp(
      (start - rect.top) / (start - end)
    );

    fillLines.forEach((line, index) => {
      const lineProgress = clamp(
        progress * fillLines.length - index
      );

      line.style.setProperty("--fill", lineProgress * 100);
    });
  }

  createFillLines();

  /* ============ HERO: ACID-KREIS MIT TEXT ============ */

  const heroTitle = document.querySelector(".hero-title");
  const heroSecretText = document.querySelector(".hero-title-secret");

  if (
    heroTitle &&
    heroSecretText &&
    cursorDot &&
    window.matchMedia("(pointer: fine)").matches
  ) {
    let currentRevealSize = 0;
    let targetRevealSize = 0;

    function animateHeroReveal() {
      currentRevealSize +=
        (targetRevealSize - currentRevealSize) * 0.08;

      heroSecretText.style.setProperty(
        "--reveal-size",
        `${currentRevealSize}px`
      );

      window.requestAnimationFrame(animateHeroReveal);
    }

    heroTitle.addEventListener("mouseenter", () => {
      cursorDot.classList.add("hero-text-hover");
      targetRevealSize = 200;
    });

    heroTitle.addEventListener("mousemove", (event) => {
      const rect = heroTitle.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      heroSecretText.style.setProperty("--mouse-x", `${x}px`);
      heroSecretText.style.setProperty("--mouse-y", `${y}px`);
    });

    heroTitle.addEventListener("mouseleave", () => {
      targetRevealSize = 0;
      cursorDot.classList.remove("hero-text-hover");
    });

    animateHeroReveal();
  }

  /* ============ HEADER ============ */

  const header = document.querySelector(".site-header");

  function updateHeaderColor() {
    if (!header) return;

    header.classList.remove("on-light");
  }

  updateHeaderColor();

  /* ============ HISTORIE ============ */

  const historyItems = document.querySelectorAll(".history-item");

  function updateHistoryFill() {
    const viewportHeight = window.innerHeight;

    historyItems.forEach((item) => {
      const rect = item.getBoundingClientRect();

      const progress =
        ((viewportHeight - rect.top) / (viewportHeight * 0.7)) * 200;

      const yearFill = clamp(progress * 0.01) * 100;
      const contentFill = clamp((progress - 100) * 0.01) * 100;

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

  /* ============ WORK: FLIP-KARTEN ============ */

  const workCards = document.querySelectorAll(".work-card");

  workCards.forEach((card) => {
    const button = card.querySelector(".work-card__button");

    if (!button) return;

    button.addEventListener("click", (event) => {
      const isFlipped = card.classList.toggle("is-flipped");

      button.setAttribute("aria-pressed", String(isFlipped));

      if (event.detail > 0) {
        button.blur();
      }
    });
  });

  /* ============ ABOUT: FOLDS ============ */

  const aboutFolds = document.querySelector("[data-about-folds]");

  if (aboutFolds) {
    const folds = [...aboutFolds.querySelectorAll("[data-panel]")];

    const supportsHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    function openFold(selectedFold) {
      folds.forEach((fold) => {
        const isActive = fold === selectedFold;

        fold.classList.toggle("is-active", isActive);
        fold.setAttribute("aria-expanded", String(isActive));
      });

      aboutFolds.classList.add("is-open");
    }

    function closeFolds() {
      folds.forEach((fold) => {
        fold.classList.remove("is-active");
        fold.setAttribute("aria-expanded", "false");
      });

      aboutFolds.classList.remove("is-open");
    }

    folds.forEach((fold) => {
      fold.addEventListener("pointerenter", () => {
        if (supportsHover) {
          openFold(fold);
        }
      });

      fold.addEventListener("focus", () => {
        openFold(fold);
      });

      fold.addEventListener("click", () => {
        if (supportsHover) return;

        const isActive = fold.classList.contains("is-active");

        if (isActive) {
          closeFolds();
        } else {
          openFold(fold);
        }
      });

      fold.addEventListener("keydown", (event) => {
        const isActivationKey =
          event.key === "Enter" || event.key === " ";

        if (event.key === "Escape") {
          closeFolds();
          fold.blur();
        }

        if (isActivationKey && !supportsHover) {
          event.preventDefault();

          const isActive = fold.classList.contains("is-active");

          if (isActive) {
            closeFolds();
          } else {
            openFold(fold);
          }
        }
      });
    });

    aboutFolds.addEventListener("pointerleave", () => {
      if (supportsHover) {
        closeFolds();
      }
    });

    aboutFolds.addEventListener("focusout", (event) => {
      if (!aboutFolds.contains(event.relatedTarget)) {
        closeFolds();
      }
    });
  }

  /* FOOTER */
  const footerLinks = document.querySelectorAll(".footer-connect__links a");
  console.log(`${footerLinks.length} Footer-Links geladen.`);

  /* ============ SECTION LABELS: SCROLL-WELLE ============ */

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const scrollLabels = document.querySelectorAll(
    "[data-scroll-label]"
  );

  function createLabelCharacters(element, reverse = false) {
    const text = element.textContent.trim();
    const characters = [...text];
    const fragment = document.createDocumentFragment();

    element.textContent = "";
    element.setAttribute("aria-hidden", "true");

    characters.forEach((character, index) => {
      const char = document.createElement("span");

      char.className = "section-label__char";
      char.textContent = character === " " ? "\u00A0" : character;

      char.dataset.order = reverse
        ? characters.length - 1 - index
        : index;

      char.style.setProperty("--char-opacity", "0");
      char.style.setProperty("--char-translate", "-13px");

      fragment.appendChild(char);
    });

    element.appendChild(fragment);

    return [...element.querySelectorAll(".section-label__char")];
  }

  const animatedLabels = reducedMotion
    ? []
    : [...scrollLabels]
        .map((label) => {
          const textElement = label.querySelector(
            ":scope > span:nth-child(2)"
          );

          const numberElement = label.querySelector(
            ":scope > span:nth-child(3)"
          );

          if (!textElement || !numberElement) return null;

          const text = textElement.textContent.trim();
          const number = numberElement.textContent.trim();

          label.setAttribute("role", "group");
          label.setAttribute("aria-label", `${text} ${number}`);
          label.setAttribute("data-scroll-ready", "");

          return {
            label,
            textCharacters: createLabelCharacters(textElement),
            numberCharacters: createLabelCharacters(numberElement, true)
          };
        })
        .filter(Boolean);

  function updateLabelCharacters(characters, progress) {
    const lastIndex = Math.max(characters.length - 1, 1);
    const waveLength = 0.7;

    characters.forEach((character) => {
      const order = Number(character.dataset.order);
      const delay = (order / lastIndex) * waveLength;

      const rawProgress = clamp(
        (progress - delay) / (1 - waveLength)
      );

      const characterProgress = easeInOut(rawProgress);
      const translateY = -13 * (1 - characterProgress);

      character.style.setProperty(
        "--char-opacity",
        characterProgress.toFixed(3)
      );

      character.style.setProperty(
        "--char-translate",
        `${translateY.toFixed(2)}px`
      );
    });
  }

  function updateScrollLabels() {
    if (!animatedLabels.length) return;

    const viewportHeight = window.innerHeight;

    animatedLabels.forEach((item) => {
      const rect = item.label.getBoundingClientRect();

      const animationStart = viewportHeight * 0.87;
      const animationEnd = viewportHeight * 0.32;

      const progress = clamp(
        (animationStart - rect.top) /
          (animationStart - animationEnd)
      );

      updateLabelCharacters(item.textCharacters, progress);
      updateLabelCharacters(item.numberCharacters, progress);
    });
  }

  /* ============ DARK / LIGHT MODE ============ */

  const themeSwitch = document.querySelector("#theme-switch");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-mode");

    if (themeSwitch) {
      themeSwitch.checked = true;
      themeSwitch.setAttribute(
        "aria-label",
        "Dunklen Modus aktivieren"
      );
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

  /* ============ ZENTRALE SCROLL-AKTUALISIERUNG ============ */

  let scrollAnimationFrame;

  
  function updateOnScroll() {
    window.cancelAnimationFrame(scrollAnimationFrame);

    scrollAnimationFrame = window.requestAnimationFrame(() => {
      updateProgressBar();
      updateScrollFill();
      updateHistoryFill();
      updateScrollLabels();
      updateHeaderColor();
    });
  }

  let resizeTimer;

  function updateOnResize() {
    window.clearTimeout(resizeTimer);

    resizeTimer = window.setTimeout(() => {
      createFillLines();
      updateOnScroll();
    }, 150);
  }

  window.addEventListener("scroll", updateOnScroll, {
    passive: true
  });

  window.addEventListener("resize", updateOnResize);

  updateOnScroll();
});