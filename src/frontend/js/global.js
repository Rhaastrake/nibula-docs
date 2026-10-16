import { initBurgerMenu } from "./modules/burgerMenu.js";
import { initSearch } from "./modules/search.js";
import { moveOnBreakpoint } from "./modules/responsiveMove.js";

document.addEventListener('DOMContentLoaded', () => {
    initBurgerMenu();
    initSearch();

    moveOnBreakpoint(
        document.querySelector(".site-search"),
        document.getElementById("nav-search-slot"),
        "(max-width: 430px)"
    );
});