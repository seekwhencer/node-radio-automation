import RouteSet from '../../../RouteSet.js';

export default class extends RouteSet {
    constructor() {
        super();

        /**
         * delete a schedule from channel
         */
        this.router.post('/:channel/schedule/delete', (req, res) => {
            const channel_id = req.params.channel;
            const channel = CHANNELS.get(channel_id, 'id');
            const schedule_id = req.fields.id || false;

            if (!channel)
                return this.error('Channel not found', res);

            if (!schedule_id)
                return this.error('No Schedule Id given', res);

            const schedule = channel.schedules.get(schedule_id, 'id');
            if (!schedule)
                return this.error(`Schedule with id ${id} not exists. No Schedule deleted`, res);

            schedule.delete();
            this.success(req, res, `Schedule ${schedule.name} deleted`, {
                id: schedule.id,
                name: schedule.name
            });
        });

        return this.router;
    }
};