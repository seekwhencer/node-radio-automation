const
    RouteSet = require('../../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        /**
         * update mpd music database
         */
        this.router.get('/:channel/update-database', (req, res) => {
            const id = req.params.channel;
            const channel = CHANNELS.get(id, 'id');
            if (!channel)
                return this.error('Channel not found', res);

            channel.updateDatabase();
            this.success(req, res, channel.name + `MPD Database Update on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        return this.router;
    }
};