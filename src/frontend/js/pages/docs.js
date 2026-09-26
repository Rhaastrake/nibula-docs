import '../global.js';

import { initDocsNav } from "../modules/docsNav.js";
import { initDocsVersion } from "../modules/docsVersion.js";
import { initSearch, initSearchPlacement } from "../modules/search.js";

document.addEventListener("DOMContentLoaded", () => {
    initDocsNav();
    initDocsVersion();
    initSearch();
    initSearchPlacement();
    // alert("Documentation is still incomplete, please be patient :D");
})