# Content & Data {id="content-and-data"}

Two folders hold the things your site needs but that aren't markup: `assets/` and `data/`. The difference is **when** they're used.

`assets/` is copied into the **out** folder as it is, so the browser can reach its files while the page is running. Images, fonts, icons, downloadable files, and **JSON** your **JavaScript** wants to fetch.

`data/` is read while the site **builds** and then left behind. Its **JSON** files feed your [components](#what-is-a-component) and [Markdown](#what-is-markdown), and never reach the **out** folder, so nothing in there is downloadable or reachable by JavaScript.

## Assets management {id="assets-management"}

Everything the browser has to load goes in `src/frontend/assets/`, in whatever structure you like. The folder is copied keeping that structure, so the path you write is the path it has.

{% raw %}
```njk
src/frontend/assets/
├── brand/
│   ├── favicon.svg
│   ├── logo.svg
│   └── ...
├── images/
└── ...
```
{% endraw %}

> You can create your own custom folders

### JSON the browser can read {id="assets-json"}

A **JSON** file in `assets/` can be fetched by your **JavaScript** while the page is running:

`assets/data/products.json`
```json
[
  { "name": "Free", "price": 0 },
  { "name": "Pro", "price": 19 }
]
```

`js/modules/plans.js`
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

`frontend/components/plans.njk`
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

A `.md` file can use the same values, but it doesn't see them on its own. Pass them when you include the [markdown component](#include-markdown):

{% raw %}
```njk
{% renderFile "example.md" | componentsPath, { plans: plans }, "md" %}
```
{% endraw %}

Building the values into the page is faster for the visitor: the content is already there when the page arrives, and search engines can read it. Fetching is what you want when the data changes on its own, or when it's too much to put in every page.

> Keep `data/` where it is. It was moved out of `assets/` in an early version precisely so it wouldn't be published