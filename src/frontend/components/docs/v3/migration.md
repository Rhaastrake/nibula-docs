# Migration {id="migration"}

## What you need to change {id="migration-overview"}

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

## Stylesheets {id="migration-stylesheets"}

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

## Build scripts {id="migration-scripts"}

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

## Backend {id="migration-backend"}

Skip this section if you picked **None**.

**1.** Rename the two folders:

| Old | New |
|---|---|
| `src/backend/_core` | `src/backend/core` |
| `src/backend/api` | `src/backend/endpoints` |

The second one holds your route files, while `/api` stays the public URL prefix: your endpoints are still reached at `yoursite.com/api/endpoint`.

**2.** Update the path in the server files you edited yourself. The bundled `nginx.conf`, `.htaccess` and `web.config` already point at `backend/core`, but any rule you added by hand still names `_core`.

**3.** Make sure `config.js` (or `config.php`) exists next to the example file. The backend used to fall back to `example.config.js` when it was missing, which ships a publicly known API key and allows every origin. Now it refuses to start:

``` {class="clickable button link-button copy"}
cd src/backend
copy example.config.js config.js
```

**4.** A request to a protected endpoint without its key now answers **401** instead of **403**. If something on your side handles that answer, update it.

> While `APP_ENV` is not `production`, every response carries a `Debug-Mode` header. A quick way to tell whether a live site was left in debug mode

## Checking it worked {id="migration-check"}

``` {class="clickable button link-button copy"}
nib build
```

A clean build writes `out/css/global.css` next to the page stylesheets. Open a page and check in your browser's network tab that both files load.

With a backend, call an endpoint to see it answer:

``` {class="clickable button link-button copy"}
curl http://localhost:8080/api/example-public
```

> Nothing in `data/`, `routes/`, `components/` or `layouts/` needs touching beyond the one line added to `base.njk`