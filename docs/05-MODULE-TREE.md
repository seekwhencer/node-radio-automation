# Module Tree

All "Modules" are available globally:

```
STATION
STORAGE
PODCASTS
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
STORAGE.flushAll()
STORAGE.flush(folder)
STORAGE.fetch.channels()
STORAGE.fetch.audio()
STORAGE.fetch.shows()
STORAGE.fetch.inputs()
```

## `MDPCACHE`

This is a mpd instance to build and update the shared audio file database.
Mpd crawls the folder structure and save a own database.

## `ICECAST`

Is the audio streaming server. This module creates a xml configuraton for the program how it needs.
Icecast will be started with the app start.

## `SHOWS`
```
SHOWS.items
 
SHOWS.buildFromOptions()
SHOWS.buildFromStorage()
SHOWS.get(match, field)
SHOWS.create(options)
SHOWS.delete(id)
```

Is a collection of *Playlist Setups*. It exists a pool of global shows
and every channel can have - must have - a show.
The show of a channel is a cloned global show.
Both shows can be edited: the global and the channel show.
The modification does'n affecting it's global parent show and vice versa.
 
To assign a default show to a channel, edit the channel option: `channel.option.show`.
Define a object. The key equals the matched field: `id`, `name`, `slug` and
the value of the key equals the desired value of `show.id`, `show.name` or `show.slug`.
This mechanism is invoked by calling the `channel.setDefaultShow()` function.
this sets `channel.show.channel` circular.
 
If a show is set to a channel, the playlist will be generated instantly. 

## `Show`
A show can get: `SHOWS.get(match,field)`. That returns an element of `SHOWS.items`.

```
show.id
show.name
show.slug
show.options
show.playlist
show.channel
 
show.save()
show.setOptionsFromStorage()
show.delete()
show.update()
```

## `Playlist`
 
The playlist is a child of a show. Every show owns a playlist as `show.playlist`.
After `channel.setShow()` or `channel.setDefaultShow()` can you reach the playlist of a channel like: `channel.show.playlist`;
A global show cant save it's playlist. So it can be generated - but not saved.
 
```
playlist.show
playlist.items
playlist.playlist
playlist.music
playlist.podcast
playlist.intro
playlist.spot
 
playlist.getFiles()
playlist.build()
playlist.buildM3U()
playlist.generate()
playlist.insertNth(add, nth, offset)
playlist.addMusic()
playlist.addHotRotation()
playlist.addPodcast()
playlist.addSpot()
playlist.addIntro()
```
 
This is the playlist object. If it have been set the (circular) `playlist.show`, only then

is is possible to know the save path. The path for the playlist files comes from
### `playlist.show`
This show have a circular channel: `playlist.show.channel` - and
from this one the playlist knows where it is to save it.
 
### `playlist.items`
are an array with the audio file objects. a file object contains the absolute path
of a file, and some other usable informations like file size, the create date and the modified date as timestamp.
 
### `playlist.playlist`
is a stupid naming, but it is the text variant of the items, filled row by row
with the absolute path ob a audio file. the m3u file.

### `playlist.music`, `playlist.podcast`,`playlist.intro`, `playlist.spot`
is filled with file objects from the appropriate folder in `show.options.path`
invoked by`playlist.getFiles()`.

### `playlist.build()`
builds the playlist in `playlist.items`.
 
### `playlist.buildM3U()`
stores the m3u file.
 
### `playlist.generate()`
build and store
 

## `CHANNELS`
```
CHANNELS.items
 
CHANNELS.buildFromOptions()
CHANNELS.buildFromStorage()
CHANNELS.build()
CHANNELS.get(match, field)
CHANNELS.create(options)
CHANNELS.delete(id)
CHANNELS.getFreeMpdPort()
CHANNELS.mountExists(mount, not) // not is the actual id
```
These are the ... channels. stored in `CHANNELS.items`

## `Channel`

A channel can get: `CHANNELS.get(match,field)`. That returns an element of `CHANNELS.items`.

```
channel.id
channel.name
channel.slug
channel.options
channel.mpd
channel.mpc
channel.show
channel.path
 
channel.mergeOptions()
channel.initMPD()
channel.initMPC()
channel.save()
channel.delete()
channel.updateField()
channel.update(options)
channel.setShowsFromStorage()
channel.setShow(match,field)
channel.setDefaultShow()
channel.initPlaylist()
channel.loadPlaylist()
channel.updatePlaylist()
channel.updateDatabase()
channel.setCrossfade(seconds)
channel.play(number)
channel.repeat()
channel.pause()
channel.stop()
channel.status()
channel.crop()
channel.shuffle()
channel.skip()
channel.checkReady()
channel.spawn()
channel.respawn()
channel.shutdown()
channel.reload()
```

### `channel.mpd`
### `channel.mpc`
### `channel.show`
### `channel.show.playlist`

# `PODCASTS`

A podcast can get: `PODCASTS.get(match,field)`. That returns an element of `PODCASTS.items`.

```
PODCASTS.items
 
PODCASTS.buildFromOptions()
PODCASTS.buildFromStorage()
PODCASTS.build()
PODCASTS.get(match, field, not)
PODCASTS.create(options)
PODCASTS.delete(id)
```

# `Podcast`
```
podcast.id
podcast.name
 
podcast.downloader
podcast.downloader.options
podcast.downloader.fetch()
podcast.downloader.getFeed()
podcast.downloader.download()
 
podcast.id
podcast.name
podcast.slug
 
podcast.mergeOptions()
podcast.save(silent)
podcast.delete(id)
podcast.update(options)
