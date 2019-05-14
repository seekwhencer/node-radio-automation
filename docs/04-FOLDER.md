# Folder

```
node-radio-automation
    app
        config
            default
            production
            custom
        lib
            Channels
            Icecast
            Shows
            Storage
            ...
    docs
```

## Storage folder location

By default (development) config the app will create a storage folder, one folder up from the app folder.
To change the global storage folder, edit:
 
**`app/config/ENV/storage.js`**
```
path: '../storage',
```

The storage folder is relative to the app folder. And ignored by the `.gitignore` file.
After the first run, these folders exists at the top level:

```
node-radio-automation
    app
    docs
    storage
```


## Storage folder content

The storage folder contains all created data from the app.
```
storage/channels
storage/channels/CHANNEL-ID.json
storage/channels/CHANNEL-ID
storage/channels/CHANNEL-ID/SHOW-ID.m3u
storage/channels/CHANNEL-ID/mpd.conf
storage/channels/CHANNEL-ID/mpd.pid
 
storage/icecast
storage/icecast/log
storage/icecast/log/icecast_access.log
storage/icecast/log/icecast_error.log
storage/icecast/ICECAST-NAME.xml
 
storage/shows
storage/shows/SHOW-ID.json
 
storage/mpd_shared.cache
storage/mpd_shared.conf
storage/mpd_shared.pid
```

## Audio folder location

Mpd needs ONE root folder for the mp3 files. To configure the root folder

**`app/config/ENV/station.js`**
```
path: {
    audio: '../../audio'
},
```
The audio root folder is two folders UP from the app root.
```
/data/node-radio-automation
/data/audio
```
Place a symlink to `/data/audio` if you want.

## Audio folder content
Types of audio files equals to their mp3 root folder
```
/data/audio/music
/data/audio/intro
/data/audio/spot
/data/audio/podcast
```

Defaults stored in:
**`app/config/ENV/show.js`**
```
path: {
    music: "music",
    podcast: "podcast",
    spot: "spot",
    intro: "intro"
}
```

Every show wants a own root folder, relative from the type roots.
So you can configure a show with subfolder name. For example:

```
/data/audio/music/breaks
/data/audio/intro/station
/data/audio/spot/station
/data/audio/podcast/news
```
Defaults are stored in: 
**`app/config/ENV/shows.js`** for example:
```
show.options.music.folder   = "breaks"
show.options.intro.folder   = "station"
show.options.spot.folder    = "station"
show.options.podcast.folder = "news"
```
A folder per show will be created by:
```
AUDIO ROOT FOLDER + TYPE ROOT FOLDER + SHOW FOLDER
```
 
  

