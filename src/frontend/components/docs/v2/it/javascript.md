# <i class="bi bi-braces"></i> Javascript {id="javascript"}

> Gli esempi usano **JavaScript**. Tutto vale anche per **TypeScript**, tranne che negli import si omette l'estensione e il progetto ha in più un file `tsconfig.json`

## Javascript o TypeScript {id="javascript-or-typescript"}

Quando crei un progetto, **Nibula** ti chiede se usare **JavaScript** o **TypeScript**. La differenza è che TypeScript ti fa dichiarare che tipo di valore contiene ogni cosa: una **stringa**, un **numero**, il **valore restituito** dalla funzione. Controlla che tu sia coerente mentre scrivi, così un'intera categoria di errori compare nel tuo editor invece che nel browser.

Però c'è più da imparare. Se non sei sicuro, parti con **JavaScript**. Potrai sempre scrivere il prossimo progetto in TypeScript.

## Struttura {id="javascript-structure"}

La struttura di **JavaScript** è più o meno la stessa di quella [SCSS](#styling-structure), ma gli import funzionano in modo un po' diverso.

Ogni **pagina** ha il suo file, con il nome della pagina in **camel case**, creato per te in `src/frontend/js/pages/` quando aggiungi una pagina con la [CLI di Nibula](#nibula-cli).

> Esempio: `my-page.njk` (file della pagina) viene collegato automaticamente a `myPage.js`

```njk
src/frontend/js/
├── global.js
├── modules/
└── pages/
```

`pages/` contiene un file per pagina, `modules/` i pezzi che riusi, e `global.js` quello che gira ovunque.

Ogni file di pagina importa `global.js`, così scrivi il comportamento condiviso una volta sola:

`js/pages/myPage.js`
```javascript
import '../global.js';

// import { initExampleModule } from '../modules/exampleModule.js';

// initExampleModule();

// Page logic here
```

> A differenza di **SCSS**, non c'è un file centrale in cui registrare qualcosa. Ogni pagina si importa quello che le serve

## Moduli {id="javascript-modules"}

Un modulo è un file che contiene un singolo comportamento: un menu, uno slider, un controllo su un form. Aggiungilo in `src/frontend/js/modules/`.

`modules/exampleModule.js`
```javascript
export function initExampleModule() {
    alert("Example module is working!");
}
```

L'**export** è ciò che rende la funzione raggiungibile da fuori dal file. Tutto quello che non esporti resta privato al modulo.

> Racchiudi il comportamento in una funzione **init** invece di eseguirlo appena il file viene caricato. Così è la pagina a decidere **quando** parte

**Importare** un modulo rende disponibili le sue funzioni. Chiamare la funzione **init** è ciò che lo avvia davvero, quindi ti servono entrambe le righe.

In un file di pagina, per un comportamento che serve solo a quella pagina:

`js/pages/myPage.js`
```javascript
import '../global.js';

import { initExampleModule } from '../modules/exampleModule.js';

initExampleModule();
```

In `global.js`, per un comportamento che serve a ogni pagina:

```javascript
import { initBurgerMenu } from "./modules/burgerMenu.js";

initBurgerMenu();
```