# node-radio-automation
**IN PROGRESS**

- Redesigned and refactored Code from my [node-playlist-atomation-ng]()
- actually not usable

## Setup

- Installing Dependencies
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
systemctl disable mdp
systemctl disable avahi-daemon
systemctl daemon-reload
```
 
- Installing Node.js with **[n](https://github.com/tj/n)** for root user
```
sudo su
cd ~
curl -L https://git.io/n-install | bash
```

- Installing PM2
```
sudo su
npm install pm2 -g
pm2 startup
```

## Installing the app

- Installing Node.js with **[n](https://github.com/tj/n)** NOT as root user
```
cd ~
curl -L https://git.io/n-install | bash
```
Now two different Node.js versions are on the machine.
One for the root user and one for your user.

- Creating folder
```
sudo mkdir /data
sudo chown USER:GROUP /data
```
Replace `USER` and `GROUP` with your own.

- Get the Repo and install it
```
cd /data
git clone https://...
cd node-radio-automation/app
npm install
```

## Running the app

- running in development mode
```
npm run dev
```

- running in production mode
```
npm run prod
```

- running in custom mode
```
npm run custom
```


## Configure the app
- Config Files as js modules are stored in `app/config/`.
- The Custom Set is ignored by `.gitignore` file.
- Duplicate a config folder as `custom` and edit these config by your own.


## Development
I'm working with Windows 10 an the Hyper-V-Manager to run a Virtual Machine.
This Setup was developed on a Ubuntu Bionic Server. My Console under Windows
is the Git Bash (MingW64).
 
My IDE (Php-Storm, Intelli J) can do a SFTP-Sync with the VM.
So i'm uploading instantly on file change.

## Production
Simply run it as Docker.
```
cd /data/node-radio-automation
docker-compose up -d
```