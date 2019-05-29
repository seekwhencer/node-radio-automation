# node-radio-automation

This app is a multichannel playlist audio streaming automation. 

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

## Future Things

At the moment, the app is usable how it is described in the docs - or
better - what is possible with the Insomnia export.
 
- Backup mechanism for the complete storage folder
- Scheduling: let a show from a channel begin by a week scheme with week day, hour and minute.
- Podcast with downloader
- Frontend App with Vue
- Docker (Compose) Setup
- Ideas?
 