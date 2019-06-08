const
    Module = require('../Module'),
    clock = require('node-schedule');

module.exports = class ScheduleJob {
    constructor(args) {
        this.name = 'schedulejob';
        this.label = 'SCHEDULE JOB';
        this.schedule = args.schedule;
        this.channel = this.schedule.channel;

        let cronArray = [];
        for (let i = 1; i < 6; i++) {
            cronArray.push(`${this.schedule.options.cron[`${i}`]}`);
        }
        const cronString = cronArray.join(' ');
        const channelName = this.channel.options.name;

        if (!this.schedule.options.show_id) {
            LOG(this.label, 'CANT START JOB: no show_id given.');
            return false;
        }

        const show = this.channel.shows.get(this.schedule.options.show_id, 'id');
        if (!show) {
            LOG(this.label, 'SHOW NOT FOUND: ', this.schedule.options.show_id);
            return false;
        }

        const showName = show.name;
        LOG(this.label, 'INIT', cronString, 'CHANNEL:', channelName, 'SHOW:', showName);

        return clock.scheduleJob(cronString, () => {
            LOG('');
            LOG('/////////');
            LOG(this.label, 'TRIGGERING:', cronString, 'CHANNEL:', channelName, 'SHOW:', showName);
            LOG('/////////');
            LOG('');
            /**
             * DOING THINGS HERE
             *
             * set the given show for the channel and play it
             */
            if (this.schedule.options.show_id)
                this.channel.setShow(this.schedule.options.show_id, 'id');
                this.channel.updatePlaylist();
        });
    }
};