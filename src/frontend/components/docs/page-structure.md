# Page structure {id="page-structure"}

## 🧩 Composition {id="composition"}

### The page settings {id="the-page-settings"}

Each page lives in `routes/` as a **.njk** file.

{% raw %}
```njk
---
title: "my-page"
permalink: "/"
layout: base.njk
---
```
{% endraw %}

| Key | Description | 
| --- | --- |
| **title** | The internal name of the page. Changing it breaks its styles and scripts, so leave it as it is |
| **permalink** | The address the page will have on your site |
| **layout** | The look the page is built into (see [layouts](#layouts)) |

> The **permalink** needs a slash at both ends: **/my-page/**, not **my-page**.
> 
> Without the trailing one you get **my-page.html** instead of a clean **/my-page/** address

### What a page is made of {id="what-a-page-is-made-of"}

A page is made of three files, plus one entry in a shared [data file](#data-files).

| File | What it holds |
|---|---|
| `routes/my-page.njk` | The page itself: its settings and its content |
| `scss/pages/myPage.scss` | The styles that apply only to this page |
| `js/pages/myPage.js` | The code that runs only on this page |

> The route uses the name as you typed it; the stylesheet and script use its
> camelCase form. The assistant handles the conversion for you.

That entry lives in `data/pages.json` (see [Each page SEO](#each-page-seo)):

```json
"myPage": {
  "seo": {
    "title": "My Page",
    "description": "Description",
    "keywords": "",
    "noindex": false,
    "canonical": ""
  },
  "cdn": {
    "css": [],
    "js": []
  }
}
```

You can create, delete or rename them by hand, or let the
[Nibula CLI](#nibula-cli) do it for you — including that record, the easiest one to forget.

Inside your page file (`routes/my-page.njk`) you write only the HTML content of that page — it goes automatically inside the **main** tag. Everything around it comes from the [layout](#layouts).

You can write that content directly in the page, or split it into
[components](#what-is-a-component) — separate files you write once and pull into
any page with a single line.

## 🧱 Layouts {id="layouts"}

A layout is the shell a page is rendered into. Your page provides the content; the layout provides everything around it — the **head**, the **header**, the **footer**, the stylesheets and the scripts.

Layouts live in `src/frontend/layouts/`, and every page picks one in its
settings:
 
{% raw %}
```njk
---
title: "homepage"
permalink: "/"
layout: base.njk
---
```
{% endraw %}
 
### What base.njk gives you {id="what-base-gives-you"}
 
`base.njk` is the default, and it's the one every new page starts with. It writes for you:

> You can pick a different one with the [Nibula CLI](#nibula-cli) when you create the page — if you have more than one
 
| Part | What it does |
|---|---|
| **head** | The page title, description, canonical link and social preview tags, taken from your [data files](#data-files) |
| **favicon** | The three icon tags, pointing at `assets/brand/` |
| **CSS** | The stylesheet of the current page, plus any CDN links you listed for it |
| **header** and **footer** | Included from `components/global/`, so they're identical on every page |
| **JS** | The script of the current page, the framework bundle, and any CDN scripts |
 
The page's own stylesheet and script are found by **title**: a page whose title is **myPage** loads `css/pages/myPage.css` and `js/pages/myPage.js`. The same name is the key of its record in `data/pages.json` — that's why the title shouldn't be changed by hand.
 
### Loading something from a CDN {id="page-cdn"}
 
If a page needs a **library** that isn't in your project — a chart library, a font,
an icon set — list its URL in that page's record in `data/pages.json`:
 
```json
"myPage": {
  "seo": { ... },
  "cdn": {
    "css": [
      "https://cdn.example.com/lib.min.css",
      "https://cdn.another.com/lib.min.css"
      ],
    "js": [
      "https://cdn.example.com/lib.min.js",
      "https://cdn.another.com/lib.min.js"
      ]
  }
}
```
 
The layout adds them to that page only, so a library used on one page isn't
downloaded on all the others.

> If you want to add a **CDN** to all pages, you should add a link into the layout

### Making your own {id="custom-layouts"}

You may need a full-screen login that starts straight with the content, a
**different header** on a group of pages, or a **CDN** loaded on all of them
instead of one at a time.

A custom layout is worth it when something changes for *some* pages. If it
changes for all of them, edit `base.njk` directly.

Copy `layouts/base.njk`, give the copy a name of your own, and change only what
those pages need.

### Custom layouts examples {id="custom-layout-examples"}

**No header and no footer.** For a page that fills the screen on its own, create
`layouts/straight-content.njk` and remove the two global includes:

{% raw %}
```njk
<body>
    <!-- Drop this -->
    {% include "global/header.njk" ignore missing %}

    <main>
        {{ content | safe }}
    </main>

    <!-- Drop this -->
    {% include "global/footer.njk" ignore missing %}
</body>
```
{% endraw %}

> Those two come from `components/global/` — see
> [components](id="what-is-a-component")

**A different header.** Point the [include](id="include-a-component") at another
component instead:

{% raw %}
```njk
{% include "global/landing-header.njk" ignore missing %}
```
{% endraw %}

**A library on some pages only.** Add the link in the head, next to the others —
no need to repeat it in each page's **CDN** list:

{% raw %}
```njk
<link rel="stylesheet" href="https://cdn.example.com/lib.min.css">
```
{% endraw %}

Everything you leave alone — the [SEO](#seo) tags, the stylesheet and script links —
keeps working without you touching it.

Then point a page at your **layout**:

{% raw %}
```njk
---
title: "login"
permalink: "/login/"
layout: straight-content.njk
---
```
{% endraw %}

## 🖱️ Nibula CLI {id="nibula-cli"}

### Options {id="nibula-cli-options"}

The assistant writes the three files and the `pages.json` record for you, keeping the names in sync. Run it from anywhere inside a project:

``` {class="button link-button copy"}
nib cli
```

| Option | What it does |
|---|---|
| **Create page** | Writes the three files and the record, asking which [layout](#layouts) to use if you have more than one |
| **Remove page** | Deletes them all, after asking for confirmation |
| **Rename page** | Renames the files, updates the front matter, and moves the record |
| **Configure output path** | Changes where the site is built, across every file that references it |

> **homepage** `(index.njk)` and **404** are protected — the assistant won't touch them

Renaming leaves the contents of the record alone: your SEO title, description and CDN links stay as you wrote them, and so do the components you included.

A new page arrives empty apart from its settings and two commented examples — one for a [component](#include-a-component), one for a [markdown file](#what-is-markdown).

### Where the site is built {id="cli-output-path"}

By default the build goes to `out/`. Change it when the folder you build into isn't the folder you work in — a local server's document root, a shared drive, a path your host expects. The dev server follows, rebuilding there as you save, with nothing to copy by hand.

Any absolute or relative path works:

``` {class="button link-button copy"}
C:/laragon/www
```

``` {class="button link-button copy"}
../any-folder
```

If you want to reset the output path to the project root, just type `.` as path

> If you don't have a reason to change it, leave `out/` — it's already ignored by
> git and cleaned by **nib clean**