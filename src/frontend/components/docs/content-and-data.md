# Content & Data {id="content-and-data"}

Two folders hold the things your site needs but that aren't markup: `assets/` and `data/`. The difference is **when** they're used.

`assets/` is copied into the output as it is, so its files exist on the published site and the browser can reach them.

`data/` is read while the site builds and then left behind. Its files never reach the output, so nothing in there is ever downloadable.

## Asset management {id="asset-management"}

Everything the browser has to load goes in `src/frontend/assets/`: images, fonts, icons, downloadable files.

{% raw %}
```njk
src/frontend/assets/
├── brand/
│   ├── favicon.svg
│   ├── favicon-32.png
│   └── apple-touch-icon.png
├── images/
└── fonts/
```
{% endraw %}

`brand/` holds the favicon and the logo, which the [layout](#what-base-gives-you) already points at. The rest is yours to organize.

The folder is copied into the output keeping its structure, so the path you write is the path it has:

{% raw %}
```njk
<img src="{{ '/assets/images/photo.jpg' | url }}" alt="A photo">
```
{% endraw %}

> The **url** filter is what makes the path work when the site is published in a subfolder rather than at the root of a domain. Use it for every internal path

### JSON the browser can read {id="assets-json"}

Because `assets/` ends up in the output, a **JSON** file in there can be fetched by your **JavaScript** while the page is running:

`assets/data/products.json`
```json
[
  { "name": "Free", "price": 0 },
  { "name": "Pro", "price": 19 }
]
```

```javascript
const response = await fetch("/assets/data/products.json");
const products = await response.json();
```

That's the choice to make when the data changes without rebuilding the site, or when you only need it after the visitor does something.

> Anything in `assets/` is public. Never put keys, credentials or anything private in there

## Data files {id="data-files"}

`src/frontend/data/` holds the **JSON** files your templates read while the site builds.

Two are there from the start: `site.json` with your site-wide settings, and `pages.json` with the [SEO](#seo) of each page.

Any other `.json` you add becomes available on its own, with the name of the file:

`data/plans.json`
```json
[
  { "name": "Free", "price": "0" },
  { "name": "Pro", "price": "19" }
]
```

{% raw %}
```njk
<ul>
  {% for plan in plans %}
    <li>{{ plan.name }} — €{{ plan.price }}</li>
  {% endfor %}
</ul>
```
{% endraw %}

No import, no configuration, no restart. The variable is named after the file, so `plans.json` becomes `plans`.

### In a Markdown file {id="data-in-markdown"}

A `.md` file can use the same values, but it doesn't see them on its own. Pass them when you [render the file](#include-markdown):

{% raw %}
```njk
{% renderFile "example.md" | componentsPath, { plans: plans }, "md" %}
```
{% endraw %}

> This is the difference from a `.njk` component: an [include](#include-a-component) inherits the page's data, `renderFile` gets only what you hand it

### Which folder to use {id="data-or-assets"}

| | `data/` | `assets/` |
|---|---|---|
| Read | While the site builds | While the page runs |
| By | **Nunjucks** and **Markdown** | Your **JavaScript** |
| Ends up in the output | No | Yes |
| Good for | Content that's part of the page | Data fetched on demand |

Building the values into the page is faster for the visitor: the content is already there when the page arrives, and search engines can read it. Fetching is what you want when the data changes on its own, or when it's too much to put in every page.

> Keep `data/` where it is. It was moved out of `assets/` in an early version precisely so it wouldn't be published

## Examples {id="content-and-data-examples"}