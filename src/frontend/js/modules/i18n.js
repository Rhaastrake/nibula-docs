const element = document.getElementById("i18n-strings");
const strings = element ? JSON.parse(element.textContent) : {};

export function t(key) {
  return strings[key] ?? key;
}
