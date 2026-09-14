const SELECT_SELECTOR = "#docsVersionSelect";

export function initDocsVersion() {
  const select = document.querySelector(SELECT_SELECTOR);
  if (!select) return;

  select.addEventListener("change", () => {
    window.location.href = select.value;
  });
}
