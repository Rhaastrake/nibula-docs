# <i class="bi bi-puzzle"></i> Componenti {id="components"}

## Cos'è un componente {id="what-is-a-component"}

Un componente è un pezzo di pagina che scrivi una volta e usi ovunque ti serva — un
header, una card, una sezione di testo. È solo un file in
`src/frontend/components/`, e non va registrato da nessuna parte.

Ce ne sono di due tipi, a seconda di cosa contengono.

### Creare un componente {id="create-a-component"}

Per creare un componente (**.njk** o **.md**), crea semplicemente un nuovo file sotto
`src/frontend/components/` e riempilo con il tuo contenuto.

Puoi creare le tue **sottocartelle** e organizzare il percorso dei componenti come
preferisci.

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

## Cos'è Nunjucks {id="what-is-nunjucks"}

Nunjucks (**.njk**) è in pratica un file **HTML** che sa fare qualche cosa in più, come istruzioni
**if**, cicli **for**, [include](#include-a-component) di altri componenti e
l'accesso ai tuoi [file di dati](#content-and-data).

È questo che ti permette di scrivere un header una volta e averlo su ogni pagina, o di costruire
una lista di card da un file **JSON** invece di copiare lo stesso markup dieci volte.

### Esempi di componenti Nunjucks {id="nunjucks-component-examples"}

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

Scrivere ogni elemento a mano qui va bene, ma smette di andare bene quando la lista
cresce o quando gli stessi valori compaiono in più di una pagina. È qui che
i file **.njk** ti aiutano: elenchi i tuoi valori una volta e ci fai un **ciclo** sopra.

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

Con tre elementi, scriverli a mano è più breve. I **cicli** diventano utili quando la **lista** cresce, o quando gli stessi valori alimentano più di una pagina

> Non sei obbligato a usarli. Scrivere il contenuto a mano funziona altrettanto bene, e puoi tornare ai cicli quando ti servono

## Cos'è Markdown {id="what-is-markdown"}

Markdown (**.md**) è il tipo di componente migliore se devi solo scrivere testo, come ***documentazione*** o un **articolo**.

I file Markdown sono facili da scrivere e da leggere anche in forma grezza. Puoi creare **titoli**, **liste**, **link**, **tabelle** ecc. con un solo simbolo invece dei tag **HTML**

### Esempi di componenti Markdown {id="markdown-component-examples"}

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
<summary>Risultato</summary>

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

Dal tuo [SCSS](#styling), punta ai tag dentro `.markdown-body` per raggiungere tutti i file [Markdown](#what-is-markdown) in una volta: è così che imposti cose come i **colori** dei titoli o i **bordi** delle tabelle in tutto il sito:

```scss
.markdown-body {
  .red-color {
    color: red;
    . . .
  }
  . . .
}
```

Il Markdown semplice non ti dà modo di impostare un **id** o una **class**, e nessuna logica. **Nibula** ti preconfigura entrambe le cose: **id e classi** tra parentesi graffe alla fine di una riga, così il tuo [SCSS](#styling) può raggiungere un punto preciso del testo:

```markdown
## Title {id="title-id" class="highlight"}

Go to [the title](#title-id)
```

<details>
<summary>Risultato</summary>

> ## Title {id="example-title-id" class="highlight"}
>
> Go to [the title](#example-title-id)

</details>

> I titoli ricevono già un **id** dal loro testo. Scriverne uno tu lo **sostituisce** con uno personalizzato

**Nibula** preconfigura anche Nunjucks dentro Markdown, così gli stessi **if**, **for** e variabili che usi in un file `.njk` funzionano anche in un file `.md`:

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
<summary>Risultato</summary>

> ## Our plans {class="reset"}
> - Free {class="reset"}
> - Pro {class="reset"}
> - Team {class="reset"}

</details>

> Funzionano anche i valori di un [file di dati](#data-files), ma solo se li passi quando [includi il file](#include-markdown) — un `.md` da solo non vede i tuoi dati

## Includere un componente {id="include-a-component"}

Un componente non fa nulla finché una pagina non lo richiama. Quella riga la scrivi in una [pagina](#page-structure), in un [layout](#layouts) o in un altro componente — una card può richiamare un bottone, una sezione può richiamare tre card.

I due tipi si includono in modo diverso, perché `.njk` è già un template mentre `.md` deve prima essere trasformato in HTML.

### Includere njk {id="include-njk"}

{% raw %}
```njk
{% include "feature-card.njk" ignore missing %}
```
{% endraw %}

I percorsi partono da `src/frontend/components/`, quindi quella parte non la scrivi mai.

> Se il componente è in una sottocartella, includi anche il percorso — per esempio `cards/feature-card.njk`
>
> **ignore missing** dice alla build di saltare l'include invece di fermarsi quando il file non c'è
>
> Il componente vede gli stessi valori che vede la pagina, quindi `{{ site.title }}` funziona senza passare nulla

### Includere markdown {id="include-markdown"}

Un file `.md` ha bisogno di `renderFile`, che lo converte e inserisce il risultato al suo posto. Questa stessa pagina è costruita così, mescolando componenti **.njk** e file **.md**.

{% raw %}
```njk
<div class="markdown-body">
    {% renderFile "your-file.md" | componentsPath, { site: site }, "njk,md" %}
</div>
```
{% endraw %}

Quella riga ha cinque parti:

| Parte | Cosa fa |
|---|---|
| **markdown-body** | Il contenitore che applica lo stile Markdown |
| **renderFile** | Trasforma il file in HTML e lo mette nella pagina |
| **componentsPath** | Completa la parte `src/frontend/components/` del percorso |
| **{ site: site }** | Passa al file i dati che gli servono |
| **"njk,md"** | Dice a Eleventy che il file è Nunjucks + Markdown |

Le parentesi graffe elencano cosa il **Markdown** può vedere: a sinistra il nome che userà il file, a destra i dati che stai passando. Quindi `{ site: site }` ti permette di scrivere `{{ site.title }}` dentro il file — vedi [file di dati](#data-files).

> Passane quanti ne servono al file: **{ site: site, pages: pages }**. Senza di essi, un `{{ site.title }}` scritto dentro il Markdown risulta vuoto
>
> Le **sottocartelle** funzionano come per i file `.njk` — `legal/privacy-policy.md`