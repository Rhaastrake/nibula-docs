import '../global.js';

import { initDocsNav } from "../modules/docsNav.js";
import { initDocsVersion } from "../modules/docsVersion.js";
import { initClickable } from "../modules/clickable.js";
import { moveOnBreakpoint } from "../modules/responsiveMove.js";

document.addEventListener("DOMContentLoaded", () => {
    initDocsNav();
    initDocsVersion();
    initClickable();

    moveOnBreakpoint(
        document.querySelector(".docs-index"),
        document.getElementById("nav-index-slot"),
        "(max-width: 991.98px)"
    );
    // alert("Documentation is still incomplete, please be patient :D");
})