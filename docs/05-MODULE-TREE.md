# Module Tree

All "Modules" are globally available.

```
STATION
STORAGE
MPDCACHE
ICECAST
SHOWS
CHANNELS
```

## `STATION`

Starts the Modules.

## `STORAGE`
```
STORAGE.createFolder(folder)
STORAGE.flushAll();
STORAGE.flush(folder);
STORAGE.fetch.channels();
STORAGE.fetch.audio();
STORAGE.fetch.shows();
STORAGE.fetch.inputs();
```

## `MDPCACHE`

This is a mpd instance to build and update the shared audio file database.
Mpd crawls the folder structure and save a own database. 

