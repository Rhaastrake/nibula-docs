# <i class="bi bi-rocket-takeoff"></i> Quick start {id="quick-start"}

## Prerequisites {id="prerequisites"}

### Required {id="required"}

- **Node.js**: v18.0.0 or higher
- **Composer**: latest version, only if you pick the PHP backend
- **Better Nunjucks**: VS Code extension by Ed Heltzel, for syntax highlighting in **.njk** files

### Recommended {id="recommended"}

- **Material Icon Theme**: VS Code extension by Philipp Kief

## Installation {id="installation"}

Install Nibula once, globally:

{% renderFile "installation-command.md" | componentsPath, "njk,md" %}

This gives you the **nib** command, with **nbl** and **nibula** as aliases.

Global means you install it once on your machine, not once per project. From
then on **nib** is available from any folder.

Once installed, these are the commands you'll use:

| Command | What it does |
|---|---|
| **nib new** | Creates a new project (`--overwrite` replaces an existing one *from 3.2*) |
| **nib run** | Starts the dev server and rebuilds as you save |
| **nib build** | Builds the site for publishing |
| **nib clean** | Empties the output folder |
| **nib create** | Creates a page *(from 3.1)* |
| **nib rename** | Renames a page *(from 3.1)* |
| **nib remove** | Removes a page *(from 3.1)* |
| **nib path** | Shows or changes where the output folder goes *(from 3.1)* |
| **nib cli** | Opens the assistant to add, rename or remove pages. It will be removed in Nibula 4 |
| **nib update** | Updates Nibula itself |
| **nib ver** | Prints the version in use |

> **nib create**, **nib rename**, **nib remove** and **nib path** are available from Nibula 3.1. Run **nib ver** to see which version you have

> The **--overwrite** option of **nib new** is available from Nibula 3.2

See [Nibula CLI](#nibula-cli) for what the assistant and these commands can do.

## Project creation {id="project-creation"}

From the folder where you keep your websites, run:

``` {class="clickable button link-button copy"}
nib new your-project
```

The scaffolder asks you three things:

| Question | Options |
|---|---|
| Language | [JavaScript or TypeScript](#javascript-or-typescript) |
| CSS framework | Bootstrap, Bulma, or none |
| Backend | [Node.js or PHP](#node-or-php), or none for a static site *(from 3.2)* |

> **TypeScript** adds types to JavaScript: pick it if you already know what that means, otherwise JavaScript is the safer start.
>
> The **CSS framework** can be switched later by commenting a few lines.
>
> The **Backend** is the choice worth getting right: Node and PHP offer the same API, but they run in very different places (see [Deploy](#deploy)).

Dependencies are installed for you. If you pick Node, the Composer step is
skipped entirely, so you don't need Composer on your machine at all. With no backend, the project gets no `src/backend` folder.

From 3.2, if **git** is installed, the project also starts as a git repository. If a project with the same name is already there, the scaffolder asks before replacing it: add `--overwrite` to replace it without asking.

``` {class="clickable button link-button copy"}
nib new your-project --overwrite
```

Then move into the project and start the dev server:

``` {class="clickable button link-button copy"}
cd your-project
```

``` {class="clickable button link-button copy"}
nib run
```

Your site is now at **localhost:8080**, and it rebuilds every time you save a file.