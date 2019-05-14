const router = EXPRESS.Router();

router.get('/:channel', (req, res) => {
    let channel = CHANNELS.get(req.params.channel, 'id');
    if (!channel) {
        res.send('404');
        return;
    }
    let out = {
        id: channel.id,
        name: channel.name,
        mount: channel.mpd.options.config.audio_output.mount,
        ...{options: channel.options}
    };
    res.json(out);
});

// skip track
router.get('/:channel/skip', (req, res) => {
    let channel = CHANNELS.get(req.params.channel, 'id');
    if (!channel) {
        res.send('404');
        return;
    }

    channel.skip();
    res.send(channel.name + ' skipped');
});

// update mpc music database
router.get('/:channel/update-database', function (req, res) {
    let channel = CHANNELS.get(req.params.channel, 'id');
    if (!channel) {
        res.send('404');
        return;
    }
    channel.updateDatabase();
    res.send(channel.name + ' database updating');
});

// load playlist only
router.get('/:channel/load-playlist', (req, res) => {
    let channel = CHANNELS.get(req.params.channel, 'id');
    if (!channel) {
        res.send('404');
        return;
    }
    channel.loadPlaylist();
    res.send(channel.name + ' playlist loaded');
});

// update playlist and play
router.get('/:channel/update-playlist', (req, res) => {
    let channel = CHANNELS.get(req.params.channel, 'id');
    if (!channel) {
        res.send('404');
        return;
    }
    channel.updatePlaylist();
    res.send(channel.name + ' playlist updated');
});

// play
router.get('/:channel/play', (req, res) => {
    let channel = CHANNELS.get(req.params.channel, 'id');
    if (!channel) {
        res.send('404');
        return;
    }
    channel.play();
    res.send(channel.name + ' playing');
});

// play track number
router.get('/:channel/play/:number', (req, res) => {
    let channel = CHANNELS.get(req.params.channel, 'id');
    if (!channel) {
        res.send('404');
        return;
    }
    channel.play(req.params.number);
    res.send(channel.name + ' playing');
});

// pause playing
router.get('/:channel/pause', (req, res) => {
    let channel = CHANNELS.get(req.params.channel, 'id');
    if (!channel) {
        res.send('404');
        return;
    }
    channel.pause();
    res.send(channel.name + ' paused');
});

// stop playing
router.get('/:channel/stop', (req, res) => {
    let channel = CHANNELS.get(req.params.channel, 'id');
    if (!channel) {
        res.send('404');
        return;
    }
    channel.stop();
    res.send(channel.name + ' stopped');
});

// set crossfade in seconds
router.get('/:channel/crossfade/:seconds', (req, res) => {
    let channel = CHANNELS.get(req.params.channel, 'id');
    if (!channel) {
        res.send('404');
        return;
    }
    channel.setCrossfade(req.params.seconds);
    res.send(channel.name + ' setting crossfade to: ' + req.params.seconds + ' seconds');
});

// reboot channel
router.get('/:channel/respawn', (req, res) => {
    let channel = CHANNELS.get(req.params.channel, 'id');
    if (!channel) {
        res.send('404');
        return;
    }
    channel.respawn();
    res.send(channel.name + ' respawning');
});

// shutdown channel
router.get('/:channel/shutdown', (req, res) => {
    let channel = CHANNELS.get(req.params.channel, 'id');
    if (!channel) {
        res.send('404');
        return;
    }
    channel.shutdown();
    res.send(channel.name + ' shutting down');
});

// spawn channel
router.get('/:channel/spawn', (req, res) => {
    let channel = CHANNELS.get(req.params.channel, 'id');
    if (!channel) {
        res.send('404');
        return;
    }
    channel.spawn();
    res.send(channel.name + ' spawning');
});

module.exports = router;