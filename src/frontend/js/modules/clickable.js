const BADGE_DURATION = 1600;

let badge;

function showBadge(x, y) {
  if (!badge) {
    badge = document.createElement("span");
    badge.className = "clickable-badge";
    badge.setAttribute("role", "status");
    badge.textContent = "Copied";
    document.body.appendChild(badge);
  }
  badge.style.left = `${x + window.scrollX}px`;
  badge.style.top = `${y + window.scrollY}px`;
  badge.classList.add("is-visible");
  clearTimeout(badge.dataset.timer);
  badge.dataset.timer = setTimeout(() => {
    badge.classList.remove("is-visible");
  }, BADGE_DURATION);
}

function getText(host) {
  const clone = host.cloneNode(true);
  clone.querySelectorAll(".clickable-copy").forEach((el) => el.remove());
  return clone.textContent.trim();
}

async function copy(host, x, y) {
  const text = getText(host);
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  showBadge(x, y);
}

function setup(host) {
  if (host.dataset.clickableReady) return;
  host.dataset.clickableReady = "true";

  if (!host.hasAttribute("tabindex")) host.setAttribute("tabindex", "0");
  host.setAttribute("role", "button");
  host.setAttribute("aria-label", "Copy to clipboard");

  const anchor = host.closest("pre") || host.parentElement || host;
  anchor.style.position = "relative";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "clickable-copy";
  button.setAttribute("aria-label", "Copy to clipboard");
  button.innerHTML = '<i class="bi bi-clipboard" aria-hidden="true"></i>';
  anchor.appendChild(button);

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    copy(host, event.clientX, event.clientY);
  });

  host.addEventListener("click", (event) => {
    copy(host, event.clientX, event.clientY);
  });

  host.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const rect = host.getBoundingClientRect();
      copy(host, rect.left + rect.width / 2, rect.bottom);
    }
  });
}

export function initClickable(root = document) {
  root
    .querySelectorAll('.markdown-body pre > code[class*="copy"]')
    .forEach(setup);
}