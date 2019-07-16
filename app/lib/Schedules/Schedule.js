import fs from 'fs-extra';
import crypto from 'crypto';
import cronParser from 'cron-parser';
import Module from '../Module.js';
import Job from './Job.js';

export default class Schedule extends Module {

    constructor(args) {
        super(args);
        this.name = 'schedule';
        this.label = 'SCHEDULE';
        this.mergeOptions();
        LOG(this.label, 'INIT', this.name);
        this.setOptionsFromStorage();
        this.save();
    }

    mergeOptions(args) {
        if (!args) {
            this.options = R.mergeDeepLeft(this.args.options, CONFIG.schedule.defaults);
        } else {
            this.options = R.mergeDeepLeft(args, this.options);
        }

        if (!this.options.id)
            this.options.id = `id${crypto.createHash('md5').update(`${Date.now()}`).digest("hex")}`;

        this.id = this.options.id;
        this.options.conf_path = this.args.path;
        this.options.conf_file = P(`${this.options.conf_path}/${this.id}.json`);
    }

    save() {
        LOG(this.label, 'SAVING OPTIONS');
        fs.writeJsonSync(this.options.conf_file, this.options);
    }

    get channel() {
        return this._channel;
    }

    set channel(channel) {
        this._channel = channel;
        if (this.channel) {
            this.initJob(); // <-- !!
        }
    }

    setOptionsFromStorage() {
        LOG(this.label, 'BUILD FROM STORAGE');
        const storedOptions = STORAGE.fetch.one(this.options.conf_file);
        if (!storedOptions) {
            return false;
        }
        this.mergeOptions(storedOptions);
    }

    delete() {
        this.job.cancel();
        fs.removeSync(this.options.conf_file);
        this.schedules.delete(this.id);
    }

    update(updateOptions) {
        return new Promise((resolve, reject) => {
            this.mergeOptions(updateOptions);
            this.save();
            this.initJob();
            resolve(this);
        });
    }

    initJob() {
        if (this.job)
            this.job.cancel();

        this.job = new Job({
            schedule: this
        });
    }

    nextTime() {
        const sched = cronParser.parseExpression(this.cronString, {
            tz: 'Europe/Berlin'
        });
        const next = sched.next();
        return next.toString();
    }

    nextTimestamp() {
        const sched = cronParser.parseExpression(this.cronString, {
            tz: 'Europe/Berlin'
        });
        const next = sched.next();
        return next.getTime() / 1000;
    }

};