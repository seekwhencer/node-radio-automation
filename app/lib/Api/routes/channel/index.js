const
    RouteSet = require('../../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        /**
         * get one channel
         */
        this.router.get('/:channel', (req, res) => {
            const id = req.params.channel;
            const channel = CHANNELS.get(id, 'id');
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

        return this.router;
    }
};