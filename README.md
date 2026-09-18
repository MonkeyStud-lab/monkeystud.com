# monkeystud.com

Static lab landing for **MonkeyStud** / [MonkeyStud-lab](https://github.com/MonkeyStud-lab).

## Local preview

Open `index.html` in a browser, or:

```bash
python3 -m http.server 8080
```

## Deploy (nginx on Ubuntu)

```bash
sudo mkdir -p /var/www/monkeystud.com
sudo rsync -a --delete ./ /var/www/monkeystud.com/
# use the nginx site config from deploy/nginx-monkeystud.conf
sudo nginx -t && sudo systemctl reload nginx
```

## DNS

Point `monkeystud.com` (and `www`) at the host that serves this site:

- **GitHub / Cloudflare Pages:** CNAME to the Pages hostname; keep the `CNAME` file.
- **VPS / home server:** A/AAAA to the public IP (or Cloudflare Tunnel / reverse proxy).

Until public DNS is set, preview on the LAN/Tailscale IP.
