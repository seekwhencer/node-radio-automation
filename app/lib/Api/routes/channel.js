const
    RouteSet = require('../RouteSet.js'),
    ShowForm = require('../lib/show/form.js');
;

module.exports = class extends RouteSet {
    constructor() {
        super();

        this.param = 'channel';
        this.source = CHANNELS;

        this.showForm = new ShowForm();

        /**
         * get one channel
         */
        this.router.get('/:channel', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return this.error('Channel not found', res);

            let message = {
                id: channel.id,
                name: channel.name,
                mount: channel.mpd.options.config.audio_output.mount,
                ...{options: channel.options}
            };
            res.json(message);
        });

        /**
         * skip track
         */
        this.router.get('/:channel/skip', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return this.error('Channel not found', res);

            channel.skip();
            this.success(req, res, `Skipped on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        /**
         * update mpd music database
         */
        this.router.get('/:channel/update-database', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return this.error('Channel not found', res);

            channel.updateDatabase();
            this.success(req, res, channel.name + `MPD Database Update on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        /**
         * load playlist only
         */
        this.router.get('/:channel/load-playlist', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return this.error('Channel not found', res);

            channel.loadPlaylist();
            this.success(req, res, `Playlist loaded on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        /**
         * update playlist and play
         */
        this.router.get('/:channel/update-playlist', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return this.error('Channel not found', res);

            channel.updatePlaylist();
            this.success(req, res, `Playlist updated on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        /**
         * play
         */
        this.router.get('/:channel/play', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return this.error('Channel not found', res);

            channel.play();
            this.success(req, res, `PLaying on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        /**
         * play from track number
         */
        this.router.get('/:channel/play/:number', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return this.error('Channel not found', res);

            channel.play(req.params.number);
            this.success(req, res, `Play at Position ${req.params.number} on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        /**
         * pause playing
         */
        this.router.get('/:channel/pause', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return this.error('Channel not found', res);

            channel.pause();
            this.success(req, res, `Pause on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        /**
         * stop playing
         */
        this.router.get('/:channel/stop', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return this.error('Channel not found', res);

            channel.stop();
            this.success(req, res, `Stopped on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        /**
         * set cross fade
         */
        this.router.get('/:channel/crossfade/:seconds', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return this.error('Channel not found', res);

            channel.setCrossfade(req.params.seconds);
            this.success(req, res, `Crossfade set to ${req.params.seconds} on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        /**
         * restart channel
         */
        this.router.get('/:channel/respawn', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return this.error('Channel not found', res);

            channel.respawn();
            this.success(req, res, `Respawning Channel: ${channel.name}`);
        });

        /**
         * shutdown channel
         */
        this.router.get('/:channel/shutdown', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return this.error('Channel not found', res);

            channel.shutdown();
            this.success(req, res, `Shutting down Channel: ${channel.name}`);
        });

        /**
         * spawn channel (music player daemon)
         */
        this.router.get('/:channel/spawn', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return this.error('Channel not found', res);

            channel.spawn();
            this.success(req, res, `Spawn Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        /**
         * set show as playing one
         */
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

        /**
         * get playing show from channel
         */
        this.router.get('/:channel/show', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return this.error('Channel not found', res);

            if (!channel.show)
                return this.error('Channel is playing no Show', res);

            this.success(req, res, `Channel: ${channel.name} playing Show: ${channel.show.name}.`, {
                ...channel.show.options
            });
        });


        /**
         * duplicate a show from channel
         */
        this.router.post('/:channel/show/duplicate', (req, res) => {
            const channel = this.one(req, res);
            const show_id = req.fields.id || false;
            let name = req.fields.name || false;

            if (!channel)
                return this.error('Channel not found', res);

            if (!show_id)
                return this.error('Show ID not given', res);

            const sourceShow = channel.shows.get(show_id, 'id');
            if (!sourceShow)
                return this.error('Show not found', res);

            name = name ? name : sourceShow.options.name;

            const existingShowName = channel.shows.get(name, 'name');
            if (existingShowName)
                return this.error(`Show with name ${name} exists `, res);

            const newShow = {
                ...sourceShow.options,
                name: name,
                id: false,
                slug: false
            };

            channel.shows
                .create(newShow)
                .then(show => {
                    this.success(req, res, 'New Show created from global', show.options);
                });
        });


        /**
         * copy global show to channel shows
         */
        this.router.post('/:channel/show/global', (req, res) => {
            const channel = this.one(req, res);
            const show_id = req.fields.id || false;
            let name = req.fields.name || false;

            if (!channel)
                return this.error('Channel not found', res);

            if (!show_id)
                return this.error('Show ID not given', res);

            const globalShow = SHOWS.get(show_id, 'id');
            if (!globalShow)
                return this.error('Show not found', res);

            name = name ? name : globalShow.options.name;

            const existingShowName = channel.shows.get(name, 'name');
            if (existingShowName)
                return this.error(`Show with name ${name} exists `, res);

            channel.shows
                .create({
                    ...globalShow.options,
                    name: name,
                    id: false,
                    slug: false
                })
                .then(show => {
                    this.success(req, res, 'New Show created from global', show.options);
                });
        });


        /**
         * get all shows from channel
         */
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

        /**
         * get one show from channel
         */
        this.router.get('/:channel/show/:show', (req, res) => {
            const channel = this.one(req, res);
            if (!channel)
                return this.error('Channel not found', res);

            const show_id = req.params.show || false;
            if (!show_id)
                return this.error('No Show Id given', res);

            const channelShow = channel.shows.get(show_id, 'id');
            if (!channelShow)
                return this.error('Show not found', res);

            res.json(channelShow.options);
        });


        /**
         * delete a show from channel
         */
        this.router.post('/:channel/show/delete', (req, res) => {
            const channel = this.one(req, res);
            const show_id = req.fields.id || false;

            if (!channel)
                return this.error('Channel not found', res);

            if (!show_id)
                return this.error('No Show Id given', res);

            const show = channel.shows.get(show_id, 'id');
            if (!show)
                return this.error(`Show with id ${id} not exists. No Show deleted`, res);

            show.delete();
            this.success(req, res, `Show ${show.name} deleted`, {
                id: show.id,
                name: show.name
            });
        });

        /**
         * update a show from channel
         */
        this.router.post('/:channel/show/update', (req, res) => {
            const channel = this.one(req, res);
            const show_id = req.fields.id || false;

            if (!channel)
                return this.error('Channel not found', res);

            if (!show_id)
                return this.error('No Show Id given', res);

            const show = channel.shows.get(show_id, 'id');
            if (!show)
                return this.error(`Show with id ${show_id} not exists.`, res);

            const updateOptions = this.showForm.parse(req.fields);

            show
                .update(updateOptions)
                .then(show => {
                    this.success(req, res, 'Show updated', show.options);
                });

        });

        return this.router;
    }
};