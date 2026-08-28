# Styling {id="styling"}

## 🎨 What is SCSS {id="what-is-scss"}

**SCSS** is basically the **CSS** you already know, with variables and nesting added. If you write it the way you're used to, it still works as you'd expect.

The browser doesn't read `.scss` directly: your files are compiled into one **CSS** file when the site builds. **Nibula** handles that, so there's nothing to set up.

## Structure {id="styling-structure"}

Every page has its own **SCSS** file and it will be named as the page name in **camel case**. It will be auto-generated under `src/frontend/scss/pages/` if you use the [Nibula cli](#nibula-cli)
> Example: `my-page.njk` (page file) is automatically linked to `myPage.scss`

You can just insert your rules there without touching anything else. These rules will be restricted to that page only, to prevent confusion and minimize **CSS** for each page 

Many **CSS** rules need to be repeated for each page instead (for example **header**, **typography** and **buttons** styles). To avoid the code repetition, you can divide every category of rules in modules to have smaller and self-explanatory, ordered as you prefer and add their rules in the page that you need with just 1 line, without repeating it.

```njk
src/frontend/scss/
├── root/
├── global.scss
├── modules/
└── pages/
```

## Create a module {id="styling-create-a-module"}
.

.

.

.

.

.
## Import a module {id="styling-import-a-module"}
.

.

.

.

.

.
## CSS frameworks {id="css-frameworks"}
.

.

.

.

.

.