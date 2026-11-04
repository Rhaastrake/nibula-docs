# <i class="bi bi-cloud-arrow-up"></i> Deploy {id="deploy"}

## Come fare il deploy {id="how-to-deploy"}

Pubblicare significa copiare la cartella `out` su un web server. Cosa puoi usare dipende dal backend che hai scelto quando hai creato il progetto.

**PHP** viene eseguito una volta per visita: arriva una richiesta, PHP risponde, PHP termina. Non resta niente in esecuzione, quindi non c'è niente da tenere d'occhio. Per questo funziona su hosting economici.

**Node è a sua volta un server**: un programma che deve restare in esecuzione in background mentre il web server gli inoltra le richieste `/api`. Qualcuno deve avviarlo e riavviarlo se la macchina si riavvia.

Per questo l'hosting condiviso non può eseguire il backend Node. Su piani come Aruba o cPanel carichi i file in una cartella e non puoi fare altro. Se il tuo host è così, scegli PHP.

> L'**hosting condiviso** è un piano in cui condividi un server con altri clienti e hai solo una cartella in cui caricare i file. **Una VPS** è un'intera macchina tutta tua, dove puoi installare ed eseguire quello che vuoi

### Cosa ti serve {id="deploy-requirements"}

| Backend | Requisiti |
|---|---|
| **PHP** | Un host con supporto PHP, e Composer per installare le dipendenze del backend |
| **Node** | Node.js 18 o successivo, e accesso alla riga di comando per avviare il backend |
| **Nessuno** | Niente di niente: va bene qualsiasi hosting statico |

## Opzioni di hosting {id="hosting-options"}

| Destinazione | Frontend | Backend PHP | Backend Node |
|---|---|---|---|
| Hosting condiviso (Apache) | Sì | Sì | No, niente può restare in esecuzione |
| Hosting Windows (IIS) | Sì | Sì | Solo con il modulo ARR |
| La tua VPS (Nginx) | Sì | Sì | Sì |
| Hosting statico (Netlify, Vercel, GitHub Pages) | Sì | No | No |

L'hosting statico serve file e nient'altro. Perfetto se il tuo sito non ha endpoint `/api`, inutilizzabile se li ha.

### Modificare la configurazione del server {id="deploy-server-config"}

Ogni server ha bisogno di un file che gli dica come comportarsi: quale pagina mostrare su un 404, quali file tenere privati, dove mandare le richieste `/api`. **Nibula** li scrive per te.

`.htaccess` e `web.config` sono già dentro `out`, pronti da caricare. Per cambiare una regola, modifica l'originale in `src/frontend/hosting/`. Qualsiasi cosa cambi direttamente dentro `out` viene cancellata alla build successiva.

`nginx.conf` è diverso. Si trova nella radice del progetto e **non** viene copiato in `out`, perché Nginx non legge i file di configurazione dalla cartella del sito. Lo installi tu sul server.

## Apache / IIS {id="apache-iis"}

Carica **il contenuto di `out`**, non la cartella stessa, nella tua web root. A seconda dell'host si chiama `htdocs`, `public_html` o `www`.

Tutto qui. Il file di configurazione è già lì dentro e il server lo legge automaticamente: l'elenco delle cartelle è disattivato, gli errori mostrano il tuo `/404.html`, i file sensibili sono bloccati, il sorgente del backend è isolato, e `/api/*` viene instradato.

### Dove va /api {id="deploy-api-routing"}

**Su Apache**, se il server ha `mod_proxy` la richiesta viene inoltrata a Node. Se non ce l'ha, che è il caso normale sull'hosting condiviso, `/api` va invece a PHP. Per forzare PHP su un server che ha `mod_proxy`, commenta il blocco `mod_proxy` in `.htaccess`.

**Su IIS**, `/api` va a PHP per impostazione predefinita. Per usare invece Node, decommenta la regola `ApiToNode` in `web.config` ed elimina `ApiToPhp`. Funziona solo se il server ha i moduli ARR e URL Rewrite con il proxy attivato, il che significa un server che controlli tu.

> Se hai scelto Node e il tuo host non ha ARR, non caricare la cartella `backend`. Senza di essa il sito statico funziona bene e `/api/*` mostra il tuo `404.html`. Se la carichi, ogni richiesta `/api` restituisce invece un 404 vuoto

## Nginx {id="nginx"}

Nginx non legge i file di configurazione dalla cartella del sito: l'intero sito è descritto in un unico file tenuto altrove sulla macchina. **Nibula** fornisce quel file come `nginx.conf` nella radice del progetto, e gestisce entrambi i backend senza modifiche. `/api` va a Node, e se Node non è in esecuzione la richiesta passa automaticamente a PHP.

Carica il contenuto di `out` in `/var/www/SITE_FOLDER`, poi segui i passaggi qui sotto.

### Compila i segnaposto {id="nginx-placeholders"}

| Segnaposto | Cosa metterci |
|---|---|
| `YOUR_DOMAIN` | Il tuo dominio, due volte: una per la porta 80 e una per la 443 |
| `SITE_FOLDER` | Il nome della cartella che hai usato sotto `/var/www/` |
| `YOUR_CERTIFICATE` | Il nome della cartella sotto `/etc/letsencrypt/live/` |
| `SITE_NAME` | Il nome del file che userai nei comandi qui sotto |

### Installa quello che manca {id="nginx-install"}

``` {class="clickable button link-button copy"}
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

Con il backend PHP, anche:

``` {class="clickable button link-button copy"}
sudo apt install -y php-fpm
```

### Ottieni un certificato HTTPS {id="nginx-certificate"}

È ciò che fa caricare il tuo sito su `https://`. I certificati sono gratuiti e durano 90 giorni; il secondo comando li rinnova automaticamente.

``` {class="clickable button link-button copy"}
sudo certbot certonly --nginx --cert-name SITE_NAME -d YOUR_DOMAIN
```

``` {class="clickable button link-button copy"}
sudo systemctl enable --now certbot.timer
```

### Installa il file del sito {id="nginx-site-file"}

Vai nella cartella dove Nginx tiene i file dei siti, crea il file e incolla il contenuto del tuo `nginx.conf` modificato:

``` {class="clickable button link-button copy"}
cd /etc/nginx/sites-available
sudo nano SITE_NAME
```

Salva con `CTRL + O`, `ENTER`, `CTRL + X`. Poi attiva il sito e applica le modifiche:

``` {class="clickable button link-button copy"}
sudo cp SITE_NAME ../sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

> Se `nginx -t` segnala un errore, correggilo prima di ricaricare. Nginx continua a funzionare con la vecchia configurazione finché il reload non va a buon fine, quindi il tuo sito resta online

### Se qualcosa va storto {id="nginx-troubleshooting"}

| Cosa vedi | Cosa significa di solito |
|---|---|
| `cannot load certificate ... Permission denied` | Hai eseguito `nginx -t` senza `sudo` |
| `cannot load certificate ... No such file` | Nome del certificato sbagliato |
| `no alternative certificate subject name` | Il certificato non copre questo dominio |
| `unknown directive "http2"` | Nginx più vecchio della 1.25, controlla con `nginx -v` |
| NXDOMAIN o un timeout durante certbot | Il DNS del tuo dominio non punta ancora a questo server |
| Un 500 vuoto invece della tua pagina 404 | `404.html` manca dai file caricati |
| 502 su `/api`, backend Node | Il programma Node non è in esecuzione |
| 502 su `/api`, backend PHP | Percorso del socket php-fpm sbagliato nella configurazione |

### Avviare il backend Node {id="nginx-node-service"}

Solo per il backend Node. Dopo aver caricato `out`, installa le sue dipendenze:

``` {class="clickable button link-button copy"}
cd /var/www/SITE_FOLDER/backend
npm install
```

Assicurati che `config.js` esista in `out/backend/`. Se non c'è, copia `example.config.js` in `config.js` e compila i tuoi valori.

**Prima provalo.** `screen` ti permette di avviare un programma, allontanarti e tornarci più tardi:

``` {class="clickable button link-button copy"}
screen -S node-backend
sudo node /var/www/SITE_FOLDER/backend/_core/index.js
```

``` {class="clickable button link-button copy"}
curl http://127.0.0.1:3000/api/example-public
```

Se `curl` stampa una risposta **JSON**, il backend è vivo. Premi `CTRL + A` e poi `D` per uscire dallo screen senza fermare il programma; `screen -r node-backend` ti riporta lì.

**Poi configuralo sul serio.** `screen` serve per i test: il programma muore se il server si riavvia. Per un sito online usa **systemd**, la parte di Linux che gestisce i programmi in background. Avvia il tuo backend al boot e lo riavvia se va in crash.

Crea `/etc/systemd/system/backend-node.service`:

```ini
[Unit]
Description=Nibula Node backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/SITE_FOLDER/backend
ExecStart=/usr/bin/node /var/www/SITE_FOLDER/backend/_core/index.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Adatta `WorkingDirectory`, e controlla il percorso di `node` con `which node`. Poi:

``` {class="clickable button link-button copy"}
sudo systemctl daemon-reload
sudo systemctl enable --now backend-node
sudo systemctl status backend-node
```

L'ultimo comando dovrebbe dire `active (running)`.

### Impostazioni che il backend Node legge {id="nginx-node-env"}

Vanno nel file di systemd, ognuna su una riga, come `Environment=KEY=value`. Tutte e tre hanno valori predefiniti sensati.

| Impostazione | Predefinito | Cosa fa |
|---|---|---|
| `PORT` | `3000` | La porta su cui Node è in ascolto, deve corrispondere a quella in `nginx.conf` |
| `HOST` | `127.0.0.1` | Lascialo così: significa solo locale, quindi Node è raggiungibile tramite il web server e non direttamente da internet |
| `DOCUMENT_ROOT` | rilevato | Dove si trova `404.html`, la cartella sopra `backend/` |

> Il dettaglio degli errori non si imposta qui. È la chiave `APP_ENV` dentro `config.js` o `config.php`, vedi [Backend](#backend)