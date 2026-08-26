# Introduction {id="introduction"}

## ✏️ What is Nibula {id="what-is-nibula"}

**Nibula** is an open source static site generator built on top of
[Eleventy (11ty)](https://www.11ty.dev/)

It has one clear **mission**: make the jump from small hand-written practice sites
to a real project setup as gentle as possible.

## 🎯 Why choose Nibula {id="why-choose-nibula"}

### Beginner friendly {id="beginner-friendly"}

If you've only ever written **HTML**, **CSS** and a bit of **JavaScript**, moving
to a **framework** usually feels like starting over. A new **syntax**, new
**rules**, new **folder structures**, and a pile of documentation to get through
before you can even see a page on screen.

**Nibula** is designed to avoid exactly that. You stay close to the three
languages you already know, and the **folder structure** stays small enough to
hold in your head — a handful of folders whose names say what's inside, instead
of a convention you have to study before it makes sense.

Everything else is **optional**. [Nunjucks](#what-is-nunjucks) adds loops and
includes to your **HTML**, [Markdown](#what-is-markdown) files can carry the same logic, [data files](#data-files)
can feed a whole page — but none of it is needed on day one. A page written in
plain **HTML** works just as well, and you pick the rest up when you have a reason
to.

### Ready to publish {id="ready-to-publish"}

The hard part of a first site usually isn't building it — it's everything that
comes after. **Meta tags**, a **sitemap**, a **robots.txt**, the [server config](#deploy)
your host expects: four things nobody taught you, all at once, right when you
thought you were done.

Nibula writes them while you work. Fill in two **data files** and the **SEO**
tags, the **sitemap** and `llms.txt` build themselves from your pages.
`.htaccess` and `web.config` are already in the output folder, ready to upload,
and an `nginx.conf` is waiting if you have your own server.

When your pages are done, you're done — there's no second phase where you have to
learn how to put a site online.

### Nothing is hidden {id="nothing-is-hidden"}

Every one of those files lives in the project, in the folder you'd expect, in the
form you'd have written by hand. When you need to change something, you open it
and change it — there's no **configuration layer** to learn first, and no
generated code you're not supposed to touch.

Even the **output folder** is yours to move: one command points the whole build
somewhere else — your local server's document root, for instance — and both the
dev server and your own keep serving the same files as you save. See
[Nibula CLI](#nibula-cli).

### A good fit for {id="a-good-fit-for"}

- **Showcase sites and portfolios** — a handful of pages, stable content, built
  to be found
- **Small business sites** — where a contact form on cheap shared hosting is the
  whole requirement, and the PHP backend is exactly that
- **Landing pages** — one page, fast, with the meta tags already in place
- **Project documentation** — like the page you're reading
- **The project you build to learn** — the one after the tutorials, when you want
  something real without picking up React first
- **A small blog** — up to a point: the assistant creates pages one at a time,
  which is fine for twenty posts and wrong for two hundred

## 🤔 When not to use it {id="when-not-to-use-it"}

**Nibula builds static pages.** If your site needs users to log in, save
something, or see different content depending on who they are, you want a
framework with a server behind it — Next.js, Nuxt, Laravel.

**It doesn't scale to hundreds of pages** coming from a database or a CMS. The
assistant creates pages one at a time, by hand, which is right for a site with
ten or twenty of them and wrong for a catalogue.

**If you already work with React, Vue or Angular, stay there.** Nibula's whole
point is being a first step for people who don't — for you it would be a step
sideways.

## ⚙️ About Eleventy (11ty) {id="about-eleventy"}

**Eleventy is the engine underneath.** It takes your templates and your data and
turns them into plain HTML files, once, when you build — which is why the result
is just a folder you can upload anywhere.

**Nibula is a layer on top, not a replacement.** Eleventy gives you the build;
Nibula adds the folder structure, the **SCSS** and **JavaScript** pipeline, the
page assistant, the **SEO** files and the server configs. Everything Eleventy can
do, your project can do — including the parts Nibula doesn't set up for you.

`.eleventy.js` sits in your project root, and it's the same configuration file
you'd find in any Eleventy project. When you need something beyond what Nibula
wires up — a new filter, a collection, a different output folder — the
[Eleventy documentation](https://www.11ty.dev/docs/) applies directly, with no
translation needed.