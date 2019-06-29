# node-radio-automation

This app is a multichannel playlist audio streaming automation. 
 
**At the moment you can use the api to control the app behavior.  
The Stream controls are full working.  
The Frontend App (Web Interface) is in progress.**

## Features

- manage Icecast2 as Streaming Server
- manage MPD (Music Player Daemon), use it as playlist player and stream encoder
- using MPC (Music Player Client) 
- manage Channels with Shows and their Playlists
- generate Playlists with:
  - Intro
  - Spots
  - Postcast
  - Hot Rotation
- serving an API to control the app with a Web-Interface or API-Client
- no Database needed
- runs on a Raspberry Pi (but only with one Channel)

## What is this NOT?

- a Music Player Remote Controller or a MPD Client.
- a System to manage your files and play them like Foobar2000, iTunes or others.
- a Spotify player or youtube or, or, or. 
- a System to manage dozens of files

## Whom helps this?

- who wants to run a automated, multi channel internet radio. locally, in an intranet or public.
- who is crying for a "Auto DJ" for his / her web radio.
- who wants to sound an event or a location (like a night bar) with different schemes
- while doing this, who wants to have so less as possible personnel expense
- who wants more then a shuffled playlist, who wants a hot rotation with more newest track as older ones
- who wants to use intros and spots for an audio identity
- who wants to spread podcast files between the tracks, automatically downloaded from podcast feeds
- who want to use his own bought music files, captured from the disc or from vinyl 
- who wants, that his / her music files exists forever. that they do not disappear suddenly.
- who wants to play handpicked tracks

## See the [Documentation](docs/README.md)
 
### At the moment this works well:

- complete channel creation works well via api
- scheduling for channels works: you can start, stop, pause a show from a channel with cron scheme and multiple jobs
- scheduling for podcasts works well: with cron scheme and one job. looks for new episodes and download these
- API-Authentication with JWT (json web token)

### Channel

 - get all
 - create one
 - get by id
 - delete by id
 - update by id
 - update database (MPD cache)
 - load playlist
 - update playlist
 - play
 - pause
 - stop
 - skip track
 - set crossfade
 - spawn
 - respawn
 - shutdown

### Shows of a Channel

 - get all
 - create one
 - get one
 - get playing show
 - delete
 - update
 - duplicate 
 - set playing show
 - copy from global show
 - get show folder
 - set show folder
 - get music folder
 - get intro folder
 - get spot folder
 - get podcast folder
 
 ### Global Shows
 
 - get all
 - create one
 - duplicate
 - get one
 - delete
 - update 
 
 ### Podcasts
 
 - get all
 - create one
 - duplicate
 - get one
 - delete
 - update
 
## Future Things

- Frontend App with Vue **(in progress)**
- Podcast Downloader Sheduler invoke a queue
- Backup mechanism for the complete storage folder
- Docker (Compose) Setup
- Some downloadable example assets
- Ideas?
 