# <i class="bi bi-hdd-stack"></i> Backend {id="backend"}

## Node.js o PHP {id="node-or-php"}

Se hai scelto un backend quando hai creato il progetto, hai già una piccola API funzionante sotto `/api`. È la stessa API scritta due volte, una in **Node.js** e una in **PHP**: stesse cartelle, stesso modo di scrivere un endpoint. Cambia solo il linguaggio.

**PHP** viene eseguito una volta per ogni richiesta e poi termina, quindi funziona su qualsiasi hosting economico.

**Node** è a sua volta un programma che resta in esecuzione, quindi gli serve una macchina che controlli tu.

| | PHP | Node |
|---|---|---|
| Funziona su hosting condiviso | Sì | No |
| Serve qualcosa sempre in esecuzione | No | Sì |
| Pacchetti extra | Composer | npm |

Se non sei sicuro, scegli **PHP**: funziona ovunque. Cosa serve a ciascuno sul server lo trovi in [Deploy](#deploy).

> Gli esempi qui sotto sono in **Node**, la cui sintassi è la più breve da leggere. La logica è la stessa in PHP: stessi nomi, stesse cartelle, stesso ordine delle cose.

## Struttura {id="backend-structure"}

Tutto si trova in `src/backend`:

``` njk
src/backend/
├── _core/           the engine, you don't touch this
├── api/
│   ├── public/      anyone can call these
│   └── protected/   only with an API key
├── database/
│   ├── Database.js / .php
│   └── migrations/  your .sql files
└── example.config.js / .php
```

Tu lavori in **api**. Il percorso di un file è il suo URL: `api/public/contact.js` risponde su `/api/contact`, e le sottocartelle funzionano allo stesso modo.

**_core** riceve ogni richiesta, controlla la chiave API quando serve, e chiama il tuo file. Niente da configurare.

### Il file di configurazione {id="backend-config"}

`example.config.js` (o `.php`) è un template senza valori reali. Copialo in `config.js` e compila quello:

`config.js` è ignorato da git, quindi le tue password restano sulla tua macchina e non finiscono mai online. Il file di esempio resta dov'è, come elenco di ciò che serve a una nuova copia.

```js
module.exports = {
    GENERAL_API_KEY: 'DEFAULT_KEY',

    CUSTOM_ENDPOINT_KEYS: {
        'subfolder/example-protected': 'custom-key',
    },

    GENERAL_ALLOWED_ORIGINS: [
        '*',
    ],

    CUSTOM_ENDPOINT_ORIGINS: {
        'subfolder/example-protected': ['https://app.example.com'],
    },

    DB_HOST: '127.0.0.1',
    DB_NAME: 'example_db',
    DB_USER: 'root',
    DB_PASS: '',

    APP_ENV: 'production',
};
```

**GENERAL_API_KEY** è la password che ogni endpoint protetto richiede. Un client la invia nell'header `X-Api-Key`, e senza di essa la richiesta viene rifiutata. Cambiala prima di pubblicare: `DEFAULT_KEY` è scritta nella documentazione di ogni sito **Nibula**.

**CUSTOM_ENDPOINT_KEYS** dà a un endpoint una chiave tutta sua, così puoi dare a un singolo client l'accesso a un singolo endpoint senza cedere la chiave generale. Il nome è il percorso sotto `protected`, senza estensione.

**GENERAL_ALLOWED_ORIGINS** è l'elenco dei siti autorizzati a chiamare la tua API da un browser. `*` significa chiunque, il che va bene mentre stai sviluppando e per un'API pubblica. Quando l'API è solo per il tuo sito, metti invece lì il tuo indirizzo:

```js
GENERAL_ALLOWED_ORIGINS: [
    'https://example.com',
],
```

**CUSTOM_ENDPOINT_ORIGINS** fa lo stesso per un singolo endpoint.

**DB_** sono i quattro valori che servono al tuo database: dove si trova, il suo nome, l'utente e la password. Lasciali come sono se non hai un database.

**APP_ENV** decide cosa dice un errore. Su `production` il client vede solo *Internal server error*; con qualsiasi altro valore vede il messaggio reale, utile mentre lavori, troppo loquace quando il sito è online.

> Ognuno di questi valori viene letto all'avvio del backend, quindi riavvialo dopo aver modificato il file

## Logica degli endpoint {id="endpoints-logic"}

Un endpoint è un file che risponde alla richiesta e si ferma:

```js
module.exports = ({ method, requestParams, Response }) => {
    if (method !== 'GET') {
        Response.error('Method not allowed', 405);
    }

    Response.success({
        message: 'It works',
        params: requestParams,
    });
};
```

Lo stesso file in PHP:

```php
<?php
require_once CORE_PATH . '/modules/Response.php';

if ($method !== 'GET') {
    Response::error('Method not allowed', 405);
}

Response::success([
    'message' => 'It works',
    'params'  => $requestParams,
]);
```

La richiesta arriva già spacchettata:

| Nome | Cosa contiene |
|---|---|
| `method` | `GET`, `POST`, e così via |
| `query` | Quello che viene dopo il `?`: `?page=2` dà `page: '2'` |
| `body` | Il JSON inviato dal client, già interpretato |
| `requestParams` | I pezzi extra del percorso |
| `headers` | Gli header della richiesta |
| `config` | Tutto quello che c'è nel tuo file di configurazione |

`Response.success(data, code)` e `Response.error(message, code)` inviano la risposta e fermano la richiesta: niente dopo di loro viene eseguito.

**Pezzi extra del percorso.** Con solo `users.js` presente, una chiamata a `/api/users/42` esegue comunque `users.js`, e `42` arriva in `requestParams`.

> Non fidarti mai di ciò che un client invia: controlla ogni valore prima di usarlo, soprattutto prima che arrivi al database

## Database {id="database"}

`Database.getInstance()` apre la connessione con i valori della tua configurazione, e la riusa per ogni chiamata.

```js
const Database = require('../../database/Database');

const db = Database.getInstance();
const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
```

```php
$db = Database::getInstance();
$stmt = $db->prepare('SELECT * FROM users WHERE id = ?');
$stmt->execute([$id]);
$rows = $stmt->fetchAll();
```

Nota il `?` con il valore passato separatamente. È questo che impedisce a qualcuno di scrivere SQL nel tuo form e farlo eseguire. Non costruire mai una query incollando stringhe insieme.

In `database/migrations` tieni i file `.sql` che creano le tue tabelle: li esegui sul server una volta, e restano come storia scritta del tuo database.

> Con **Node** il database ha bisogno di un pacchetto in più, vedi sotto. Con **PHP** funziona subito

## Servizio Node {id="node-service"}

Serve solo al backend Node: qualcuno deve avviare il programma, e riavviarlo quando il server si riavvia.

Mentre lavori, `npm run serve` lo fa per te. Sul server lo affidi a **systemd**, la parte di Linux che tiene in esecuzione i programmi. L'intera procedura è in [Deploy](#nginx-node-service).