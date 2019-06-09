const
    clock = require('node-schedule');

module.exports = class ScheduleJob {
    constructor(args) {
        this.name = 'podcastjob';
        this.label = 'PODCAST JOB';
        this.podcast = args.podcast;

        let cronArray = [];
        for (let i = 1; i < 6; i++) {
            if (this.podcast.options.cron)
                cronArray.push(`${this.podcast.options.cron[`${i}`]}`);
        }
        this.cronString = cronArray.join(' ');
        this.podcast.cronString = this.cronString;

        LOG(this.label, 'INIT', this.cronString, 'PODCAST:', this.podcast.name);

        try {
            return clock.scheduleJob(this.cronString, () => {
                LOG('');
                LOG('/////////');
                LOG(this.label, 'TRIGGERING:', this.cronString, this.podcast.name);
                LOG('/////////');
                LOG('');
                /**
                 * DOING THINGS HERE
                 *
                 *
                 */
                this.podcast.downloader.fetch();
            });
        } catch (err) {
            return false;
        }
    }
};