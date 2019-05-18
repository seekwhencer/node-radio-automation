# Api

The Api runs on the given port in **`app/config/ENV/api.js`**
```javascript
port: 8200
```

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

## Channel Listing
### `/channels`
Returns a json array with channel objects
```json
[
    {
        "id": "4b7242e55b28eae45dbaf92301aa099a",
        "name": "One",
        "mount": "/one"
    },
    {
        "id": "4b7242e55b28eae45dbaf92301aa099a",
        "name": "Two",
        "mount": "/two"
    },
    ...
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


## Channel
#### `/channel/CHANNEL-ID`
Returns one channel object
```json
{
    "id": "4b7242e55b28eae45dbaf92301aa099a",
    "name": "One",
    "mount": "/one",
    "show": "Breaks"
    ...
}
```
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

#### `channel/CHANNEL-ID/set-show`
Assign a global Show to a channel. POST mutltipart parameters are:
```
id
```


## Shows Listing
### `/shows`
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
    },
    ...
]
```

## Show

### `/show/SHOW-ID`
Returns one show object
```json
{
    "id": "4b7242e55b28eae45dbaf92301aa099a",
    "name": "One",
    ...
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


