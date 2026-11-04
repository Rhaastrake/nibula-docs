# <i class="bi bi-search"></i> SEO {id="seo"}

## Cos'è la SEO {id="what-is-seo"}
La **SEO** è tutto ciò che aiuta i motori di ricerca a capire di cosa parla ogni pagina del tuo sito, così possono mostrarla alle persone giuste.

Chi cerca una riparazione di computer nella sua città cerca il servizio, non il nome del tuo sito: non lo conosce ancora.

Gran parte è contenuto: un titolo chiaro, un testo che risponde a ciò che qualcuno ha cercato. Il resto è un insieme di tag nel tag **head** di ogni pagina: il titolo, la descrizione, l'immagine mostrata quando la pagina viene condivisa. Quei tag sono ciò che **Nibula** scrive per te.

Tu compili due file di dati, e il layout li trasforma in tag, pagina per pagina.

| File | Cosa contiene |
|---|---|
| `data/site.json` | I valori condivisi da tutto il sito, usati ogni volta che una pagina non imposta i propri |
| `data/pages.json` | Un record per pagina, con il suo titolo, la sua descrizione e il resto |

## SEO di ogni pagina {id="each-page-seo"}

Ogni pagina ha un record in `data/pages.json`, creato per te quando aggiungi una pagina con la [CLI di Nibula](#nibula-cli):

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

| Chiave | Cosa fa |
|---|---|
| **title** | Ciò che compare nella scheda del browser e come riga cliccabile nei risultati di ricerca |
| **description** | Il paragrafo sotto quella riga. I motori di ricerca spesso lo riscrivono, ma è la tua occasione migliore |
| **keywords** | Ignorato dai motori di ricerca da anni, ma resta un tuo dato: utile se costruisci una ricerca interna o pagine correlate |
| **noindex** | `true` tiene la pagina fuori dai risultati di ricerca |
| **canonical** | L'indirizzo che i motori di ricerca devono considerare quello vero, quando lo stesso contenuto è raggiungibile da più di un URL |

Se lasci un campo vuoto, viene usato al suo posto il valore di `site.json`. Un **canonical** vuoto ricade sull'indirizzo della pagina stessa, che è quasi sempre ciò che vuoi.

> La chiave è il **title** della pagina nel suo front matter, ed è così che il layout trova il record. Se cambi uno senza l'altro, la pagina perde i suoi tag

## Buone pratiche {id="seo-best-practices"}

**Scrivi un titolo per pagina, e rendilo specifico.** *Prezzi · Acme* dice a chi legge più di *Home*. Tienilo sotto i 60 caratteri circa, o i motori di ricerca lo tagliano.

**Scrivi la descrizione per una persona, non per un robot.** Non influisce direttamente sul tuo posizionamento, ma è ciò che convince qualcuno a cliccare. Circa 150 caratteri.

**Non ripetere la stessa descrizione su ogni pagina.** Due descrizioni identiche dicono a un motore di ricerca che le due pagine sono intercambiabili.

**Compila `site.json` prima di pubblicare.** Ogni pagina ricade su quei valori, quindi un sito che ha ancora *Site description* lì dentro pubblica quel testo ovunque.

**Usa `noindex` per le pagine che non devono essere trovate**: una pagina di ringraziamento dopo un form, una copia di staging, una pagina che tieni solo per un link che hai mandato a qualcuno.

**L'`url` in `site.json` deve essere quello vero.** Costruisce il link canonical e gli indirizzi nella tua sitemap. Se lo sbagli, stai mandando i motori di ricerca verso un sito che non esiste.

## Generazione della sitemap {id="sitemap-generation"}

Da quegli stessi due file **Nibula** genera anche, a ogni build, tre cose che aiutano le macchine a leggere il tuo sito:

| Cosa | Chi lo legge | Cos'è |
|---|---|---|
| `sitemap.xml` | Motori di ricerca | L'elenco delle tue pagine, così vengono trovate tutte senza seguire i link |
| `llms.txt` | Crawler AI | Lo stesso elenco in testo semplice, con una breve riga sul sito |
| **JSON-LD** | Entrambi | Un piccolo blocco dentro ogni pagina che descrive cos'è la pagina |

Il **JSON-LD** sta in `src/frontend/layouts/base.njk` e non ti chiede niente. Le pagine segnate come **noindex** e la pagina **404** restano fuori dalla sitemap.

Non modifichi mai `sitemap.xml` direttamente: aggiungi una pagina con la CLI e compare, ne rimuovi una e sparisce. Ciò che *puoi* cambiare sta in `src/frontend/indexing/sitemap.njk`:

```
<changefreq>weekly</changefreq>
<priority>0.8</priority>
```

**changefreq** indica quanto spesso cambia la pagina: `daily` per una sezione di notizie, `weekly` per un blog, `monthly` o `yearly` per le pagine che tocchi raramente. **priority** va da `0.0` a `1.0` e dice quali pagine contano di più per te, con la homepage di solito a `1.0`. Entrambi sono suggerimenti, e i motori di ricerca sono liberi di ignorarli, quindi non perderci tempo.

In `src/frontend/indexing/llms.njk` puoi aggiungere un paio di righe su cosa fa il tuo sito e quali pagine contano, subito sotto il titolo. È un formato giovane e pochi crawler lo leggono ancora, ma costa un minuto.

> Tutti e tre sono costruiti da `pages.json`, quindi una pagina senza record manca da tutti e tre

## Robot e crawler {id="robots-and-crawlers"}

Un **crawler** è il programma che un motore di ricerca manda in giro per il web a leggere le pagine. `robots.txt` sta nella radice del tuo sito e gli dice cosa può visitare.

**Nibula** lo genera da `src/frontend/indexing/robots.njk`, puntando alla tua sitemap e permettendo tutto:

```
Sitemap: https://yoursite.com/sitemap.xml

User-agent: *
Disallow:
```

È l'impostazione predefinita giusta per un sito pubblico. Per tenere fuori una sezione, modifica `robots.njk` e aggiungi una riga per percorso sotto `User-agent: *`:

```
Disallow: /private/
```

> `robots.txt` chiede ai crawler di non visitare. Non ferma nessuno: la pagina resta raggiungibile da chiunque abbia l'indirizzo. Per tenere una pagina fuori dai risultati di ricerca, usa **noindex**