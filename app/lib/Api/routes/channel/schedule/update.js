const
    RouteSet = require('../../../RouteSet.js'),
    ScheduleForm = require('../../../lib/schedule/form.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        this.scheduleForm = new ScheduleForm();

        /**
         * update a schedule from channel
         */
        this.router.post('/:channel/schedule/update', (req, res) => {
            const channel_id = req.params.channel;
            const channel = CHANNELS.get(channel_id, 'id');
            const schedule_id = req.fields.id || false;
            const show_id = req.fields.show_id || false;

            if (!channel)
                return this.error('Channel not found', res);

            if (!schedule_id)
                return this.error('No Schedule Id given', res);

            if (show_id) {
                const show = channel.shows.get(show_id, 'id');
                if (!show)
                    return this.error(`Show with id ${schedule_id} not exists.`, res);
            }

            const schedule = channel.schedules.get(schedule_id, 'id');
            if (!schedule)
                return this.error(`Schedule with id ${schedule_id} not exists.`, res);

            const updateOptions = this.scheduleForm.parse(req.fields);
            const optionsCheck = { ...schedule.options, ...updateOptions};
            const existsSchedule = channel.schedules.exists(optionsCheck, schedule.id);

            if (existsSchedule)
                return this.error(`Schedule exists.`, res);

            schedule
                .update(updateOptions)
                .then(schedule => {
                    this.success(req, res, 'Schedule updated', schedule.options);
                });

        });

        return this.router;
    }
};