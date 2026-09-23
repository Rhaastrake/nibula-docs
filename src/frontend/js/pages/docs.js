import '../global.js';

import { initDocsNav } from "../modules/docsNav.js";
import { initDocsVersion } from "../modules/docsVersion.js";
import { initSearch } from "../modules/search.js";

document.addEventListener("DOMContentLoaded", () => {
    initDocsNav();
    initDocsVersion();
    initSearch();
    // alert("Documentation is still incomplete, please be patient :D");
})