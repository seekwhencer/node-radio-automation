const
    RouteSet = require('../../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        /**
         * restart channel
         */
        this.router.get('/:channel/respawn', (req, res) => {
            const id = req.params.channel;
            const channel = CHANNELS.get(id, 'id');
            if (!channel)
                return this.error('Channel not found', res);

            channel.respawn();
            this.success(req, res, `Respawning Channel: ${channel.name}`);
        });

        /**
         * shutdown channel
         */
        this.router.get('/:channel/shutdown', (req, res) => {
            const id = req.params.channel;
            const channel = CHANNELS.get(id, 'id');
            if (!channel)
                return this.error('Channel not found', res);

            channel.shutdown();
            this.success(req, res, `Shutting down Channel: ${channel.name}`);
        });

        /**
         * spawn channel (music player daemon)
         */
        this.router.get('/:channel/spawn', (req, res) => {
            const id = req.params.channel;
            const channel = CHANNELS.get(id, 'id');
            if (!channel)
                return this.error('Channel not found', res);

            channel.spawn();
            this.success(req, res, `Spawn Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        return this.router;
    }
};