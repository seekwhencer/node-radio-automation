const
    RouteSet = require('../../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        /**
         * get all schedules from channel
         */
        this.router.get('/:channel/schedules', (req, res) => {
            const channel_id = req.params.channel;
            const channel = CHANNELS.get(channel_id, 'id');
            if (!channel)
                return this.error('Channel not found', res);

            if (!channel.schedules.items) {
                if (!channel)
                    return this.error('Channel has no schedules', res);
            }
            const schedules = channel.schedules.items.map((schedule) => {
                return schedule.options;
            });
            res.json(schedules);
        });

        return this.router;
    }
};