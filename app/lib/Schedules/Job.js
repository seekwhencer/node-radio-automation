import clock from 'node-schedule';

export default class ScheduleJob {
    constructor(args) {
        this.name = 'schedulejob';
        this.label = 'SCHEDULE JOB';
        this.schedule = args.schedule;
        this.channel = this.schedule.channel;

        let cronArray = [];
        for (let i = 1; i < 6; i++) {
            cronArray.push(`${this.schedule.options.cron[`${i}`]}`);
        }
        this.cronString = cronArray.join(' ');
        this.schedule.cronString = this.cronString;
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
        LOG(this.label, 'INIT', this.cronString, 'CHANNEL:', channelName, 'SHOW:', showName);

        return clock.scheduleJob(this.cronString, () => {
            LOG('');
            LOG('/////////');
            LOG(this.label, 'TRIGGERING:', this.cronString, 'CHANNEL:', channelName, 'SHOW:', showName);
            LOG('/////////');
            LOG('');
            /**
             * DOING THINGS HERE
             *
             * set the given show for the channel and play it
             */
            if (this.schedule.options.action === 'play') {
                if (this.schedule.options.show_id) {
                    this.channel.setShow(this.schedule.options.show_id, 'id');
                    this.channel.updatePlaylist();
                }
            }

            if (this.schedule.options.action === 'pause') {
                this.channel.pause();
            }

            if (this.schedule.options.action === 'stop') {
                this.channel.stop();
            }

            // be careful
            if (this.schedule.options.action === 'respawn') {
                this.channel.respawn();
            }


        });
    }
};