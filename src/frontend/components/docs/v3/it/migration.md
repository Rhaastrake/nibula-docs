# <i class="bi bi-arrow-left-right"></i> Migrazione {id="migration"}

## Cosa devi cambiare {id="migration-overview"}

Parti dalla root del progetto aggiornando **Nibula** stesso:

``` {class="clickable button link-button copy"}
npm update nibula
```

La versione 3 sposta il foglio di stile globale fuori da ogni pagina e rinomina due cartelle del backend. Nei tuoi contenuti, nelle tue pagine e nei tuoi file di dati non cambia nulla.

| Area | Chi riguarda |
|---|---|
| [Fogli di stile](#migration-stylesheets) | Ogni progetto |
| [Script di build](#migration-scripts) | Ogni progetto |
| [Backend](#migration-backend) | Solo se hai scelto **Node** o **PHP** |

> I tuoi endpoint continuano a funzionare così come sono. La nuova forma con una funzione per metodo è disponibile, non obbligatoria

## Fogli di stile {id="migration-stylesheets"}

Finora il CSS di ogni pagina conteneva una copia completa del framework e di ogni modulo, quindi un visitatore che leggeva tre pagine scaricava la stessa cosa tre volte. Ora il foglio di stile globale viene compilato a parte e collegato dal layout.

**1.** Rinomina `src/frontend/scss/_global.scss` in `global.scss`.

**2.** In ogni file sotto `scss/pages/`, elimina l'import del file globale:

```scss
@import "../global";
```

**3.** In `src/frontend/layouts/base.njk`, collega il foglio di stile globale sopra quello della pagina:

```njk
<link rel="stylesheet" href="{{ '/css/global.css' | url }}">
```

## Script di build {id="migration-scripts"}

Il comando `build-js` non c'è più: `esbuild` espande da solo il pattern di ingresso, quindi il progetto lo chiama direttamente. Un progetto creato prima della versione 3 ha ancora i vecchi script, e la sua build fallisce dopo l'aggiornamento.

In `package.json`, sostituisci i due script:

```json
"build:js": "esbuild \"src/frontend/js/pages/*.js\" --bundle --outdir=out/js/pages --minify",
"serve:js": "esbuild \"src/frontend/js/pages/*.js\" --bundle --outdir=out/js/pages --watch"
```

Un progetto **TypeScript** usa invece `src/frontend/ts/pages/*.ts`.

Poi rimuovi la dipendenza che serviva solo a espandere quel pattern:

``` {class="clickable button link-button copy"}
npm uninstall glob
```

## Backend {id="migration-backend"}

**1.** Rinomina le due cartelle:

| Vecchia | Nuova |
|---|---|
| `src/backend/_core` | `src/backend/core` |
| `src/backend/api` | `src/backend/endpoints` |

La seconda contiene i file delle tue route, mentre `/api` resta il prefisso pubblico dell'URL: i tuoi endpoint si raggiungono ancora su `yoursite.com/api/endpoint`.

**2.** Aggiorna il percorso nei file del server che hai modificato tu. I file `nginx.conf`, `.htaccess` e `web.config` inclusi puntano già a `backend/core`, ma ogni regola che hai aggiunto a mano usa ancora `_core`.

**3.** Una richiesta a un endpoint protetto senza la sua chiave ora risponde **401** invece di **403**. Se qualcosa dalla tua parte gestisce quella risposta, aggiornalo.

> Finché `APP_ENV` non è `production`, ogni risposta porta un header `Debug-Mode`. Un modo rapido per capire se un sito online è rimasto in modalità debug

## Verificare che abbia funzionato {id="migration-check"}

``` {class="clickable button link-button copy"}
nib build
```

Una build pulita scrive `out/css/global.css` accanto ai fogli di stile delle pagine. Apri una pagina e controlla nella scheda Rete del browser che entrambi i file vengano caricati.

Con un backend, chiama un endpoint per vedere che risponda:

``` {class="clickable button link-button copy"}
curl http://localhost:8080/api/example-public
```

> Niente in `data/`, `routes/`, `components/` o `layouts/` va toccato, a parte la riga aggiunta a `base.njk`