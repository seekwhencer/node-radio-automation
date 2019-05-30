# Api

The Api runs on the given port in **`app/config/ENV/api.js`**
```javascript
port: 8200
```

## Response Scheme

If something will be modified with a POST, the success response equals:

```
{
    "message": "...",
    "data": {}
}
```

`message ` contains a success message what happens. 
`data` contains some feedback data.
 
On an error, the response looks like:
```
{
    "error": "...",
    "data": {}
}
```
 
Vice versa. 
 
On a simple GET to get some data,
the success response contains **no** `message` field.
Only the pure requested data get back.

## Login
### `/login`
wants a posted multipart form data or json body:
```json
{
    "username": "...",
    "password": "..."
}
```
 
Response:
```json
{
    "message": "authenticated",
    "token": "TOKEN"
}
```
 
Store this token in your API-Client (Frontend App or Insomnia) and use it as Header Paramer:
```json
{
    "access-token": "TOKEN"
}
```
 
Login data can be changed in `app/config/ENV/api.js`

```
auth: {
    secret: 'simsalabim',
    username: 'admin',
    password: 'change!me',
    expires: 1440
}
```

## Channels
### `/channels`
Returns a json array with channel objects
```json
[
    {
        "id": "4b7242e55b28eae45dbaf92301aa099a",
        "name": "One",
        "mount": "/one",
        "show": "Name"
    },
    {
        "id": "4b7242e55b28eae45dbaf92301aa099a",
        "name": "Two",
        "mount": "/two",
        "show": "show"
    }
]
```

### `/channels/create`
Create a new channel. POST mutltipart parameters are:
```
 name                   // must be available.
 show                   // the default show. if no match field is set, is means the 'id
 show_match_field       // possible matchig fields are: 'id','name','slug
 mount                  // if not given, the mount point equals the slugified name
```
- If the name exists, no channel will be created.
- If no show is given, it uses the show defined in `app/config/ENV/channel.js`.
- If no `show_match_field` is given, the default is `id`.
- Is a show given, but not found, no channel will be created.

### `/channels/delete`
Detele a Channel with **ALL** stored data. POST multipart
```
id
```


## Channel
#### `/channel/CHANNEL-ID`
Returns one channel object
```json
{
    "id": "4b7242e55b28eae45dbaf92301aa099a",
    "name": "One",
    "mount": "/one",
    "show": "Breaks"
}
```

#### `/channel/CHANNEL-ID/update`
Upate a channel. POST mutltipart parameters are:
```
 name                   // must be available
 mount                  // must be available
 show                   // the default show. if no match field is set, is means the 'id
 show_match_field       // possible matchig fields are: 'id','name','slug
 autostart              // yes or no
 checkup_delay          // milliseconds check loop time
 bitrate                // bitrate of the stream: 128, 256 ...
 format                 // 44100:16:2 = hz : bit : stereo or mono
 encoding               // mp3 at the moment
 buffer_before_play     // how much ust be buffered
 audio_before_play      // in percent, with percent sign, without space betwen them

```
- If no show is given, it uses the show defined in `app/config/ENV/channel.js`.
- If no `show_match_field` is given, the default is `id`.
- Is a show given, but not found, no channel will be modified.
- If a mount is given, nothing happens
- The channel reloads and restarts after the update

### Channel Playback

#### `/channel/CHANNEL-ID/update-database`
Refresh the Music Player Database.

#### `/channel/CHANNEL-ID/update-playlist`
Generate a new playlist and play it.

#### `/channel/CHANNEL-ID/play`
Play the playlist from number 0.

#### `/channel/CHANNEL-ID/play/NUMBER`
Play the playlist from the given number.

#### `/channel/CHANNEL-ID/pause`
Pause playback.

#### `/channel/CHANNEL-ID/stop`
Stop playback.

#### `/channel/CHANNEL-ID/skip`
Skip track.

#### `/channel/CHANNEL-ID/crossfade/SECONDS`
Set the playlist track crossfade to the given seconds.

#### `/channel/CHANNEL-ID/repeat`
Set the playlist in repeat mode.

### Channel Worker

#### `/channel/CHANNEL-ID/shutdown`
Shutting down the channel and the music player daemon.

#### `/channel/CHANNEL-ID/spawn`
Starting the channel.

#### `/channel/CHANNEL-ID/respawn`
Shutting down and starting the channel again.

### Shows of a Channel

A Channel contains:
```
channel.show
channel.shows
```

The `show` is the actual chosen and playing show. The `shows` are all individual shows for this channel.
`show` is only a linked one and equals one of the `shows` list. If the app starts, global and channel shows
will be created from the defaults in: `app/config/ENV/shows.js` in `options.items`. For both: `SHOWS` and `channel.shows`. 

#### `channel/CHANNEL-ID/shows`
Returns all Shows of a Channel
```
[
  {
    "id": "3cae644d49e45625faa18933fb61ea95",
    "name": "Breaks"
  },
  {
    "id": "1ec12895fa5f8d7c619fb4f3db03dec5",
    "name": "Lounge"
  }
]
```

#### `channel/CHANNEL-ID/show`
Get the running / playing show of a channel.
```
id
```

#### `channel/CHANNEL-ID/show`
Set a show from `channel.shows` as `channel.show`. This is **important to know**: if a channel show is set, instantly
a playlist will be generated and the channel starts the new show.
 
POST mutltipart parameters are:
```
id
```

#### `channel/CHANNEL-ID/show/SHOW-ID`
Get one show of a channel.
```
id
```
 
#### `channel/CHANNEL-ID/show/create`
Create a new show for a channel.
```
id
```
with the same from: `/shows/create`
 
 
#### `channel/CHANNEL-ID/show/update`
Update a show from a channel.
```
id
```
with the same from: `/shows/create` 



#### `channel/CHANNEL-ID/show/duplicate`
Duplicate a show from `channel.shows`. But: nothings happens after that. Call a "Set Show" to play it.
  
POST mutltipart parameters are:
```
id
name
```

#### `channel/CHANNEL-ID/show/global`
Duplicate a show from global `SHOWS` to `channel.shows`.  But: nothings happens after that. Call a "Set Show to Channel" to play it.
  
POST mutltipart parameters are:
```
id
name
```

#### `channel/CHANNEL-ID/show/delete`
Delete a show from global `channel.shows`. But: nothings happens after that. What happens if the show is playing at the moment?
What if the dropped show is the `channel.show`? Nothing. This entry lives forever.
After a "Set Show to Channel", the droppped channel show dies and is overridden.
 
POST mutltipart parameters are:
```
id
```
  
#### `channel/CHANNEL-ID/show/SHOW-ID/folder`
Get the subfolder from the audio folder.

#### `channel/CHANNEL-ID/show/SHOW-ID/folder/music`
Get the music subfolder.

#### `channel/CHANNEL-ID/show/SHOW-ID/folder/intro`
Get the intro subfolder.

#### `channel/CHANNEL-ID/show/SHOW-ID/folder/spot`
Get the spot subfolder.

#### `channel/CHANNEL-ID/show/SHOW-ID/folder/podcast`
Get the pocast subfolder.





## Shows (global)
### `/shows`

This is the global show pool. Later it will be used to duplicate a channel show from it.

Returns a json array with show objects
```json
[
    {
        "id": "4b7242e55b28eae45dbaf92301aa099a",
        "name": "One"
    },
    {
        "id": "4b7242e55b28eae45dbaf92301aa099a",
        "name": "Two"
    }
]
```

### `/shows/create`
Create a show.
 
The final audio file folder is a combination from
```
STATION.config.path.audio   / path_music      / music_folder
STATION.config.path.audio   / path_intro      / intro_folder
STATION.config.path.audio   / path_spot       / spot_folder
STATION.config.path.audio   / path_podcast    / podcast_folder
```
POST multipart
```
name                        // string
enable                      // 1 or 0
description                 // text
stream_description          // text
color                       // string
 
// type root path
path_music                  // string
path_intro                  // string
path_spot                   // string
path_podcast                // string
 
// music
music_folder                // string
music_enable                // 1 or 0
music_order_by              // shuffle, name, time
music_order_direction       // asc or desc
 
// hot rotation
hot_rotation_enable         // 1 or 0
hot_rotation_only           // 1 or 0
hot_rotation_age_days       // int
hot_rotation_latest_tracks  // int
hot_rotation_at_beginning   // 1 or 0
hot_rotation_multiplier     // int
 
// podcast
podcast_enable              // 1 or 0
podcast_folder              // string
podcast_recursive           // 1 or 0
podcast_nth                 // int
podcast_offset              // int
podcast_age_days            // int
podcast_latest_tracks       // int
podcast_random_first        // 1 or 0
podcast_order_by            // shuffle, name, time
podcast_order_direction     // asc or desc
 
// spots
spot_enable                 // 1 or 0
spot_folder                 // string
spot_recursive              // 1 or 0
spot_nth                    // int
spot_offset                 // int
spot_latest_tracks          
spot_random_first           // 1 or 0
spot_order_by               // shuffle, name, time
spot_order_direction        // asc or desc
 
// intro
intro_enable                 // 1 or 0
intro_folder                 // string
intro_recursive              // 1 or 0
intro_order_by               // shuffle, name, time
intro_order_direction        // asc or desc

```

### `/shows/delete`
Delete a global show. POST mutltipart parameters are:
```
id
```


## Show (global)

### `/show/SHOW-ID`
Returns one show object
```json
{
    "id": "4b7242e55b28eae45dbaf92301aa099a",
    "name": "One"
}
```

## Insomnia

You can use the `Insomnia.json` file to load it into - [Insomnia](...)
Manage the environments and edit the environment of the running dev version:

```
{
  "base_url": "{{ protocol }}://{{host}}",
  "host": "",
  "protocol": "http",
  "token": ""
}
```
 
Fill it with life and change the `host`. After a login you can put the token in the environment.
This token will be use as header parameter `access-token`.


