# <i class="bi bi-palette"></i> Stile {id="styling"}

## Cos'è SCSS {id="what-is-scss"}

**SCSS** è in pratica il **CSS** che già conosci, con in più variabili e annidamento. Se lo scrivi come sei abituato, funziona comunque come ti aspetti.

Il browser non legge direttamente i file `.scss`: i tuoi file vengono compilati in **CSS** durante la build del sito. Se ne occupa **Nibula**, quindi non c'è niente da configurare.

## Struttura {id="styling-structure"}

Ogni pagina ha il suo file **SCSS**, con il nome della pagina in **camel case**. Viene creato per te in `src/frontend/scss/pages/` quando aggiungi una pagina con la [CLI di Nibula](#nibula-cli).

> Per esempio `my-page.njk` (file della pagina) viene collegato automaticamente a `myPage.scss`

Puoi scrivere lì le tue regole senza toccare nient'altro. Valgono solo per quella **pagina**, così ogni pagina scarica solo il **CSS** che le serve.

`scss/pages/myPage.scss`
```scss
@use "../root" as root; // Usage: root.$value-name

.page-element {
    background-color: root.$custom-color;
}
```

Quella sola riga dà alla pagina l'accesso a **root**, un contenitore con tutti i tuoi **valori con nome** personalizzati:

`scss/_root.scss`
```scss
$header-height: 10vh;
$header-padding-y: 15px;
$header-padding-x: 15px;

$header-footer-color: #11474b;
```

Le regole condivise da tutte le pagine stanno in `scss/global.scss`, che il [layout](#what-base-gives-you) carica prima del file della pagina. Non devi importarlo da nessuna parte: arriva da solo, e il browser lo scarica una volta sola per tutto il sito.

Ecco i moduli che **Nibula** crea già per te, tutti importati in **global**:

| File | Cosa stilizza |
|---|---|
| `_typography.scss` | Font e regole del testo |
| `_header.scss` | Gli stili dell'header |
| `_footer.scss` | Gli stili del footer |
| `_markdown.scss` | Lo stile dei [file Markdown](#include-markdown) |

> `_markdown.scss` viene generato invece di essere scritto a mano, quindi non c'è motivo di modificarlo
>
> Il trattino basso iniziale indica un file pensato per essere importato, non compilato in un foglio di stile a sé. `global.scss` non ce l'ha, perché diventa un vero file `.css` che il layout carica

## Moduli {id="styling-modules"}

Puoi creare il tuo modulo **SCSS** personalizzato in `src/frontend/scss/modules/`, con un trattino basso davanti al nome.

Ricordati di dichiarare `@use "../root" as root;` per accedere ai valori a cui hai dato un nome e che vuoi riutilizzare.

`modules/_exampleModule.scss`
```scss
@use "../root" as root;

.default-card {
  padding: 1rem;
  border-radius: 6px;
  background-color: root.$primary-color;
}
```

> Funzionano anche le sottocartelle. Un livello più in profondità il percorso cambia: `@use "../../root" as root`

Una volta creato il modulo, fai `@import` in **global** se serve a tutte le pagine, o nel file di una singola pagina se serve solo a quella.

> L'ordine conta: una regola importata dopo vince su una precedente con la stessa specificità. Per questo il **framework CSS** viene prima e i tuoi moduli dopo

## Framework CSS {id="css-frameworks"}

Un **framework CSS** è una libreria di stili già pronti, costruiti per te. Ne hai **scelto** uno tra **Bootstrap** e **Bulma** quando hai creato il progetto, e **Nibula** l'ha installato per te.

> Sei libero di non usarli se vuoi restare sul semplice, ma ecco la documentazione di ciascuno
>
> - [Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
> - [Bulma](https://bulma.io/documentation/)

Sono **importati** in `scss/global.scss` prima dei tuoi moduli, così le tue regole vincono sempre.

A volte un framework **CSS** completo è più pesante di quanto serva alle tue pagine, soprattutto se ne usi solo poche cose. Puoi filtrarlo commentando gli import che non ti servono in `scss/modules/frameworks/_FRAMEWORK.scss`.

`scss/modules/frameworks/_bootstrap.scss`
```scss
@import "bootstrap/scss/alert";            // Alerts
@import "bootstrap/scss/badge";            // Badges
@import "bootstrap/scss/breadcrumb";       // Breadcrumbs
. . .
```

Puoi anche **passare** dall'uno all'altro, o non usarne **nessuno**, commentando e decommentando poche righe in tre file.

> Le classi nelle tue pagine sono un'altra storia: ogni framework ha le sue, quindi un `btn btn-primary` diventa un `button is-primary`. Cambiare costa poco il primo giorno, molto quando hai venti pagine

`scss/global.scss`
```scss
. . .
@import "modules/frameworks/bootstrap";
// @import "modules/frameworks/bulma";
. . .
```

`frontend/layouts/base.njk` (o il file del tuo [layout personalizzato](#layouts))
{% raw %}
```njk
{# Bootstrap JS #}
<script src="{{ '/js/bootstrap.bundle.min.js' | url }}" defer></script>

{# Bulma — no JS needed #}
```
{% endraw %}

`.eleventy.js`
```js
eleventyConfig.addPassthroughCopy({
// Bootstrap
"node_modules/bootstrap/dist/js/bootstrap.bundle.min.js": "js/bootstrap.bundle.min.js",
"node_modules/bootstrap-icons/font/fonts": "css/fonts",

// Bulma — CSS only, no JS passthrough needed
});
```