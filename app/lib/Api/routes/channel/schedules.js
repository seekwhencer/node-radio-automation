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
                return {
                    id: schedule.options.id,
                    show_id: schedule.options.show_id,
                    cron_1: schedule.options.cron_1,
                    cron_2: schedule.options.cron_2,
                    cron_3: schedule.options.cron_3,
                    cron_4: schedule.options.cron_4,
                    cron_5: schedule.options.cron_5,
                };
            });
            res.json(schedules);
        });

        return this.router;
    }
};