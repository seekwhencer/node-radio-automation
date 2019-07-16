import RouteSet from '../../RouteSet.js'

export default class extends RouteSet {
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
                    cron: schedule.options.cron,
                    cronString: schedule.cronString,
                    next: schedule.nextTime(),
                    timestamp: schedule.nextTimestamp()
                };
            });
            res.json(schedules);
        });

        return this.router;
    }
};