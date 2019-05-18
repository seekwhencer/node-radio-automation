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
            this.success(req, res, `Skipped on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        // update mpc music database
        this.router.get('/:channel/update-database', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.updateDatabase();
            this.success(req, res, channel.name + `MPD Database Update on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        // load playlist only
        this.router.get('/:channel/load-playlist', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.loadPlaylist();
            this.success(req, res, `Playlist loaded on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        // update playlist and play
        this.router.get('/:channel/update-playlist', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.updatePlaylist();
            this.success(req, res, `Playlist updated on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        // play
        this.router.get('/:channel/play', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.play();
            this.success(req, res, `PLaying on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        // play track number
        this.router.get('/:channel/play/:number', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.play(req.params.number);
            this.success(req, res, `Play at Position ${req.params.number} on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        // pause playing
        this.router.get('/:channel/pause', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.pause();
            this.success(req, res, `Pause on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        // stop playing
        this.router.get('/:channel/stop', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.stop();
            this.success(req, res, `Stopped on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        // set crossfade in seconds
        this.router.get('/:channel/crossfade/:seconds', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.setCrossfade(req.params.seconds);
            this.success(req, res, `Crossfade set to ${req.params.seconds} on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        // reboot channel
        this.router.get('/:channel/respawn', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.respawn();
            this.success(req, res, `Respawning Channel: ${channel.name}`);
        });

        // shutdown channel
        this.router.get('/:channel/shutdown', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.shutdown();
            this.success(req, res, `Shutting down Channel: ${channel.name}`);
        });

        // spawn channel
        this.router.get('/:channel/spawn', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return;

            channel.spawn();
            this.success(req, res, `Spawn Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        // set show
        this.router.post('/:channel/show', (req, res) => {
            const channel = this.one(req, res);
            const show_id = req.fields.id || false;

            if (!channel)
                return this.error('Channel not found', res);

            if (!show_id)
                return this.error('Show ID not given', res);

            const show = channel.shows.get(show_id, 'id');
            if (!show)
                return this.error('Show not found', res);

            channel.setShow(show.id, 'id');
            channel.updatePlaylist();
            this.success(req, res, `Channel: ${channel.name} got Show: ${channel.show.name} now.`);
        });

        this.router.get('/:channel/show', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return this.error('Channel not found', res);

            if (!channel.show)
                return this.error('Channel has no Show', res);

            this.success(req, res, `Channel: ${channel.name} has Show: ${channel.show.name}.`, {
                ...channel.show.options
            });

        });

        // get the show listing
        this.router.get('/:channel/shows', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return this.error('Channel not found', res);

            if (!channel.shows.items) {
                if (!channel)
                    return this.error('Channel has no shows', res);
            }
            const shows = channel.shows.items.map((show) => {
                return {
                    id: show.id,
                    name: show.name
                };
            });
            res.json(shows);
        });

        return this.router;
    }
};