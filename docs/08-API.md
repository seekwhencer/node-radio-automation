# Api

The Api runs on the given port in **`app/config/ENV/api.js`**
```
port: 8200
```
## Channel Listing

### `/channels`
Returns a json array with channel objects
```
[
    {
        "id": "4b7242e55b28eae45dbaf92301aa099a"
        "name": "One"
        "mount": "/one"
    },
    {
        "id": "4b7242e55b28eae45dbaf92301aa099a"
        "name": "Two"
        "mount": "/two"
    }
]
```

## Channel

### `/channel/CHANNEL-ID`
Returns one channel object
```
{
    "id": "4b7242e55b28eae45dbaf92301aa099a"
    "name": "One"
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


## Shows Listing
### `/shows`
Returns a json array with show objects
```
[
    {
        "id": "4b7242e55b28eae45dbaf92301aa099a"
        "name": "One"
    },
    {
        "id": "4b7242e55b28eae45dbaf92301aa099a"
        "name": "Two"
    }
]
```

## Show

### `/show/SHOW-ID`
Returns one show object
```
{
    "id": "4b7242e55b28eae45dbaf92301aa099a"
    "name": "One"
}
```


