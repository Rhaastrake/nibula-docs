# Styling {id="styling"}

## 🎨 What is SCSS {id="what-is-scss"}

**SCSS** is basically the **CSS** you already know, with variables and nesting added. If you write it the way you're used to, it still works as you'd expect.

The browser doesn't read `.scss` directly: your files are compiled into **CSS** when the site builds. **Nibula** handles that, so there's nothing to set up.

## Structure {id="styling-structure"}

Every page has its own **SCSS** file, named after the page in **camel case**. It's created for you under `src/frontend/scss/pages/` when you add a page with the [Nibula CLI](#nibula-cli).

> For example `my-page.njk` (page file) is automatically linked to `myPage.scss`

You can write your rules there without touching anything else. They apply to that **page** only, so each page downloads just the **CSS** it needs.

`scss/pages/myPage.scss`
```scss
@use "../root" as root; // Usage: root.$value-name

.page-element {
    background-color: root.$custom-color;
}
```

That single line gives the page access to **root**, a container with all your custom **named values**:

`scss/_root.scss`
```scss
$header-height: 10vh;
$header-padding-y: 15px;
$header-padding-x: 15px;

$header-footer-color: #11474b;
```

The rules shared by every page live in `scss/global.scss`, which the [layout](#what-base-gives-you) loads before the page's own file. You don't import it anywhere: it arrives on its own, and the browser downloads it once for the whole site.

Here are the modules **Nibula** already creates for you, all of them imported in **global**:

| File | What it styles |
|---|---|
| `_typography.scss` | Fonts and text rules |
| `_header.scss` | The header styles |
| `_footer.scss` | The footer styles |
| `_markdown.scss` | [Markdown files](#include-markdown) style |

> `_markdown.scss` is generated rather than written by hand, so there's no reason to edit it
>
> The leading underscore marks a file meant to be imported rather than compiled into a stylesheet of its own. `global.scss` doesn't have it, because it becomes a real `.css` file that the layout loads

## Modules {id="styling-modules"}

You can create your custom **SCSS** module under `src/frontend/scss/modules/`, with an underscore in front of the name.

Remember to declare `@use "../root" as root;` to access the values that you named and want to reuse.

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

Once you created your module, `@import` it in **global** if every page needs it, or in a single page file if only that page does.

> Order matters: a rule imported later wins over an earlier one with the same specificity. That's why the **CSS framework** comes first and your own modules after

## CSS frameworks {id="css-frameworks"}

A **CSS framework** is a library of pre-existing styles already built for you. You **chose** one between **Bootstrap**, **Bulma**, **Foundation** and **UIkit** when you created your project, and **Nibula** installed it for you.

> You're free to avoid them if you want to stay simple, but here's the linked documentation for each one
>
> [Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/) |
> [Bulma](https://bulma.io/documentation/) |
> [Foundation](https://get.foundation/sites/docs/) |
> [UIkit](https://getuikit.com/docs/accordion)

They're **imported** in `scss/global.scss` before your own modules, so your rules always win.

Sometimes a full **CSS** framework is heavier than your pages need, especially if you use only a few things from it. You can filter it by commenting the imports you don't need in `scss/modules/frameworks/_FRAMEWORK.scss`.

`scss/modules/frameworks/_bootstrap.scss`
```scss
@import "bootstrap/scss/alert";            // Alerts
@import "bootstrap/scss/badge";            // Badges
@import "bootstrap/scss/breadcrumb";       // Breadcrumbs
. . .
```

You can also **switch** between them, or set **none**, by commenting and uncommenting a few lines in three files.

> The classes in your pages are another matter: each framework has its own, so a `btn btn-primary` becomes a `button is-primary`. The switch is cheap on day one, expensive once you have twenty pages

`scss/global.scss`
```scss
. . .
@import "modules/frameworks/bootstrap";
// @import "modules/frameworks/bulma";
// @import "modules/frameworks/foundation";
// @import "modules/frameworks/uikit";
. . .
```

`frontend/layouts/base.njk` (or your [custom layout](#layouts) file)
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
"node_modules/bootstrap/dist/js/bootstrap.bundle.min.js": "js/bootstrap.bundle.min.js",
"node_modules/bootstrap-icons/font/fonts": "css/fonts",

// Foundation
// "node_modules/foundation-sites/dist/js/foundation.min.js": "js/foundation.min.js",

// UIkit
// "node_modules/uikit/dist/js/uikit.min.js": "js/uikit.min.js",
// "node_modules/uikit/dist/js/uikit-icons.min.js": "js/uikit-icons.min.js",

// Bulma — CSS only, no JS passthrough needed
});
```