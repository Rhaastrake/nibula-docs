# SEO {id="seo"}

## What is SEO {id="what-is-seo"}
**SEO** is everything that helps search engines understand what every page of your site is about, so they can show it to the right people.

Someone looking for computer repair in their city searches for the service, not for your site name, they don't know it yet.

Most of it is content: a clear title, text that answers what someone searched for. The rest is a set of tags in the **head** tag of every page the title, the description, the image shown when the page is shared. Those tags are what **Nibula** writes for you.

You fill in two data files, and the layout turns them into tags, page by page.

| File | What it holds |
|---|---|
| `data/site.json` | The values shared by the whole site, used whenever a page doesn't set its own |
| `data/pages.json` | One record per page, with its own title, description and the rest |

## Each page SEO {id="each-page-seo"}

Every page has a record in `data/pages.json`, created for you when you add a page with the [Nibula CLI](#nibula-cli):

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

| Key | What it does |
|---|---|
| **title** | What appears in the browser tab and as the clickable line in search results |
| **description** | The paragraph under that line. Search engines often rewrite it, but it's your best shot |
| **keywords** | Ignored by search engines since years, but it stays your own data: useful if you build an internal search or related pages |
| **noindex** | `true` keeps the page out of search results |
| **canonical** | The address search engines should treat as the real one, when the same content is reachable from more than one URL |

Leave a field empty and the value from `site.json` is used instead. An empty **canonical** falls back to the page's own address, which is what you want almost always.

> The key is the page's **title** from its front matter, and that's how the layout finds the record. Change one without the other and the page loses its tags

## Best practices {id="seo-best-practices"}

**Write one title per page, and make it specific.** *Pricing · Acme* tells a reader more than *Home*. Keep it under about 60 characters, or search engines cut it off.

**Write the description for a person, not a robot.** It doesn't affect your ranking directly, but it's what convinces someone to click. Around 150 characters.

**Don't repeat the same description on every page.** Two identical descriptions tell a search engine the two pages are interchangeable.

**Fill in `site.json` before you publish.** Every page falls back to those values, so a site with *Site description* still in there ships that text everywhere.

**Use `noindex` for the pages that shouldn't be found** — a thank-you page after a form, a staging copy, a page you keep only for a link you sent someone.

**The `url` in `site.json` has to be the real one.** It builds the canonical link and the addresses in your sitemap. Get it wrong and you're pointing search engines at a site that doesn't exist.

## Sitemap generation {id="sitemap-generation"}

From those same two files **Nibula** also generates, at every build, three things that help machines read your site:

| What | Who reads it | What it is |
|---|---|---|
| `sitemap.xml` | Search engines | The list of your pages, so they're all found without following links |
| `llms.txt` | AI crawlers | The same list in plain text, with a short line about the site |
| **JSON-LD** | Both | A small block inside every page describing what the page is |

The **JSON-LD** lives in `src/frontend/layouts/base.njk` and needs nothing from you. Pages marked **noindex** and the **404** page are left out of the sitemap.

You never edit `sitemap.xml` directly: add a page with the CLI and it appears, remove one and it goes. What you *can* change is in `src/frontend/indexing/sitemap.njk`:

```
<changefreq>weekly</changefreq>
<priority>0.8</priority>
```

**changefreq** is how often the page changes: `daily` for a news section, `weekly` for a blog, `monthly` or `yearly` for pages you rarely touch. **priority** goes from `0.0` to `1.0` and says which pages matter most to you, with the homepage usually at `1.0`. Both are hints, and search engines are free to ignore them, so don't lose time over it.

In `src/frontend/indexing/llms.njk` you can add a couple of lines about what your site does and which pages matter, right under the title. It's a young format and few crawlers read it yet, but it costs one minute.

> All three are built from `pages.json`, so a page without a record is missing from them

## Robots & Crawlers {id="robots-and-crawlers"}

A **crawler** is the program a search engine sends around the web to read pages. `robots.txt` sits at the root of your site and tells it what it may visit.

**Nibula** generates it from `src/frontend/indexing/robots.njk`, pointing at your sitemap and allowing everything:

```
Sitemap: https://yoursite.com/sitemap.xml

User-agent: *
Disallow:
```

That's the right default for a public site. To keep a section out, edit `robots.njk` and add one line per path under `User-agent: *`:

```
Disallow: /private/
```

> `robots.txt` asks crawlers not to visit. It doesn't stop anyone: the page is still reachable by whoever has the address. To keep a page out of search results, use **noindex**