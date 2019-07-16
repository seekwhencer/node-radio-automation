import Module from '../Module.js';
import Schedule from './Schedule.js';

export default class Schedules extends Module {

    constructor(args) {
        super(args);
        return new Promise((resolve, reject) => {
            this.name = 'schedules';
            this.label = 'SCHEDULES';
            LOG(this.label, 'INIT');
            this.mergeOptions();
            this.items = [];

            this.path = P(`${STORAGE.path}/${this.options.path}`);

            if (this.options.flush_on_startup === true) {
                STORAGE.flush(this.path);
            }
            STORAGE.createFolder(this.path);

            if (this.options.load_on_startup === true) {
                this.buildFromStorage();
            }

            LOG(this.label, '>>> READY');
            LOG('');

            resolve(this);
        });
    }

    buildFromStorage() {
        LOG(this.label, 'BUILD FROM STORAGE');
        const schedules = STORAGE.fetch.schedules(this.path);
        if (!schedules) {
            return false;
        }
        schedules.forEach((schedule) => {
            const newSchedule = new Schedule({
                path: this.path,
                options: schedule
            });
            newSchedule.schedules = this;
            this.items.push(newSchedule);
        });
    }

    create(args) {
        return new Promise((resolve, reject) => {
            const newSchedule = new Schedule({
                path: this.path,
                options: args
            });
            newSchedule.schedules = this; // cycling parent
            newSchedule.channel = this.channel;
            this.items.push(newSchedule);
            resolve(newSchedule);
        });
    }

    delete(id) {
        const cron = this.get(id, 'id').cronString;
        this.items = this.items.filter(i => {
            return i.id !== id;
        });
        LOG(this.label, 'DELETED SCHEDULE:', cron, 'ITEMS LEFT:', this.items.length);
    }

    /**
     *
     * @param value
     * @param field
     *
     * possible fields: id, slug, name
     */
    get(match, field) {
        if (!['id', 'name', 'slug'].includes(field))
            return false;

        if (!field) {
            field = 'slug';
        }
        if (typeof field === 'string') {
            return this.items.filter(schedule => {
                if (schedule[field].toLowerCase() === match.toLowerCase()) {
                    return schedule;
                }
            })[0];
        }
        if (typeof field === 'number') {
            return this.items[field];
        }
    };

    exists(options, not) {
        let filtered = this.items;
        if (not) {
            filtered = filtered.filter(i => i.id !== not);
        }
        filtered = filtered.filter(i => {
            return i.options.show_id === options.show_id &&
                i.options.cron['1'] === options.cron['1'] &&
                i.options.cron['2'] === options.cron['2'] &&
                i.options.cron['3'] === options.cron['3'] &&
                i.options.cron['4'] === options.cron['4'] &&
                i.options.cron['5'] === options.cron['5'];

        });
        return filtered.length !== 0;
    }
};
