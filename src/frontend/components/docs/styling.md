# Styling {id="styling"}

## 🎨 What is SCSS {id="what-is-scss"}

**SCSS** is basically the **CSS** you already know, with variables and nesting added. If you write it the way you're used to, it still works as you'd expect.

The browser doesn't read `.scss` directly: your files are compiled into one **CSS** file when the site builds. **Nibula** handles that, so there's nothing to set up.

## Structure {id="styling-structure"}

Every page has its own **SCSS** file, named after the page in **camel case**. It's created for you under `src/frontend/scss/pages/` when you add a page with the [Nibula CLI] (#nibula-cli).

> For example `my-page.njk` (page file) is automatically linked to `myPage.scss`

You can write your rules there without touching anything else. They apply to that **page** only, which keeps things clear and keeps each page's **CSS** small.

`scss/pages/myPage.scss`
```scss
@use "../root" as root; // Usage: root.$value-name

@import "../global";

.page-element {
    background-color: root.$custom-color;
}
```

Every page should declare `@use '../root' as root;` and `@import '../global';`, but what does them mean?

**root** is simply a container with all your custom **named values**:

`scss/_root.scss`
```scss
$header-height: 10vh;
$header-padding-y: 15px;
$header-padding-x: 15px;

$header-footer-color: #11474b;
```

**global** instead is a pre-existing module with the rules that should be applied to every page including module imports to write them only once

Heres some modules that **Nibula** already creates for you:

| File | What it styles |
|---|---|
| `_typography.scss` | Fonts and text rules |
| `_header.scss` | The header styles |
| `_footer.scss` | The footer styles |
| `_markdown.scss` | [Markdown files](#include-markdown) style |


> `_markdown.scss` Should not be touched

> The leading underscore marks a file meant to be imported rather than compiled into a stylesheet of its own

## Create a module {id="styling-create-a-module"}

You can create your custom **SCSS** module under `src/frontend/scss/modules/`, with an underscore in front of the name.

Remember to declare `@use "../root" as root;` to access the values that you named and ant to reuse

`modules/_exampleModule.scss`
```scss
@use "../root" as root;

.default-card {
  padding: 1rem;
  border-radius: 6px;
  background-color: root.$primary-color;
}
```

> Subfolders work too. One level deeper the path changes: `@use "../../root" as root`
>
> `@import` of global should not be here, but in th pages

Once you created your module, just `@import` in **global** or in the page file where you need that module to be applied

> Order matters: a rule imported later wins over an earlier one with the same specificity. That's why the **CSS framework** comes first and your own modules after

## CSS frameworks {id="css-frameworks"}

**CSS frameworks** is a library of pre-existing styles already built for you. You **choosed** one betweeen **Bootstrap, **Bulma**, **Foundation** and **UIKit** that **Nibula** already pre-installed for you right when you created your project!

> You're free to avoid them if you want to stay simple, but here's the linked documentation for each one
> (Nothing to install)
> 
> [Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/) | 
> [Bulma](https://bulma.io/documentation/) | 
> [Foundation](https://get.foundation/sites/docs/) | 
> [UIKit](https://getuikit.com/docs/accordion) | 

They're **imported** in `scss/_globlal.scss` between root and and your other modules. Your modules will be imported later to have priority in the style

Sometimes a full **CSS** framework can be unneccessary heavly for your pages, expecially if you use only few things of that. It can be filtered by all the micro **CSS** modules by just commenting their imports in `scss/modules/frameworks/_choosenFramework.scss`.

`scss/modules/frameworks/_bootstrap.scss`
```scss
@import "bootstrap/scss/alert";            // Alerts
@import "bootstrap/scss/badge";            // Badges
@import "bootstrap/scss/breadcrumb";       // Breadcrumbs
. . .
```

You can also **switch** between them or just set **none** just by commenting/uncomenting few lines in 3 different files:


`scss/_global.scss`
```scss
. . .
@import "modules/frameworks/bootstrap";
// @import "modules/frameworks/bulma";
// @import "modules/frameworks/foundation";
// @import "modules/frameworks/uikit";
. . .
```

`frontend/layout/base.njk` (or your [custom layout](#layouts) file)
{% raw %}
```njk
{# Bootstrap JS #}
<script src="{{ '/js/bootstrap.bundle.min.js' | url }}" defer></script>

{# Foundation JS #}
{# <script src="{{ '/js/foundation.min.js' | url }}" defer></script> #}

{# UIkit JS #}
{# <script src="{{ '/js/uikit.min.js' | url }}" defer></script> #}
{# <script src="{{ '/js/uikit-icons.min.js' | url }}" defer></script> #}

{# Bulma — no JS needed #}
```
{% endraw %}

`.eleventy.js`
```js
eleventyConfig.addPassthroughCopy({
// Bootstrap
"node_modules/bootstrap/dist/js/bootstrap.bundle.min.js":
    "js/bootstrap.bundle.min.js",
"node_modules/bootstrap-icons/font/fonts": "css/fonts",

// Foundation
// "node_modules/foundation-sites/dist/js/foundation.min.js": "js/foundation.min.js",

// UIkit
// "node_modules/uikit/dist/js/uikit.min.js": "js/uikit.min.js",
// "node_modules/uikit/dist/js/uikit-icons.min.js": "js/uikit-icons.min.js",

// Bulma — CSS only, no JS passthrough needed
});
```