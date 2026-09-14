import '../global.js';

import { initDocsNav } from "../modules/docsNav.js";
import { initDocsVersion } from "../modules/docsVersion.js";

document.addEventListener("DOMContentLoaded", () => {
    initDocsNav();
    initDocsVersion();
    // alert("Documentation is still incomplete, please be patient :D");
})