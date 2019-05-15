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
    }
]
```

## Channel
### `/channel/CHANNEL-ID`
Returns one channel object
```json
{
    "id": "4b7242e55b28eae45dbaf92301aa099a",
    "name": "One",
    "mount": "/one"
}
```

### `/channel/CHANNEL-ID/update-database`
Refresh the Music Player Database.

### `/channel/CHANNEL-ID/update-playlist`
Generate a new playlist and play it.

### `/channel/CHANNEL-ID/play`
Play the playlist from number 0.

### `/channel/CHANNEL-ID/play/NUMBER`
Play the playlist from the given number.

### `/channel/CHANNEL-ID/pause`
Pause playback.

### `/channel/CHANNEL-ID/stop`
Stop playback.

### `/channel/CHANNEL-ID/skip`
Skip track.

### `/channel/CHANNEL-ID/crossfade/SECONDS`
Set the playlist track crossfade to the given seconds.

### `/channel/CHANNEL-ID/repeat`
Set the playlist in repeat mode.

### `/channel/CHANNEL-ID/shutdown`
Shutting down the channel and the music player daemon.

### `/channel/CHANNEL-ID/spawn`
Starting the channel.

### `/channel/CHANNEL-ID/respawn`
Shutting down and starting the channel again.


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
    }
]
```

## Show

### `/show/SHOW-ID`
Returns one show object
```json
{
    "id": "4b7242e55b28eae45dbaf92301aa099a",
    "name": "One"
}
```


