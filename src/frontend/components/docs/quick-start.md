# Quick start {id="quick-start"}

## 📋 Prerequisites {id="prerequisites"}

### Required {id="required"}

- **Node.js** — v18.0.0 or higher
- **Composer** — latest version, only if you pick the PHP backend
- **Better Nunjucks** — VS Code extension by Ed Heltzel, for syntax highlighting in **.njk** files

### Recommended {id="recommended"}

- **Material Icon Theme** — VS Code extension by Philipp Kief

## 📦 Installation {id="installation"}

Install Nibula once, globally:

``` {class="button link-button copy"}
npm install -g nibula
```

This gives you the **nib** command, with **nbl** and **nibula** as aliases.

Global means you install it once on your machine, not once per project — from
then on **nib** is available from any folder.

Once installed, these are the commands you'll use:

| Command | What it does |
|---|---|
| **nib new** | Creates a new project |
| **nib run** | Starts the dev server and rebuilds as you save |
| **nib build** | Builds the site for publishing |
| **nib clean** | Empties the output folder |
| **nib cli** | Opens the assistant to add, rename or remove pages |
| **nib update** | Updates Nibula itself |
| **nib ver** | Prints the version in use |

See [Nibula CLI](#nibula-cli) for what the assistant can do.

## 🚀 Project creation {id="project-creation"}

From the folder where you keep your websites, run:

``` {class="button link-button copy"}
nib new your-project
```

The scaffolder asks you three things:

| Question | Options |
|---|---|
| Language | [JavaScript or TypeScript](#javascript-or-typescript) |
| CSS framework | Bootstrap, Bulma, Foundation, UIkit, or none |
| Backend | [Node.js or PHP](#node-or-php) |

> **TypeScript** adds types to JavaScript — pick it if you already know what that means, otherwise JavaScript is the safer start.
>
> The **CSS framework** can be switched later by commenting a few lines.
>
> The **Backend** is the choice worth getting right: Node and PHP offer the same API, but they run in very different places — see [Deploy](#deploy).

Dependencies are installed for you. If you pick Node, the Composer step is
skipped entirely, so you don't need Composer on your machine at all.

Then move into the project and start the dev server:

``` {class="button link-button copy"}
cd your-project
```

``` {class="button link-button copy"}
nib run
```

Your site is now at **localhost:8080**, and it rebuilds every time you save a file.