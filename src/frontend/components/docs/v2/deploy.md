# Deploy {id="deploy"}

## How to deploy {id="how-to-deploy"}

Publishing means copying the `out` folder onto a web server. What you can use depends on the backend you picked when you created the project.

**PHP** runs once per visit: a request arrives, PHP answers, PHP exits. Nothing stays running, so there's nothing to look after. That's why it works on cheap hosting.

**Node is itself a server**: a program that has to stay running in the background while the web server forwards `/api` requests to it. Somebody has to start it and restart it if the machine reboots.

That's why shared hosting can't run the Node backend. On plans like Aruba or cPanel you upload files into a folder and that's all you can do. If that's your host, choose PHP.

> **Shared hosting** is a plan where you share a server with other customers and only get a folder to upload into. **A VPS** is a whole machine that's yours, where you can install and run whatever you want

### What you need {id="deploy-requirements"}

| Backend | Requirements |
|---|---|
| **PHP** | A host with PHP support, and Composer to install the backend's dependencies |
| **Node** | Node.js 18 or newer, and command-line access to start the backend |
| **None** | Nothing at all: any static hosting will do |

## Hosting options {id="hosting-options"}

| Target | Frontend | PHP backend | Node backend |
|---|---|---|---|
| Shared hosting (Apache) | ✅ | ✅ | ❌ nothing can stay running |
| Windows hosting (IIS) | ✅ | ✅ | ⚠️ only with the ARR module |
| Your own VPS (Nginx) | ✅ | ✅ | ✅ |
| Static hosting (Netlify, Vercel, GitHub Pages) | ✅ | ❌ | ❌ |

Static hosting serves files and nothing else. Perfect if your site has no `/api` endpoints, unusable if it does.

### Editing the server config {id="deploy-server-config"}

Every server needs a file telling it how to behave: which page to show on a 404, which files to keep private, where to send `/api` requests. **Nibula** writes these for you.

`.htaccess` and `web.config` are already inside `out`, ready to upload. To change a rule, edit the original in `src/frontend/hosting/`. Anything you change directly inside `out` is erased the next time you build.

`nginx.conf` is different. It sits in your project root and is **not** copied into `out`, because Nginx doesn't read config files from the site folder. You install it on the server yourself.

## Apache / IIS {id="apache-iis"}

Upload **the contents of `out`**, not the folder itself, into your web root. Depending on the host it's called `htdocs`, `public_html` or `www`.

That's it. The config file is already in there and the server reads it automatically: folder listings are off, errors show your `/404.html`, sensitive files are blocked, the backend source is sealed off, and `/api/*` is routed.

### Where /api goes {id="deploy-api-routing"}

**On Apache**, if the server has `mod_proxy` the request is forwarded to Node. If it doesn't, which is the usual case on shared hosting, `/api` goes to PHP instead. To force PHP on a server that does have `mod_proxy`, comment out the `mod_proxy` block in `.htaccess`.

**On IIS**, `/api` goes to PHP by default. To use Node instead, uncomment the `ApiToNode` rule in `web.config` and delete `ApiToPhp`. This only works if the server has the ARR and URL Rewrite modules with proxying turned on, which means a server you control.

> If you chose Node and your host has no ARR, don't upload the `backend` folder. Without it the static site works fine and `/api/*` shows your `404.html`. Upload it and every `/api` request returns an empty 404 instead

## Nginx {id="nginx"}

Nginx doesn't read config files from the site folder: the whole site is described in one file kept elsewhere on the machine. **Nibula** ships that file as `nginx.conf` in your project root, and it handles both backends with no edits. `/api` goes to Node, and if Node isn't running the request falls through to PHP automatically.

Upload the contents of `out` to `/var/www/SITE_FOLDER`, then work through the steps below.

### Fill in the placeholders {id="nginx-placeholders"}

| Placeholder | What to put there |
|---|---|
| `YOUR_DOMAIN` | Your domain, twice: once for port 80 and once for 443 |
| `SITE_FOLDER` | The folder name you used under `/var/www/` |
| `YOUR_CERTIFICATE` | The folder name under `/etc/letsencrypt/live/` |
| `SITE_NAME` | The file name you'll use in the commands below |

### Install what's missing {id="nginx-install"}

```
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

With the PHP backend, also:

```
sudo apt install -y php-fpm
```

### Get an HTTPS certificate {id="nginx-certificate"}

This is what makes your site load over `https://`. Certificates are free and last 90 days; the second command renews them automatically.

```
sudo certbot certonly --nginx --cert-name SITE_NAME -d YOUR_DOMAIN
```

```
sudo systemctl enable --now certbot.timer
```

### Install the site file {id="nginx-site-file"}

Go to the folder where Nginx keeps site files, create the file, and paste in the contents of your edited `nginx.conf`:

```
cd /etc/nginx/sites-available
sudo nano SITE_NAME
```

Save with `CTRL + O`, `ENTER`, `CTRL + X`. Then switch the site on and apply it:

```
sudo cp SITE_NAME ../sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

> If `nginx -t` reports an error, fix it before reloading. Nginx keeps running on the old config until the reload succeeds, so your site stays up

### If something goes wrong {id="nginx-troubleshooting"}

| What you see | What it usually means |
|---|---|
| `cannot load certificate ... Permission denied` | You ran `nginx -t` without `sudo` |
| `cannot load certificate ... No such file` | Wrong certificate name |
| `no alternative certificate subject name` | The certificate doesn't cover this domain |
| `unknown directive "http2"` | Nginx older than 1.25, check with `nginx -v` |
| NXDOMAIN or a timeout during certbot | Your domain's DNS isn't pointing at this server yet |
| A blank 500 instead of your 404 page | `404.html` is missing from the upload |
| 502 on `/api`, Node backend | The Node program isn't running |
| 502 on `/api`, PHP backend | Wrong php-fpm socket path in the config |

### Starting the Node backend {id="nginx-node-service"}

Only for the Node backend. After uploading `out`, install its dependencies:

```
cd /var/www/SITE_FOLDER/backend
npm install
```

Make sure `config.js` exists in `out/backend/`. If it doesn't, copy `example.config.js` to `config.js` and fill in your values.

**Try it out first.** `screen` lets you start a program, walk away, and come back to it later:

```
screen -S node-backend
sudo node /var/www/SITE_FOLDER/backend/_core/index.js
```

```
curl http://127.0.0.1:3000/api/example-public
```

If `curl` prints a JSON response, the backend is alive. Press `CTRL + A` then `D` to leave the screen without stopping the program; `screen -r node-backend` brings you back.

**Then set it up for real.** `screen` is for testing: the program dies if the server reboots. For a live site use **systemd**, the part of Linux that manages background programs. It starts your backend at boot and restarts it if it crashes.

Create `/etc/systemd/system/backend-node.service`:

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

Adjust `WorkingDirectory`, and check the path to `node` with `which node`. Then:

```
sudo systemctl daemon-reload
sudo systemctl enable --now backend-node
sudo systemctl status backend-node
```

The last command should say `active (running)`.

### Settings the Node backend reads {id="nginx-node-env"}

These go in the systemd file, on their own lines, as `Environment=KEY=value`. All three have sensible defaults.

| Setting | Default | What it does |
|---|---|---|
| `PORT` | `3000` | The port Node listens on, must match the one in `nginx.conf` |
| `HOST` | `127.0.0.1` | Keep this as it is: it means local only, so Node is reachable through the web server and not directly from the internet |
| `DOCUMENT_ROOT` | detected | Where `404.html` lives, the folder above `backend/` |

> Error detail is not set here. That's the `APP_ENV` key inside `config.js` or `config.php`, see [Backend](#backend)