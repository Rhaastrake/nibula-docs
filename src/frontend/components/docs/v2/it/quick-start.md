# <i class="bi bi-rocket-takeoff"></i> Avvio rapido {id="quick-start"}

## Prerequisiti {id="prerequisites"}

### Obbligatori {id="required"}

- **Node.js** — v18.0.0 o superiore
- **Composer** — ultima versione, solo se scegli il backend PHP
- **Better Nunjucks** — estensione di VS Code di Ed Heltzel, per l'evidenziazione della sintassi nei file **.njk**

### Consigliati {id="recommended"}

- **Material Icon Theme** — estensione di VS Code di Philipp Kief

## Installazione {id="installation"}

Installa Nibula una sola volta, a livello globale:

{% renderFile "installation-command.md" | componentsPath, "njk,md" %}

Così ottieni il comando **nib**, con **nbl** e **nibula** come alias.

Globale significa che lo installi una volta sul tuo computer, non una volta per
progetto: da quel momento **nib** è disponibile da qualsiasi cartella.

Dopo l'installazione, questi sono i comandi che userai:

| Comando | Cosa fa |
|---|---|
| **nib new** | Crea un nuovo progetto |
| **nib run** | Avvia il server di sviluppo e rifà la build a ogni salvataggio |
| **nib build** | Crea la build del sito da pubblicare |
| **nib clean** | Svuota la cartella di output |
| **nib cli** | Apre l'assistente per aggiungere, rinominare o rimuovere pagine |
| **nib update** | Aggiorna Nibula |
| **nib ver** | Mostra la versione in uso |

Vedi [Nibula CLI](#nibula-cli) per sapere cosa può fare l'assistente.

## Creazione del progetto {id="project-creation"}

Dalla cartella in cui tieni i tuoi siti, esegui:

``` {class="clickable button link-button copy"}
nib new your-project
```

Lo scaffolder ti fa tre domande:

| Domanda | Opzioni |
|---|---|
| Linguaggio | [JavaScript o TypeScript](#javascript-or-typescript) |
| Framework CSS | Bootstrap, Bulma, Foundation, UIkit o nessuno |
| Backend | [Node.js o PHP](#node-or-php) |

> **TypeScript** aggiunge i tipi a JavaScript: sceglilo se sai già cosa significa, altrimenti JavaScript è l'inizio più sicuro.
>
> Il **framework CSS** si può cambiare in seguito commentando qualche riga.
>
> Il **Backend** è la scelta da non sbagliare: Node e PHP offrono la stessa API, ma girano in posti molto diversi. Vedi [Deploy](#deploy).

Le dipendenze vengono installate per te. Se scegli Node, il passaggio di Composer
viene saltato del tutto, quindi non ti serve avere Composer sul computer.

Poi entra nel progetto e avvia il server di sviluppo:

``` {class="clickable button link-button copy"}
cd your-project
```

``` {class="clickable button link-button copy"}
nib run
```

Il tuo sito ora è su **localhost:8080**, e la build si rifà ogni volta che salvi un file.