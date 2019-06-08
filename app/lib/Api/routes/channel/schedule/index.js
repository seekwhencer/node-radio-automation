const
    RouteSet = require('../../../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

                /**
         * get one schedule from channel
         */
        this.router.get('/:channel/schedule/:schedule', (req, res) => {
            const channel_id = req.params.channel;
            const channel = CHANNELS.get(channel_id, 'id');
            if (!channel)
                return this.error('Channel not found', res);

            const schedule_id = req.params.schedule || false;
            if (!schedule_id)
                return this.error('No Schedule Id given', res);

            const channelSchedule = channel.schedules.get(schedule_id, 'id');
            if (!channelSchedule)
                return this.error('Schedule not found', res);

            res.json(channelSchedule.options);
        });

        return this.router;
    }
};