# Backend {id="backend"}

## Node.js or PHP {id="node-or-php"}

If you picked a backend when you created the project, you already have a small API working under `/api`. It's the same API written twice, once in **Node.js** and once in **PHP**: same folders, same way of writing an endpoint. Only the language changes.

**PHP** runs once per request and then exits, so it works on any cheap hosting.

**Node** is itself a program that stays running, so it needs a machine you control.

| | PHP | Node |
|---|---|---|
| Runs on shared hosting | ✅ | ❌ |
| Needs something always running | No | Yes |
| Extra packages | Composer | npm |

If you're unsure, pick **PHP**: it runs everywhere. What each one needs on the server is in [Deploy](#deploy).

> Picked **None**? You have no `backend` folder and the site is pure static. You can still call somebody else's API from JavaScript

## Structure {id="backend-structure"}

Everything lives in `src/backend`:

```
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

You work in **api**. A file's path is its URL: `api/public/contact.js` answers at `/api/contact`, and subfolders work the same way.

**_core** receives every request, checks the API key when needed, and calls your file. Nothing to configure.

### The config file {id="backend-config"}

`example.config.js` (or `.php`) is a template with no real values in it. Copy it to `config.js` and fill that one in:

```
cd src/backend
copy example.config.js config.js
```

`config.js` is ignored by git, so your passwords stay on your machine and never end up online. The example file stays where it is, as the list of what a new copy needs.

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

**GENERAL_API_KEY** is the password every protected endpoint asks for. A client sends it in the `X-Api-Key` header, and without it the request is refused. Change it before you publish: `DEFAULT_KEY` is written in the documentation of every **Nibula** site.

**CUSTOM_ENDPOINT_KEYS** gives one endpoint a key of its own, so you can hand a single client access to a single endpoint without giving away the general key. The name is the path under `protected`, without the extension.

**GENERAL_ALLOWED_ORIGINS** is the list of sites allowed to call your API from a browser. `*` means anyone, which is fine while you're building and on a public API. When the API is only for your own site, put your address there instead:

```js
GENERAL_ALLOWED_ORIGINS: [
    'https://example.com',
],
```

**CUSTOM_ENDPOINT_ORIGINS** does the same for a single endpoint.

**DB_** are the four values your database needs: where it is, its name, the user and the password. Leave them as they are if you have no database.

**APP_ENV** decides what an error says. On `production` the client only sees *Internal server error*; on anything else it sees the real message, useful while you're working, too talkative once the site is online.

> Every one of these values is read when the backend starts, so restart it after you change the file

## Endpoints logic {id="endpoints-logic"}

An endpoint is one file that answers the request and stops:

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

The same file in PHP:

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

The request arrives already unpacked:

| Name | What it holds |
|---|---|
| `method` | `GET`, `POST`, and so on |
| `query` | What comes after the `?`: `?page=2` gives `page: '2'` |
| `body` | The JSON the client sent, already parsed |
| `requestParams` | The extra pieces of the path |
| `headers` | The request headers |
| `config` | Everything from your config file |

`Response.success(data, code)` and `Response.error(message, code)` send the answer and stop the request: nothing after them runs.

**Extra pieces of the path.** With only `users.js` in place, a call to `/api/users/42` still runs `users.js`, and `42` arrives in `requestParams`.

> Never trust what a client sends: check every value before you use it, above all before it reaches the database

## Database {id="database"}

`Database.getInstance()` opens the connection with the values from your config, and reuses it for every call.

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

Note the `?` with the value passed separately. That's what keeps somebody from typing SQL into your form and having it run. Never build a query by gluing strings together.

In `database/migrations` you keep the `.sql` files that create your tables: you run them on the server once, and they stay as the written history of your database.

> With **Node** the database needs one extra package, see below. With **PHP** it works out of the box

## Additional packages {id="additional-packages"}

The backend has its own dependencies, separate from the site's.

**Node** reads `src/backend/package.json`:

```
cd src/backend
npm install mysql2
```

**PHP** uses Composer, from `src/backend/_core`:

```
cd src/backend/_core
composer require vlucas/phpdotenv
```

Both are copied into `out` at build time, dependencies included.

## Node service {id="node-service"}

Only the Node backend needs this: somebody has to start the program, and start it again when the server reboots.

While you're working, `npm run serve` does it for you. On the server you hand it to **systemd**, the part of Linux that keeps programs running. The whole procedure is in [Deploy](#nginx-node-service).