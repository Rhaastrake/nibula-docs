const site = require("./site.json");
const i18n = require("./i18n.json");

function languageOf(data) {
  return site.languages.find((language) => language.code === data.lang) || site.languages[0];
}

function pathWithoutPrefix(data) {
  const url = data.page.url || "";
  const prefix = languageOf(data).prefix;
  return prefix && url.startsWith(`${prefix}/`) ? url.slice(prefix.length) : url;
}

module.exports = {
  language: (data) => languageOf(data),
  langPrefix: (data) => languageOf(data).prefix,
  pagePath: (data) => pathWithoutPrefix(data),
  ui: (data) => i18n[languageOf(data).code],
};
