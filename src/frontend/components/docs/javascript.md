# Javascript {id="javascript"}

> Examples use **JavaScript**. Everything applies to **TypeScript** too, except that imports leave the extension out and the project has an extra `tsconfig.json`

## Javascript or TypeScript {id="javascript-or-typescript"}

When creating a project, **Nibula** asks you whether to use **JavaScript** or **TypeScript**. The difference is that TypeScript makes you say what kind of value each thing holds: a **string**, a **number**, the **return** of the function. It checks that you're consistent while you write, so a whole class of mistakes shows up in your editor instead of in the browser.

It's more to learn, though. If you're not sure, start with **JavaScript**. You can always write the next project in TypeScript.

## Structure {id="javascript-structure"}

The **JavaScript** structure is much the same as the [SCSS](#styling-structure) one, but imports work a little differently.

Every **page** has its own file, named after the page in **camel case**, created for you under `src/frontend/js/pages/` when you add a page with the [Nibula CLI](#nibula-cli).

> Example: `my-page.njk` (page file) is automatically linked to `myPage.js`

```njk
src/frontend/js/
├── global.js
├── modules/
└── pages/
```

`pages/` holds one file per page, `modules/` the pieces you reuse, and `global.js` what runs everywhere.

Each page file imports `global.js`, so you write the shared behaviour once:

`js/pages/myPage.js`
```javascript
import '../global.js';

// import { initExampleModule } from '../modules/exampleModule.js';

// initExampleModule();

// Page logic here
```

> Unlike **SCSS**, there's no central file to register anything in. Each page pulls in what it needs

## Modules {id="javascript-modules"}

A module is a file holding one piece of behaviour: a menu, a slider, a form check. Add it under `src/frontend/js/modules/`.

`modules/exampleModule.js`
```javascript
export function initExampleModule() {
    alert("Example module is working!");
}
```

The **export** is what makes the function reachable from outside the file. Anything you don't export stays private to the module.

> Wrap the behaviour in an **init** function rather than running it as soon as the file loads. That way the page decides **when** it starts

**Importing** a module makes its functions available. Calling the **init** function is what actually starts it, so you need both lines.

In a page file, for behaviour only that page needs:

`js/pages/myPage.js`
```javascript
import '../global.js';

import { initExampleModule } from '../modules/exampleModule.js';

initExampleModule();
```

In `global.js`, for behaviour every page needs:

```javascript
import { initBurgerMenu } from "./modules/burgerMenu.js";

initBurgerMenu();
```