export function initSearch() {
  const root = document.querySelector(".site-search");
  if (!root) return;

  const input = root.querySelector(".site-search-input");
  const list = root.querySelector(".site-search-results");
  const base = root.dataset.base.replace(/\/$/, "");
  const currentVersion = root.dataset.version || null;
  const maxResults = 10;

  let index = null;
  let results = [];
  let active = -1;

  const normalize = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const cleanText = (str) =>
    str.replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u, "");

  const load = async () => {
    if (index) return index;

    const res = await fetch(root.dataset.index);
    const data = await res.json();

    index = data
      .filter((e) => e.version === currentVersion)
      .map((e) => {
        const text = cleanText(e.text);
        return { ...e, text, key: normalize(text) };
      });

    return index;
  };

  const score = (entry, query) => {
    const pos = entry.key.indexOf(query);
    if (pos === -1) return -1;
    return (pos === 0 ? 100 : 50) - pos - entry.level * 5;
  };

  const escape = (str) =>
    str.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

  const highlight = (text, query) => {
    const pos = normalize(text).indexOf(query);
    if (pos === -1) return escape(text);
    return (
      escape(text.slice(0, pos)) +
      "<mark>" + escape(text.slice(pos, pos + query.length)) + "</mark>" +
      escape(text.slice(pos + query.length))
    );
  };

  const close = () => {
    list.hidden = true;
    active = -1;
  };

  const render = (query) => {
    active = -1;

    if (!results.length) {
      list.innerHTML = `<li class="site-search-empty">No results</li>`;
      list.hidden = false;
      return;
    }

    list.innerHTML = results
      .map(
        (entry) => `
          <li role="option">
            <a href="${base}${entry.url}" class="site-search-level-${entry.level}">
              <span class="site-search-text">${highlight(entry.text, query)}</span>
              ${entry.section ? `<span class="site-search-section">${escape(cleanText(entry.section))}</span>` : ""}
            </a>
          </li>`
      )
      .join("");

    list.hidden = false;
  };

  const setActive = (i) => {
    const items = list.querySelectorAll("a");
    if (!items.length) return;
    active = (i + items.length) % items.length;
    items.forEach((a, n) => a.classList.toggle("active", n === active));
    items[active].scrollIntoView({ block: "nearest" });
  };

  input.addEventListener("focus", load, { once: true });

  input.addEventListener("input", async () => {
    const query = normalize(input.value.trim());
    if (query.length < 2) return close();

    const data = await load();

    results = data
      .map((entry) => ({ entry, s: score(entry, query) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, maxResults)
      .map((r) => r.entry);

    render(query);
  });

  input.addEventListener("keydown", (e) => {
    if (list.hidden) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(active + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(active - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = list.querySelectorAll("a")[active === -1 ? 0 : active];
      if (target) {
        close();
        input.blur();
        window.location.href = target.href;
      }
    } else if (e.key === "Escape") {
      close();
      input.blur();
    }
  });

  list.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      close();
      input.value = "";
    }
  });

  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      input.focus();
    }
  });
}