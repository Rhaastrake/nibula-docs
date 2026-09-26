import '../global.js';

import { initDocsNav } from "../modules/docsNav.js";
import { initDocsVersion } from "../modules/docsVersion.js";
import { initSearch } from "../modules/search.js";
import { moveOnBreakpoint } from "../modules/responsiveMove.js";

document.addEventListener("DOMContentLoaded", () => {
    initDocsNav();
    initDocsVersion();
    initSearch();

    moveOnBreakpoint(
        document.querySelector(".site-search"),
        document.getElementById("nav-search-slot"),
        "(max-width: 430px)"
    );
    moveOnBreakpoint(
        document.querySelector(".docs-index"),
        document.getElementById("nav-index-slot"),
        "(max-width: 991.98px)"
    );
    // alert("Documentation is still incomplete, please be patient :D");
})