# Components {id="components"}

## What is a component {id="what-is-a-component"}

A component is a piece of a page you write once and use wherever you need it — a
header, a card, a section of text. It's just a file in
`src/frontend/components/`, and nothing has to be registered anywhere.

There are two kinds, depending on what's inside.

### Create a component {id="create-a-component"}

To create a component (**.njk** or **.md**), just create a new file under
`src/frontend/components/` and fill it with your content.

You can create your custom **subfolders** and organize the components path as you
prefer.

{% raw %}
```njk
src/frontend/components/
├── global/
│   ├── header.njk
│   └── footer.njk
├── legal/
│   ├── privacy-policy.md
│   └── . . .
├── cards/
│   ├── feature-card.njk
│   └── . . .
└── . . .
```
{% endraw %}

## What is Nunjucks {id="what-is-nunjucks"}

Nunjucks (**.njk**) is basically an **HTML** file that can do a few more things like **if**
statements, **for** loops, [includes](#include-a-component) of other components and
access to your [data files](#content-and-data).

That's what lets you write a header once and have it on every page, or build a
list of cards from a **JSON** file instead of copying the same markup ten times.

### Nunjucks component examples {id="nunjucks-component-examples"}

`components/feature-card.njk`
{% raw %}
```njk
<div class="pricing-card">
    <h3>Professional</h3>
    <p>€19 / month</p>
    <ul>
        <li>Unlimited projects</li>
        <li>Priority support</li>
        <li>Custom domain</li>
    </ul>
    <a class="btn" href="/signup/">Subscribe</a>
</div>
```
{% endraw %}

Writing every item by hand is fine here, but it stops being fine when the list
grows or when the same values appear on more than one page. This is where
**.njk** files help: you list your values once and **loop** over them.

`components/feature-card.njk`
{% raw %}
```njk
{% set features = ["Unlimited projects", "Priority support", "Custom domain"] %}

<div class="pricing-card">
    <h3>Professional</h3>
    <p>€19 / month</p>
    <ul>
        {% for feature in features %}
            <li>{{ feature }}</li>
        {% endfor %}
    </ul>
    <a class="btn" href="/signup/">Subscribe</a>
</div>
```
{% endraw %}

With three items, writing them out by hand is shorter. **Loops** earn their keep when the **list** grows, or when the same values feed more than one page

> You don't have to use this. Writing the content out by hand works just as well, and you can come back to loops when you need them

## What is Markdown {id="what-is-markdown"}

Markdown (**.md**) is your best choice of component if you just need to write text like ***documentation*** or an **article**.

They are easy to write and read even in raw form. You can create **headings**, **lists**, **links**, **tables** etc with just 1 symbol instead of **HTML** tags

### Markdown component examples {id="markdown-component-examples"}

`components/example.md`
```markdown
## h2 title

A paragraph of plain text. You can make a word **bold** or _italic_.

- List element
- Another one

### h3 title

One more paragraph, with a [link](https://github.com/rhaastrake/nibula) in it.

A table

| Column | Another |
| ------ | ------- |
| Value  | Value   |
| Value  | Value   |
```

<details>
<summary>Result</summary>

> ## h2 title {class="reset"}
>
> A paragraph of plain text. You can make a word **bold** or _italic_. {class="reset"}
>
> - List element {class="reset"}
> - Another one {class="reset"}
>
> ### h3 title {class="reset"}
>
> One more paragraph, with a [link](https://github.com/rhaastrake/nibula) in it. {class="reset"}
>
> A table {class="reset"}
>
> | Column | Another |
> | ------ | ------- |
> | Value  | Value   |
> | Value  | Value   |

</details>

From your [SCSS](#styling), target the tags inside `.markdown-body` to reach every [Markdown](#what-is-markdown) file at once, and it's how you set things like heading **colours** or table **borders** across the whole site:

```scss
.markdown-body {
  .red-color {
    color: red;
    . . .
  }
  . . .
}
```

Plain Markdown gives you no way to set an **id** or a **class**, and no logic. **Nibula** preconfigures both for you: **Ids and classes** in curly braces at the end of a line, so your [SCSS](#styling) can reach a specific piece of text:

```markdown
## Title {id="title-id" class="highlight"}

Go to [the title](#title-id)
```

<details>
<summary>Result</summary>

> ## Title {id="example-title-id" class="highlight"}
>
> Go to [the title](#example-title-id)

</details>

> Headings already get an **id** from their text. Writing one yourself **replaces** it with a custom one

**Nibula** also preconfigures Nunjucks inside Markdown, so the same **if**, **for** and variables you use in a `.njk` file work in a `.md` file too:

`components/plans.md`
{% raw %}
```njk
## Our plans

{% set plans = ["Free", "Pro", "Team"] %}

{% for plan in plans %}
- {{ plan }}
{% endfor %}
```
{% endraw %}

<details>
<summary>Result</summary>

> ## Our plans {class="reset"}
> - Free {class="reset"}
> - Pro {class="reset"}
> - Team {class="reset"}

</details>

> Values from a [data file](#data-files) work too, but only if you pass them when you [include the file](#include-markdown) — a `.md` doesn't see your data on its own

## Include a component {id="include-a-component"}

A component does nothing until a page asks for it. You write that line in a [page](#page-structure), in a [layout](#layouts), or in another component — a card can pull in a button, a section can pull in three cards.

The two kinds are included differently, because `.njk` is already a template while `.md` has to be turned into HTML first.

### Include njk {id="include-njk"}

{% raw %}
```njk
{% include "feature-card.njk" ignore missing %}
```
{% endraw %}

Paths start from `src/frontend/components/`, so you never write that part.

> If the component is in a subfolder, include the path too — for example `cards/feature-card.njk`
>
> **ignore missing** tells the build to skip the include instead of stopping when the file isn't there
>
> The component sees the same values the page sees, so `{{ site.title }}` works without passing anything

### Include markdown {id="include-markdown"}

A `.md` file needs `renderFile`, which converts it and drops the result in place. This very page is built that way, mixing **.njk** components and **.md** files.

{% raw %}
```njk
<div class="markdown-body">
    {% renderFile "your-file.md" | componentsPath, { site: site }, "njk,md" %}
</div>
```
{% endraw %}

Five parts to that line:

| Part | What it does |
|---|---|
| **markdown-body** | The wrapper that applies the Markdown styling |
| **renderFile** | Turns the file into HTML and puts it in the page |
| **componentsPath** | Fills in the `src/frontend/components/` part of the path |
| **{ site: site }** | Hands the file the data it needs |
| **"njk,md"** | Tells Eleventy the file is Nunjucks + Markdown |

The curly braces list what the **Markdown** is allowed to see: on the left the name the file will use, on the right the data you're passing. So `{ site: site }` lets you write `{{ site.title }}` inside the file — see [data files](#data-files).

> Pass as many as the file needs: **{ site: site, pages: pages }**. Without them, a `{{ site.title }}` written inside the Markdown comes out empty
>
> **Subfolders** work the same way as `.njk` files — `legal/privacy-policy.md`