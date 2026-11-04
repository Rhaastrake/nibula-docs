# <i class="bi bi-palette"></i> Stile {id="styling"}

## Cos'è SCSS {id="what-is-scss"}

**SCSS** è in pratica il **CSS** che già conosci, con in più variabili e annidamento. Se lo scrivi come sei abituato, funziona comunque come ti aspetti.

Il browser non legge direttamente i file `.scss`: i tuoi file vengono compilati in un unico file **CSS** quando il sito viene generato con la build. Se ne occupa **Nibula**, quindi non c'è niente da configurare.

## Struttura {id="styling-structure"}

Ogni pagina ha il suo file **SCSS**, con il nome della pagina in **camel case**. Viene creato per te in `src/frontend/scss/pages/` quando aggiungi una pagina con la [CLI di Nibula](#nibula-cli).

> Per esempio `my-page.njk` (file della pagina) viene collegato automaticamente a `myPage.scss`

Puoi scrivere lì le tue regole senza toccare nient'altro. Valgono solo per quella **pagina**, così tutto resta chiaro e il **CSS** di ogni pagina resta leggero.

`scss/pages/myPage.scss`
```scss
@use "../root" as root; // Usage: root.$value-name

@import "../global";

.page-element {
    background-color: root.$custom-color;
}
```

Ogni pagina dovrebbe dichiarare `@use '../root' as root;` e `@import '../global';`, ma cosa significano?

**root** è semplicemente un contenitore con tutti i tuoi **valori con nome** personalizzati:

`scss/_root.scss`
```scss
$header-height: 10vh;
$header-padding-y: 15px;
$header-padding-x: 15px;

$header-footer-color: #11474b;
```

**global** invece è un modulo già pronto con le regole da applicare a ogni pagina, compresi gli import dei moduli, così li scrivi una volta sola

Ecco alcuni moduli che **Nibula** crea già per te:

| File | Cosa definisce |
|---|---|
| `_typography.scss` | Font e regole del testo |
| `_header.scss` | Gli stili dell'header |
| `_footer.scss` | Gli stili del footer |
| `_markdown.scss` | Lo stile dei [file Markdown](#include-markdown) |


> `_markdown.scss` non va toccato

> Il trattino basso iniziale indica un file pensato per essere importato, non per essere compilato in un foglio di stile a sé

## Moduli {id="styling-modules"}

Puoi creare i tuoi moduli **SCSS** personalizzati in `src/frontend/scss/modules/`, con un trattino basso davanti al nome.

Ricordati di dichiarare `@use "../root" as root;` per accedere ai valori a cui hai dato un nome e che vuoi riusare

`modules/_exampleModule.scss`
```scss
@use "../root" as root;

.default-card {
  padding: 1rem;
  border-radius: 6px;
  background-color: root.$primary-color;
}
```

> Funzionano anche le sottocartelle. Un livello più in basso il percorso cambia: `@use "../../root" as root`
>
> L'`@import` di global non va messo qui, ma nelle pagine

Una volta creato il modulo, basta un `@import` in **global** o nel file della pagina dove vuoi applicarlo

> L'ordine conta: una regola importata dopo vince su una precedente con la stessa specificità. Per questo il **framework CSS** viene prima e i tuoi moduli dopo

## Framework CSS {id="css-frameworks"}

Un **framework CSS** è una libreria di stili già pronti, costruiti per te. Ne hai **scelto** uno tra **Bootstrap, **Bulma**, **Foundation** e **UIkit**, che **Nibula** ha già preinstallato per te quando hai creato il progetto!

> Sei libero di non usarli se vuoi restare sul semplice, ma ecco i link alla documentazione di ciascuno
> (Niente da installare)
> 
> [Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/) | 
> [Bulma](https://bulma.io/documentation/) | 
> [Foundation](https://get.foundation/sites/docs/) | 
> [UIkit](https://getuikit.com/docs/accordion) | 

Vengono **importati** in `scss/_globlal.scss` tra root e gli altri tuoi moduli. I tuoi moduli vengono importati dopo, così hanno la priorità nello stile

A volte un intero framework **CSS** può essere inutilmente pesante per le tue pagine, soprattutto se ne usi solo poche cose. Puoi filtrarlo per singoli micro moduli **CSS** semplicemente commentando i loro import in `scss/modules/frameworks/_FRAMEWORK.scss`.

`scss/modules/frameworks/_bootstrap.scss`
```scss
@import "bootstrap/scss/alert";            // Alerts
@import "bootstrap/scss/badge";            // Badges
@import "bootstrap/scss/breadcrumb";       // Breadcrumbs
. . .
```

Puoi anche **passare** da uno all'altro o non usarne **nessuno**, solo commentando/decommentando qualche riga in 3 file diversi:


`scss/_global.scss`
```scss
. . .
@import "modules/frameworks/bootstrap";
// @import "modules/frameworks/bulma";
// @import "modules/frameworks/foundation";
// @import "modules/frameworks/uikit";
. . .
```

`frontend/layouts/base.njk` (o il file del tuo [layout personalizzato](#layouts))
{% raw %}
```njk
{# Bootstrap JS #}
<script src="{{ '/js/bootstrap.bundle.min.js' | url }}" defer></script>

{# Foundation JS #}
{# <script src="{{ '/js/foundation.min.js' | url }}" defer></script> #}

{# UIkit JS #}
{# <script src="{{ '/js/uikit.min.js' | url }}" defer></script> #}
{# <script src="{{ '/js/uikit-icons.min.js' | url }}" defer></script> #}

{# Bulma — no JS needed #}
```
{% endraw %}

`.eleventy.js`
```js
eleventyConfig.addPassthroughCopy({
// Bootstrap
"node_modules/bootstrap/dist/js/bootstrap.bundle.min.js":
    "js/bootstrap.bundle.min.js",
"node_modules/bootstrap-icons/font/fonts": "css/fonts",

// Foundation
// "node_modules/foundation-sites/dist/js/foundation.min.js": "js/foundation.min.js",

// UIkit
// "node_modules/uikit/dist/js/uikit.min.js": "js/uikit.min.js",
// "node_modules/uikit/dist/js/uikit-icons.min.js": "js/uikit-icons.min.js",

// Bulma — CSS only, no JS passthrough needed
});
```