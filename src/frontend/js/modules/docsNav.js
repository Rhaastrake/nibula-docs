const NAV_SELECTOR = ".docs-nav";
const LINK_SELECTOR = 'a[href^="#"]';
const ACTIVE_CLASS = "link-button-active";
const INACTIVE_CLASS = "link-button";
const SUBNAV_SELECTOR = ".docs-subnav";
const SUBNAV_WRAPPER_SELECTOR = ".docs-subnav-wrapper";
const TOGGLE_SELECTOR = ".subnav-toggle";
const NAV_ROW_SELECTOR = ".docs-nav-row";
const NAV_ITEM_SELECTOR = "li";
const HEADER_SELECTOR = "header";
const SCROLL_BOX_SELECTOR = ".offcanvas-body";
const EXPANDED_ATTRIBUTE = "aria-expanded";
const EXPANDED = "true";
const COLLAPSED = "false";
const HASH_LENGTH = 1;
const ACTIVATION_OFFSET = 150;
const SCROLL_LOCK_DURATION = 2000;
const SUBNAV_TRANSITION_DURATION = 350;
const NAV_SCROLL_MARGIN = 16;
const SCROLLABLE_THRESHOLD = 1;
const OPEN_BUTTON_SELECTOR = "#docsNavOpen";
const CLOSE_BUTTON_SELECTOR = "#docsNavClose";
const SHOW_CLASS = "show";
const BACKDROP_CLASS = "offcanvas-backdrop";
const DESKTOP_QUERY = "(min-width: 992px)";
const ESCAPE_KEY = "Escape";

function toggleFor(subnav) {
  return subnav
    .closest(SUBNAV_WRAPPER_SELECTOR)
    ?.previousElementSibling?.querySelector(TOGGLE_SELECTOR);
}

function ancestorToggles(toggle) {
  const result = [];
  let subnav = toggle
    .closest(NAV_ITEM_SELECTOR)
    ?.parentElement?.closest(SUBNAV_SELECTOR);

  while (subnav) {
    const ancestorToggle = toggleFor(subnav);
    if (ancestorToggle) result.push(ancestorToggle);
    subnav = subnav.parentElement.closest(SUBNAV_SELECTOR);
  }

  return result;
}

function activationLine() {
  const header = document.querySelector(HEADER_SELECTOR);
  return (header?.offsetHeight ?? 0) + ACTIVATION_OFFSET;
}

function scrollBoxFor(nav) {
  const candidates = [nav.querySelector(SCROLL_BOX_SELECTOR), nav];

  return (
    candidates.find(
      (element) =>
        element &&
        element.scrollHeight - element.clientHeight > SCROLLABLE_THRESHOLD,
    ) ?? null
  );
}

function scrollBehavior() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

function revealInNav(nav, element) {
  if (!element) return;

  const box = scrollBoxFor(nav);
  if (!box) return;

  const boxRect = box.getBoundingClientRect();
  const rect = element.getBoundingClientRect();

  const overflowTop = rect.top - boxRect.top - NAV_SCROLL_MARGIN;
  const overflowBottom = rect.bottom - boxRect.bottom + NAV_SCROLL_MARGIN;

  // Nothing to do when the element already fits inside the visible area.
  if (overflowTop >= 0 && overflowBottom <= 0) return;

  // Taller than the viewport (or above it): align its top, otherwise pull up
  // just enough to expose the bottom.
  const delta =
    overflowTop < 0 || rect.height > boxRect.height
      ? overflowTop
      : overflowBottom;

  box.scrollTo({ top: box.scrollTop + delta, behavior: scrollBehavior() });
}

function initOffcanvas(nav) {
  const openButton = document.querySelector(OPEN_BUTTON_SELECTOR);
  if (!openButton) return () => {};

  const closeButton = document.querySelector(CLOSE_BUTTON_SELECTOR);
  const desktop = window.matchMedia(DESKTOP_QUERY);
  let backdrop = null;

  const close = () => {
    nav.classList.remove(SHOW_CLASS);
    openButton.setAttribute(EXPANDED_ATTRIBUTE, COLLAPSED);
    backdrop?.remove();
    backdrop = null;
  };

  const open = () => {
    if (desktop.matches) return;

    backdrop = document.createElement("div");
    backdrop.className = `${BACKDROP_CLASS} ${SHOW_CLASS}`;
    backdrop.addEventListener("click", close);
    document.body.appendChild(backdrop);
    nav.classList.add(SHOW_CLASS);
    openButton.setAttribute(EXPANDED_ATTRIBUTE, EXPANDED);
  };

  openButton.addEventListener("click", () => {
    if (openButton.getAttribute(EXPANDED_ATTRIBUTE) === EXPANDED) close();
    else open();
  });

  closeButton?.addEventListener("click", close);

  document.addEventListener("keydown", (event) => {
    if (event.key === ESCAPE_KEY) close();
  });

  desktop.addEventListener("change", (event) => {
    if (event.matches) close();
  });

  return close;
}

export function initDocsNav() {
  const nav = document.querySelector(NAV_SELECTOR);
  if (!nav) return;

  const closeOffcanvas = initOffcanvas(nav);
  const toggles = [...nav.querySelectorAll(TOGGLE_SELECTOR)];
  const links = [...nav.querySelectorAll(LINK_SELECTOR)];
  const entries = [];

  let scrollLockUntil = 0;
  let activeLink = null;
  let manualToggle = null;
  let revealTimer = 0;

  // The subnav opens through a grid-template-rows transition, so the final
  // geometry is only known once the animation has settled: reveal now for
  // responsiveness and again at the end for correctness.
  const reveal = (element) => {
    clearTimeout(revealTimer);
    revealInNav(nav, element);
    revealTimer = setTimeout(
      () => revealInNav(nav, element),
      SUBNAV_TRANSITION_DURATION,
    );
  };

  const collapseAllExcept = (keepOpen) => {
    for (const toggle of toggles) {
      if (!keepOpen.has(toggle)) {
        toggle.setAttribute(EXPANDED_ATTRIBUTE, COLLAPSED);
      }
    }
  };

  for (const toggle of toggles) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute(EXPANDED_ATTRIBUTE) === EXPANDED;
      const next = expanded ? COLLAPSED : EXPANDED;
      toggle.setAttribute(EXPANDED_ATTRIBUTE, next);

      if (next === EXPANDED) {
        // Remembered so a later scroll update doesn't undo the user's choice.
        manualToggle = toggle;
        collapseAllExcept(new Set([toggle, ...ancestorToggles(toggle)]));
        reveal(toggle.closest(NAV_ITEM_SELECTOR));
        return;
      }

      if (manualToggle === toggle) manualToggle = null;
    });
  }

  for (const link of links) {
    const section = document.getElementById(
      link.getAttribute("href").slice(HASH_LENGTH),
    );
    if (section) entries.push({ section, link });
  }

  const activate = (link) => {
    if (link) link.className = `button ${ACTIVE_CLASS}`;
  };

  const applyState = (currentLink) => {
    for (const link of links) link.className = `button ${INACTIVE_CLASS}`;

    const keepOpen = manualToggle
      ? new Set([manualToggle, ...ancestorToggles(manualToggle)])
      : new Set();

    collapseAllExcept(keepOpen);
    activate(currentLink);

    let subnav = currentLink.closest(SUBNAV_SELECTOR);

    while (subnav) {
      toggleFor(subnav)?.setAttribute(EXPANDED_ATTRIBUTE, EXPANDED);

      activate(
        subnav
          .closest(NAV_ITEM_SELECTOR)
          .querySelector(`${NAV_ROW_SELECTOR} ${LINK_SELECTOR}`),
      );

      subnav = subnav.parentElement.closest(SUBNAV_SELECTOR);
    }
  };

  const update = () => {
    if (Date.now() < scrollLockUntil) return;

    const line = activationLine();
    const current =
      entries
        .filter(({ section }) => section.getBoundingClientRect().top <= line)
        .at(-1) ?? entries[0];

    if (!current) return;

    // Leaving the section the user was reading releases their manual choice.
    if (current.link !== activeLink) {
      manualToggle = null;
      activeLink = current.link;
    }

    applyState(current.link);
  };

  for (const { link } of entries) {
    link.addEventListener("click", () => {
      scrollLockUntil = Date.now() + SCROLL_LOCK_DURATION;
      manualToggle = null;
      activeLink = link;
      applyState(link);
      closeOffcanvas();
    });
  }

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  });

  window.addEventListener("scrollend", () => {
    scrollLockUntil = 0;
    update();
  });

  update();
}