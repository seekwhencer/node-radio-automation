const
    RouteSet = require('../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        this.param = 'channel';
        this.source = CHANNELS;

        // get one channel
        this.router.get('/:channel', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            let message = {
                id: channel.id,
                name: channel.name,
                mount: channel.mpd.options.config.audio_output.mount,
                ...{options: channel.options}
            };
            res.json(message);
        });

        // skip track
        this.router.get('/:channel/skip', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.skip();
            res.send(channel.name + ' skipped');
        });

        // update mpc music database
        this.router.get('/:channel/update-database', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.updateDatabase();
            res.send(channel.name + ' database updating');
        });

        // load playlist only
        this.router.get('/:channel/load-playlist', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.loadPlaylist();
            res.send(channel.name + ' playlist loaded');
        });

        // update playlist and play
        this.router.get('/:channel/update-playlist', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.updatePlaylist();
            res.send(channel.name + ' playlist updated');
        });

        // play
        this.router.get('/:channel/play', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.play();
            res.send(channel.name + ' playing');
        });

        // play track number
        this.router.get('/:channel/play/:number', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.play(req.params.number);
            res.send(channel.name + ' playing');
        });

        // pause playing
        this.router.get('/:channel/pause', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.pause();
            res.send(channel.name + ' paused');
        });

        // stop playing
        this.router.get('/:channel/stop', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.stop();
            res.send(channel.name + ' stopped');
        });

        // set crossfade in seconds
        this.router.get('/:channel/crossfade/:seconds', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.setCrossfade(req.params.seconds);
            res.send(channel.name + ' setting crossfade to: ' + req.params.seconds + ' seconds');
        });

        // reboot channel
        this.router.get('/:channel/respawn', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.respawn();
            res.send(channel.name + ' respawning');
        });

        // shutdown channel
        this.router.get('/:channel/shutdown', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.shutdown();
            res.send(channel.name + ' shutting down');
        });

        // spawn channel
        this.router.get('/:channel/spawn', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.spawn();
            res.send(channel.name + ' spawning');
        });

        return this.router;
    }
};