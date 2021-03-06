import RouteSet from '../../../RouteSet.js';
import ScheduleForm from '../../../lib/schedule/form.js';

export default class extends RouteSet {
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
            const optionsCheck = {...schedule.options, ...updateOptions};
            const existsSchedule = channel.schedules.exists(optionsCheck, schedule.id);

            if (existsSchedule)
                return this.error(`Schedule exists.`, res);

            if (!this.scheduleForm.checkCron(updateOptions.cron))
                return this.error(`ERROR CRON JOB FORMAT.`, res);

            schedule
                .update(updateOptions)
                .then(schedule => {
                    const data = {
                        id: schedule.options.id,
                        show_id: schedule.options.show_id,
                        action: schedule.options.action,
                        cron: schedule.options.cron,
                        cronString: schedule.cronString,
                        next: schedule.nextTime(),
                        timestamp: schedule.nextTimestamp()
                    };
                    this.success(req, res, 'Schedule updated', data);
                });

        });

        return this.router;
    }
};