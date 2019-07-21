# Binaries

## Setup
At the moment (Summer 2019) the binaries will be build with [zeit/pkg](https://github.com/zeit/pkg).  
 
But the app is written in the ES6 Module Pattern, what is the reason for the needed parameter:
```
node --experimental-modules
```
(`package.json`) for the dev mode / the apps runs with a:
 ```
npm run dev
# or
npm run prod
```

## Webpack 
zeit/pkg can not convert ES6 Module Patter to bytecode. I hope later... 
for this reason, the app must be bundled and babeled to ES5. But a
```
npm run bundle
```
does exactly this. Bundling a node app with webpack. 

## zeit/pkg
To make three **x86** binaries for **linux, darwin and windows** enter:
```
npm run build
```
 
To build only for one platform:
```
npm run build:linux
npm run build:win
npm run build:darwin
```

## Bundling, babeling and packaging
To do it all together, enter:

```
npm run dist
```

The output is a folder with the bundled app file:
```
app/dist/app.js
```
And the binaries in:
```
app/station-linux64
app/station-windows64.exe
app/station-darwin64
```

Beware: some things, important things a are **relative** to the app path. if you copy the binary to any other place,
copy the upper audio folder too. A weired result can be, that the downloaded podcasts will be stored - one folder up from
the app folder... ;) ... (with the actual configuration)