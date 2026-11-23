## <i class="bi bi-arrow-left-right"></i> Migration {id="migration"}

### From 2.x to 3 {id="migration-overview"}

Start from the project root by updating **Nibula** itself:

``` {class="clickable button link-button copy"}
npm update nibula
```

Version 3 moves the global stylesheet out of every page and renames two backend folders. Nothing in your content, your pages or your data files changes.

| Area | Who it concerns |
|---|---|
| [Stylesheets](#migration-stylesheets) | Every project |
| [Build scripts](#migration-scripts) | Every project |
| [Backend](#migration-backend) | Only if you picked **Node** or **PHP** |

> Your endpoints keep working as they are. The new one-function-per-method form is available, not required

#### Stylesheets {id="migration-stylesheets"}

Until now every page's CSS carried a full copy of the framework and of every module, so a visitor reading three pages downloaded the same thing three times. The global stylesheet is now compiled on its own and linked by the layout.

**1.** Rename `src/frontend/scss/_global.scss` to `global.scss`.

**2.** In every file under `scss/pages/`, delete the import of the global file:

```scss
@import "../global";
```

**3.** In `src/frontend/layouts/base.njk`, link the global stylesheet above the page one:

```njk
<link rel="stylesheet" href="{{ '/css/global.css' | url }}">
```

#### Build scripts {id="migration-scripts"}

The `build-js` command is gone: `esbuild` expands the entry pattern by itself, so the project calls it directly. A project created before version 3 still has the old scripts, and its build fails after updating.

In `package.json`, replace the two scripts:

```json
"build:js": "esbuild \"src/frontend/js/pages/*.js\" --bundle --outdir=out/js/pages --minify",
"serve:js": "esbuild \"src/frontend/js/pages/*.js\" --bundle --outdir=out/js/pages --watch"
```

A **TypeScript** project uses `src/frontend/ts/pages/*.ts` instead.

Then remove the dependency that only existed to expand that pattern:

``` {class="clickable button link-button copy"}
npm uninstall glob
```

#### Backend {id="migration-backend"}

**1.** Rename the two folders:

| Old | New |
|---|---|
| `src/backend/_core` | `src/backend/core` |
| `src/backend/api` | `src/backend/endpoints` |

The second one holds your route files, while `/api` stays the public URL prefix: your endpoints are still reached at `yoursite.com/api/endpoint`.

**2.** Update the path in the server files you edited yourself. The bundled `nginx.conf`, `.htaccess` and `web.config` already point at `backend/core`, but any rule you added by hand still names `_core`.

**3.** A request to a protected endpoint without its key now answers **401** instead of **403**. If something on your side handles that answer, update it.

> While `APP_ENV` is not `production`, every response carries a `Debug-Mode` header. A quick way to tell whether a live site was left in debug mode

#### Checking it worked {id="migration-check"}

``` {class="clickable button link-button copy"}
nib build
```

A clean build writes `out/css/global.css` next to the page stylesheets. Open a page and check in your browser's network tab that both files load.

With a backend, call an endpoint to see it answer:

``` {class="clickable button link-button copy"}
curl http://localhost:8080/api/example-public
```

> Nothing in `data/`, `routes/`, `components/` or `layouts/` needs touching beyond the one line added to `base.njk`

### From 3.1 to 3.2 {id="migration-3-2"}

Update the copy of **Nibula** inside your project:

``` {class="clickable button link-button copy"}
npm install -D nibula@latest
```

The new options of `nib new` work on their own. The other changes only reach new projects, so an existing one picks them up by hand.

| Step | Who it concerns |
|---|---|
| [Homepage file](#migration-3-2-homepage) | Every project |
| [Page scripts](#migration-3-2-scripts) | Every project |
| [npm warnings](#migration-3-2-npm) | Every project |
| [Apache](#migration-3-2-apache) | Sites on **Apache** |
| [nginx](#migration-3-2-nginx) | Sites with the **Node** backend on **nginx** |
| [PHP endpoints](#migration-3-2-php) | Only if you picked **PHP** |
| [404 page](#migration-3-2-404) | Sites published in a subfolder |
| [llms.txt and copyright](#migration-3-2-llms) | Optional |
| [Live reload](#migration-3-2-reload) | Optional |
| [Link previews](#migration-3-2-previews) | Optional |
| [eleventy-img](#migration-3-2-eleventy-img) | Optional |

#### Homepage file {id="migration-3-2-homepage"}

Rename `src/frontend/routes/index.njk` to `homepage.njk`.

From 3.2 the name **index** is no longer protected, so in a project that still has `index.njk`, `nib remove index` would delete the homepage. Its address stays `/` and nothing else changes.

#### Page scripts {id="migration-3-2-scripts"}

The page script ran before Bootstrap and the CDN scripts of `pages.json`, so it could not use them. In `src/frontend/layouts/base.njk`, add `defer` to it:

{% raw %}
```njk
<script src="{{ ('/js/pages/' + title + '.js') | url }}" defer></script>
```
{% endraw %}

#### npm warnings {id="migration-3-2-npm"}

Recent versions of npm warn that the install scripts of esbuild and `@parcel/watcher` are not approved, and a future version will block them. In `package.json`, approve them:

```json
"allowScripts": {
  "esbuild": true,
  "@parcel/watcher": true
}
```

#### Apache {id="migration-3-2-apache"}

**1.** With `mod_proxy` active, the whole site answered **500**: `ProxyPass` is not allowed in `.htaccess`. In `src/frontend/hosting/.htaccess`, replace the Node backend block with:

```apache
<IfModule mod_proxy_http.c>
    <IfModule mod_headers.c>
        RequestHeader unset X-Forwarded-For
        RequestHeader set X-Forwarded-Proto "https"
    </IfModule>

    RewriteEngine On
    RewriteRule ^api/(.*)$ http://127.0.0.1:3000/api/$1 [P,L,QSA]
</IfModule>
```

**2.** `web.config` and files starting with a dot already showed the 404 page, but with status **200**. In the same file, change the rule that blocks them:

```apache
RewriteRule ^(web\.config|\..*)$ - [R=404,L,NC]
```

> The client's own `X-Forwarded-For` is dropped, so the rate limiter sees each visitor's real address

#### nginx {id="migration-3-2-nginx"}

A visitor could send a fake `X-Forwarded-For` and get around the rate limit. In `nginx.conf`, inside `location ^~ /api/`, change the line to:

```nginx
proxy_set_header X-Forwarded-For   $remote_addr;
```

#### PHP endpoints {id="migration-3-2-php"}

An empty query reached the browser as `[]` with PHP and as `{}` with Node. Wherever an endpoint returns the query, cast it:

```php
'query' => (object) $request['query'],
```

#### 404 page {id="migration-3-2-404"}

The homepage link lost the path prefix when the site lives in a subfolder. In `src/frontend/components/not-found.njk`:

{% raw %}
```njk
<a href="{{ '/' | url }}">Return to homepage</a>
```
{% endraw %}

#### llms.txt and copyright {id="migration-3-2-llms"}

`llms.txt` now lists every indexed page as a link with its description, and shows the same copyright as the footer.

**1.** In `src/frontend/data/site.json`, move `copyright` out of `legal` and delete the rest of `legal`:

```json
"copyright": {
  "year": "2026",
  "text": "All rights reserved."
}
```

**2.** In `src/frontend/components/global/footer.njk`, write the three legal links directly (`{% raw %}{{ '/privacy/' | url }}{% endraw %}` and so on) and use `site.copyright.year` and `site.copyright.text`.

**3.** Replace the content of `src/frontend/indexing/llms.njk` with:

{% raw %}
```njk
---
permalink: /llms.txt
eleventyExcludeFromCollections: true
---
# {{ site.siteName }}

> {{ site.description }}

## Pages
{% for page in collections.all -%}
{%- set pageMeta = pages[page.data.title] -%}
{%- if not page.data.draft and pageMeta and not pageMeta.seo.noindex %}
- [{{ pageMeta.seo.title }}]({{ site.url }}{{ page.url }}){% if pageMeta.seo.description %}: {{ pageMeta.seo.description }}{% endif %}
{%- endif -%}
{%- endfor %}

## Notes

- Language: {{ site.lang }}
- Copyright: © {{ site.copyright.year }} {{ site.siteName }}. {{ site.copyright.text }}
```
{% endraw %}

> Drafts and pages marked **noindex** are left out

#### Live reload {id="migration-3-2-reload"}

During `nib run` every rebuild reloaded the page twice, because the server also watched `prism.css` and `bootstrap.bundle.min.js`. In `.eleventy.js`, replace the `setServerOptions` call with:

```js
for (const folder of ["css/pages", "js/pages"]) {
  fs.mkdirSync(`${OUTPUT_DIR}/${folder}`, { recursive: true });
}

eleventyConfig.setServerOptions({
  watch: [
    `${OUTPUT_DIR}/css/global.css`,
    `${OUTPUT_DIR}/css/pages/**/*.css`,
    `${OUTPUT_DIR}/js/pages/**/*.js`,
  ],
});
```

> The folders are created first because the server ignores a folder that does not exist yet

#### Link previews {id="migration-3-2-previews"}

WhatsApp, Facebook, X and LinkedIn don't show SVG images, so shared links had no picture. Add a 1200×630 PNG as `src/frontend/assets/brand/og-image.png`, then in `base.njk` point `og:image` and `twitter:image` to it:

{% raw %}
```njk
<meta property="og:image" content="{{ site.url }}/assets/brand/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{{ site.siteName }}">
<meta name="twitter:image" content="{{ site.url }}/assets/brand/og-image.png">
<meta name="twitter:image:alt" content="{{ site.siteName }}">
```
{% endraw %}

#### eleventy-img {id="migration-3-2-eleventy-img"}

New projects no longer include `@11ty/eleventy-img`. If you never used the `image` shortcode, remove it:

``` {class="clickable button link-button copy"}
npm uninstall @11ty/eleventy-img
```

Then, in `.eleventy.js`, delete the `require("@11ty/eleventy-img")` line and the `eleventyConfig.addShortcode("image", ...)` block.
