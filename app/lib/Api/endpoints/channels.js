const router = EXPRESS.Router();

router.get('/', (req, res) => {
    let channels = CHANNELS.items;
    let out = channels.map((channel) => {
        return {
            id: channel.id,
            name: channel.name,
            mount: channel.mpd.options.config.audio_output.mount,
            playing: channel.playing
        };
    });
    res.json(out);
});

module.exports = router;
