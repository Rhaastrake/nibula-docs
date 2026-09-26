export function moveOnBreakpoint(el, slot, query) {
  if (!el || !slot) return;

  const marker = document.createComment("original-position");
  el.before(marker);

  const mq = window.matchMedia(query);
  const place = () => {
    if (mq.matches) slot.appendChild(el);
    else marker.after(el);
  };

  place();
  mq.addEventListener("change", place);
}