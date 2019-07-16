import RouteSet from '../../RouteSet.js'

export default class extends RouteSet {
    constructor() {
        super();

        /**
         * play
         */
        this.router.get('/:channel/play', (req, res) => {
            const id = req.params.channel;
            const channel = CHANNELS.get(id, 'id');
            if (!channel)
                return this.error('Channel not found', res);

            channel.play();
            this.success(req, res, `PLaying on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        /**
         * play from track number
         */
        this.router.get('/:channel/play/:number', (req, res) => {
            const id = req.params.channel;
            const channel = CHANNELS.get(id, 'id');
            if (!channel)
                return this.error('Channel not found', res);

            channel.play(req.params.number);
            this.success(req, res, `Play at Position ${req.params.number} on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        /**
         * pause playing
         */
        this.router.get('/:channel/pause', (req, res) => {
            const id = req.params.channel;
            const channel = CHANNELS.get(id, 'id');
            if (!channel)
                return this.error('Channel not found', res);

            channel.pause();
            this.success(req, res, `Pause on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        /**
         * stop playing
         */
        this.router.get('/:channel/stop', (req, res) => {
            const id = req.params.channel;
            const channel = CHANNELS.get(id, 'id');
            if (!channel)
                return this.error('Channel not found', res);

            channel.stop();
            this.success(req, res, `Stopped on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        /**
         * skip track
         */
        this.router.get('/:channel/skip', (req, res) => {
            const id = req.params.channel;
            const channel = CHANNELS.get(id, 'id');
            if (!channel)
                return this.error('Channel not found', res);

            channel.skip();
            this.success(req, res, `Skipped on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        /**
         * set cross fade
         */
        this.router.get('/:channel/crossfade/:seconds', (req, res) => {
            const id = req.params.channel;
            const channel = CHANNELS.get(id, 'id');
            if (!channel)
                return this.error('Channel not found', res);

            channel.setCrossfade(req.params.seconds);
            this.success(req, res, `Crossfade set to ${req.params.seconds} on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        return this.router;
    }
};