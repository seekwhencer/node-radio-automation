import fs from 'fs-extra';
import slugify from 'slugify';
import crypto from 'crypto';
import cronParser from 'cron-parser';
import Module from '../Module.js';
import Downloader from './Downloader.js';
import Job from './Job.js';

export default class Podcast extends Module {

    constructor(args) {
        super(args);
        return new Promise((resolve, reject) => {
            this.name = 'podcast';
            this.label = 'PODCAST';
            this.mergeOptions();

            LOG('');
            LOG(this.label, 'INIT', this.name);

            STORAGE.createFolder(this.options.audio_root);
            STORAGE.createFolder(this.path);

            this.downloader = new Downloader({
                path: this.path,
                url: this.options.url,
                limit: this.options.limit
            });

            this.initJob();

            this.on('ready', () => {
                LOG(this.label, '>>> READY', this.name);
                this.ready = true;
                if (this.options.autostart === true) {
                    this.downloader
                        .fetch()
                        .then(items => {
                            LOG(this.label, 'EPISODES:', items.length);
                            resolve(this);
                        });
                } else {
                    resolve(this);
                }
            });

            // save the podcast as json
            this.save();

        });
    }

    mergeOptions(args) {
        if (!args) {
            this.options = R.mergeDeepLeft(this.args.options, CONFIG.podcast);
        } else {
            this.options = R.mergeDeepLeft(args, this.options);
        }

        if (!this.options.slug)
            this.options.slug = slugify(this.options.name, {replacement: '_', lower: true});

        if (!this.options.id)
            this.options.id = `id${crypto.createHash('md5').update(`${Date.now()}`).digest("hex")}`;

        this.id = this.options.id;
        this.name = this.options.name;
        this.slug = this.options.slug;

        this.options.conf_path = this.args.path;
        this.options.conf_file = P(`${this.options.conf_path}/${this.id}.json`);

        this.options.audio_root = P(`${APP_DIR}/${CONFIG.station.path.audio}/podcast`);
        this.path = `${this.options.audio_root}/${this.id}`;
        this.options.path = this.path;
    }

    save(silent) {
        fs.writeJsonSync(this.options.conf_file, this.options);
        if (!silent)
            this.emit('ready');
    }

    delete() {
        fs.removeSync(this.options.conf_file);
        fs.removeSync(this.path);
        if (this.job)
            this.job.cancel();
        this.podcasts.delete(this.id);
    }

    update(updateOptions) {
        return new Promise((resolve, reject) => {
            this.mergeOptions(updateOptions);
            this.save(true);
            this.initJob();

            ['name', 'description', 'url', 'path', 'limit'].forEach(i => {
                this.downloader.options[i] = this.options[i];
            });

            this.downloader
                .fetch()
                .then(items => {
                    LOG(this.label, 'EPISODES:', items.length);
                    resolve(this);
                });
        });
    }

    initJob() {
        if (this.job)
            this.job.cancel();

        this.job = new Job({
            podcast: this
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