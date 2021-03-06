import RouteSet from '../../../RouteSet.js';
import ScheduleForm from '../../../lib/schedule/form.js';

export default class extends RouteSet {
    constructor() {
        super();

        this.scheduleForm = new ScheduleForm();

        /**
         * Create a new Schedule
         */
        this.router.post('/:channel/schedule/create', (req, res) => {
            const channel_id = req.params.channel;
            const channel = CHANNELS.get(channel_id, 'id');

            if (!channel)
                return this.error('Channel not found', res);

            const show_id = req.fields.show_id || false;
            if (!show_id)
                return this.error('No Show Id given', res);

            const show = channel.shows.get(show_id, 'id');
            if (!show)
                return this.error(`Show with id ${id} not exists.`, res);

            const options = this.scheduleForm.parse(req.fields);
            for (let i = 1; i < 6; i++)
                options.cron[`${i}`] = options.cron[`${i}`] || '*';

            const existsSchedule = channel.schedules.exists(options);
            if (existsSchedule)
                return this.error(`Schedule exists.`, res);

            if (!this.scheduleForm.checkCron(options.cron))
                return this.error(`ERROR CRON JOB FORMAT.`, res);

            channel.schedules
                .create(options)
                .then(schedule => {
                    this.success(req, res, 'New Schedule created', schedule.options);
                });
        });

        return this.router;
    }
};