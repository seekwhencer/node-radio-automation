# Setup ubuntu bionic server

## Dependencies
```
sudo su
apt-get update -y
apt-get install avahi-daemon avahi-discover libnss-mdns icecast2 mpc mpd git curl make -y
apt-get upgrade -y
```

- Disabling Services
```
sudo su
systemctl disable icecast2
systemctl disable mpd
systemctl disable avahi-daemon
systemctl daemon-reload
```

## Node.js
 
- Installing Node.js with **[n](https://github.com/tj/n)** for root user
```
sudo su
cd ~
curl -L https://git.io/n-install | bash
```

- Installing **[PM2]()**
```
sudo su
npm install pm2 -g
pm2 startup
```