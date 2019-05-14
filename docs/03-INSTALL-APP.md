# Installing the app

- Installing Node.js with **[n](https://github.com/tj/n)** NOT as root user
```
cd ~
curl -L https://git.io/n-install | bash
```

- Exit this console session and reconnect to reload the `~/.bashrc`.
 
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