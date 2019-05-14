const
    router = EXPRESS.Router();

router.get('/', (req, res) => {
    const channels = CHANNELS.items;
    const out = channels.map((channel) => {
        return `http://${API.host}:${channel.mpd.options.config.audio_output.port}${channel.mpd.options.config.audio_output.mount}`;
    });
    res.end(out.join('\n'));
});

module.exports = router;
