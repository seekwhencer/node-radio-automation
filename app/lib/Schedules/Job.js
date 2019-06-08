const
    Module = require('../Module'),
    clock = require('node-schedule');

module.exports = class ScheduleJob {
    constructor(args) {
        this.name = 'schedulejob';
        this.label = 'SCHEDULE JOB';
        this.schedule = args.schedule;

        let cronArray = [];
        for (let i = 1; i < 6; i++) {
            cronArray.push(`${this.schedule.options.cron[`${i}`]}`);
        }
        const cronString = cronArray.join(' ');
        const channelName = this.schedule.channel.options.name;
        const showName = this.schedule.channel.shows.get(this.schedule.options.show_id, 'id').name;
        LOG(this.label, 'INIT', cronString, 'CHANNEL:', channelName, 'SHOW:', showName);

        return clock.scheduleJob(cronString, () => {

            console.log(this, label, 'TRIGGERING SCHEDULED JOB');
        });
    }
};