# <i class="bi bi-database"></i> Contenuti e dati {id="content-and-data"}

Due cartelle contengono le cose che servono al tuo sito ma che non sono markup: `assets/` e `data/`. La differenza è **quando** vengono usate.

`assets/` viene copiata così com'è nella cartella **out**, così il browser può raggiungere i suoi file mentre la pagina è in esecuzione. Immagini, font, icone, file scaricabili e i **JSON** che il tuo **JavaScript** vuole caricare.

`data/` viene letta mentre il sito fa la **build** e poi lasciata indietro. I suoi file **JSON** alimentano i tuoi [componenti](#what-is-a-component) e il tuo [Markdown](#what-is-markdown), e non arrivano mai nella cartella **out**, quindi niente lì dentro è scaricabile o raggiungibile da JavaScript.

## Gestione degli asset {id="assets-management"}

Tutto quello che il browser deve caricare va in `src/frontend/assets/`, con la struttura che preferisci. La cartella viene copiata mantenendo quella struttura, quindi il percorso che scrivi è il percorso che ha.

{% raw %}
```njk
src/frontend/assets/
├── brand/
│   ├── favicon.svg
│   ├── logo.svg
│   └── ...
├── images/
└── ...
```
{% endraw %}

> Puoi creare le tue cartelle personalizzate

### JSON che il browser può leggere {id="assets-json"}

Un file **JSON** in `assets/` può essere caricato dal tuo **JavaScript** mentre la pagina è in esecuzione:

`assets/data/products.json`
```json
[
  { "name": "Free", "price": 0 },
  { "name": "Pro", "price": 19 }
]
```

`js/modules/plans.js`
```javascript
const response = await fetch("/assets/data/products.json");
const products = await response.json();
```

È la scelta giusta quando i dati cambiano senza rifare la build del sito, o quando ti servono solo dopo che il visitatore fa qualcosa.

> Tutto quello che sta in `assets/` è pubblico. Non metterci mai chiavi, credenziali o niente di privato

## File di dati {id="data-files"}

`src/frontend/data/` contiene i file **JSON** che i tuoi template leggono mentre il sito fa la build.

Due ci sono fin dall'inizio: `site.json` con le impostazioni di tutto il sito, e `pages.json` con la [SEO](#seo) di ogni pagina.

Qualsiasi altro `.json` che aggiungi diventa disponibile da solo, con il nome del file:

`data/plans.json`
```json
[
  { "name": "Free", "price": "0" },
  { "name": "Pro", "price": "19" }
]
```

`frontend/components/plans.njk`
{% raw %}
```njk
<ul>
  {% for plan in plans %}
    <li>{{ plan.name }} — €{{ plan.price }}</li>
  {% endfor %}
</ul>
```
{% endraw %}

Nessun import, nessuna configurazione, nessun riavvio. La variabile prende il nome dal file, quindi `plans.json` diventa `plans`.

### In un file Markdown {id="data-in-markdown"}

Un file `.md` può usare gli stessi valori, ma non li vede da solo. Passaglieli quando includi il [componente markdown](#include-markdown):

{% raw %}
```njk
{% renderFile "example.md" | componentsPath, { plans: plans }, "md" %}
```
{% endraw %}

Inserire i valori nella pagina durante la build è più veloce per il visitatore: il contenuto è già lì quando la pagina arriva, e i motori di ricerca possono leggerlo. Caricarli con fetch è quello che ti serve quando i dati cambiano per conto loro, o quando sono troppi da mettere in ogni pagina.

> Lascia `data/` dov'è. È stata spostata fuori da `assets/` in una delle prime versioni proprio perché non venisse pubblicata