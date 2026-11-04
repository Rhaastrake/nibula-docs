# <i class="bi bi-diagram-3"></i> Struttura della pagina {id="page-structure"}

## Composizione {id="composition"}

### Le impostazioni della pagina {id="the-page-settings"}

Ogni pagina vive in `routes/` come file **.njk**.

{% raw %}
```njk
---
title: "my-page"
permalink: "/"
layout: base.njk
---
```
{% endraw %}

| Chiave | Descrizione | 
| --- | --- |
| **title** | Il nome interno della pagina. Cambiarlo rompe i suoi stili e i suoi script, quindi lascialo com'è |
| **permalink** | L'indirizzo che la pagina avrà sul tuo sito |
| **layout** | L'aspetto in cui viene costruita la pagina (vedi [layout](#layouts)) |

> Il **permalink** ha bisogno di uno slash a entrambe le estremità: **/my-page/**, non **my-page**

### Di cosa è fatta una pagina {id="what-a-page-is-made-of"}

Una pagina è fatta di tre file, più una voce in un [file di dati](#data-files) condiviso.

| File | Cosa contiene |
|---|---|
| `routes/my-page.njk` | La pagina stessa: le sue impostazioni e il suo contenuto |
| `scss/pages/myPage.scss` | Gli stili che valgono solo per questa pagina |
| `js/pages/myPage.js` | Il codice che gira solo su questa pagina |

> La route usa il nome così come l'hai scritto; il foglio di stile e lo script
> usano la sua forma in camelCase. L'assistente fa la conversione per te.

Quella voce si trova in `data/pages.json` (vedi [SEO di ogni pagina](#each-page-seo)):

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

Puoi crearli, eliminarli o rinominarli a mano, oppure lasciare che lo faccia la
[Nibula CLI](#nibula-cli) per te — compresa quella voce, la più facile da dimenticare.

Nel file della tua pagina (`routes/my-page.njk`) scrivi solo il contenuto HTML di quella pagina — finisce automaticamente dentro il tag **main**. Tutto ciò che sta intorno arriva dal [layout](#layouts).

Puoi scrivere quel contenuto direttamente nella pagina, oppure dividerlo in
[componenti](#what-is-a-component) — file separati che scrivi una volta e richiami in
qualsiasi pagina con una sola riga.

## Layout {id="layouts"}

Un layout è il guscio in cui viene renderizzata una pagina. La tua pagina fornisce il contenuto; il layout fornisce tutto ciò che sta intorno — l'**head**, l'**header**, il **footer**, i fogli di stile e gli script.

I layout si trovano in `src/frontend/layouts/`, e ogni pagina ne sceglie uno nelle
sue impostazioni:
 
{% raw %}
```njk
---
title: "homepage"
permalink: "/"
layout: base.njk
---
```
{% endraw %}
 
### Cosa ti dà base.njk {id="what-base-gives-you"}
 
`base.njk` è quello predefinito, ed è quello con cui parte ogni nuova pagina. Scrive per te:

> Puoi sceglierne un altro con la [Nibula CLI](#nibula-cli) quando crei la pagina — se ne hai più di uno
 
| Parte | Cosa fa |
|---|---|
| **head** | Il titolo della pagina, la descrizione, il link canonical e i tag di anteprima social, presi dai tuoi [file di dati](#data-files) |
| **favicon** | I tre tag delle icone, che puntano a `assets/brand/` |
| **CSS** | Il foglio di stile globale e quello della pagina corrente, più eventuali link CDN che hai indicato per essa |
| **header** e **footer** | Inclusi da `components/global/`, quindi sono identici su ogni pagina |
| **JS** | Lo script della pagina corrente, il bundle del framework ed eventuali script da CDN |
 
Il foglio di stile e lo script della pagina vengono trovati tramite il **title**: una pagina con title **myPage** carica `css/pages/myPage.css` e `js/pages/myPage.js`. Lo stesso nome è la chiave della sua voce in `data/pages.json` — ecco perché il title non va cambiato a mano.

Il foglio di stile globale viene caricato prima di quello della pagina, quindi le regole della tua pagina vincono sempre.
 
### Caricare qualcosa da un CDN {id="page-cdn"}
 
Se una pagina ha bisogno di una **libreria** che non è nel tuo progetto — una libreria di grafici, un font,
un set di icone — inserisci il suo URL nella voce di quella pagina in `data/pages.json`:
 
```json
"myPage": {
  "seo": { ... },
  "cdn": {
    "css": [
      "https://cdn.example.com/lib.min.css",
      "https://cdn.another.com/lib.min.css"
      ],
    "js": [
      "https://cdn.example.com/lib.min.js",
      "https://cdn.another.com/lib.min.js"
      ]
  }
}
```
 
Il layout li aggiunge solo a quella pagina, così una libreria usata in una pagina non
viene scaricata in tutte le altre.

> Se vuoi aggiungere un **CDN** a tutte le pagine, devi aggiungere un link nel layout

### Crearne uno tuo {id="custom-layouts"}

Potrebbe servirti un login a schermo intero che parte direttamente con il contenuto, un
**header diverso** su un gruppo di pagine, o un **CDN** caricato su tutte
invece che una alla volta.

Un layout personalizzato conviene quando qualcosa cambia per *alcune* pagine. Se
cambia per tutte, modifica direttamente `base.njk`.

Copia `layouts/base.njk`, dai alla copia un nome tuo e cambia solo ciò che
serve a quelle pagine.

### Esempi di layout personalizzati {id="custom-layout-examples"}

**Niente header e niente footer.** Per una pagina che riempie lo schermo da sola, crea
`layouts/straight-content.njk` e rimuovi i due include globali:

{% raw %}
```njk
<body>
    <!-- Drop this -->
    {% include "global/header.njk" ignore missing %}

    <main>
        {{ content | safe }}
    </main>

    <!-- Drop this -->
    {% include "global/footer.njk" ignore missing %}
</body>
```
{% endraw %}

> Quei due arrivano da `components/global/` — vedi
> [componenti](#what-is-a-component)

**Un header diverso.** Fai puntare l'[include](#include-a-component) a un altro
componente:

{% raw %}
```njk
{% include "global/landing-header.njk" ignore missing %}
```
{% endraw %}

**Una libreria solo su alcune pagine.** Aggiungi il link nell'head, accanto agli altri —
non serve ripeterlo nella lista **CDN** di ogni pagina:

{% raw %}
```njk
<link rel="stylesheet" href="https://cdn.example.com/lib.min.css">
```
{% endraw %}

Tutto ciò che lasci com'è — i tag [SEO](#seo), i link a fogli di stile e script —
continua a funzionare senza che tu lo tocchi.

Poi fai puntare una pagina al tuo **layout**:

{% raw %}
```njk
---
title: "login"
permalink: "/login/"
layout: straight-content.njk
---
```
{% endraw %}

## Nibula CLI {id="nibula-cli"}

### Opzioni {id="nibula-cli-options"}

L'assistente scrive per te i tre file e la voce in `pages.json`, mantenendo i nomi allineati. Eseguilo da qualsiasi punto dentro un progetto:

``` {class="clickable button link-button copy"}
nib cli
```

| Opzione | Cosa fa |
|---|---|
| **Create page** | Scrive i tre file e la voce, chiedendo quale [layout](#layouts) usare se ne hai più di uno |
| **Remove page** | Li elimina tutti, dopo aver chiesto conferma |
| **Rename page** | Rinomina i file, aggiorna il front matter e sposta la voce |

> **homepage** `(index.njk)` e **404** sono protette — l'assistente non le tocca

La rinomina non tocca il contenuto della voce: il titolo SEO, la descrizione e i link CDN restano come li hai scritti, e lo stesso vale per i componenti che hai incluso.

Una nuova pagina arriva vuota, a parte le sue impostazioni e due esempi commentati — uno per un [componente](#include-a-component), uno per un [file markdown](#what-is-markdown).