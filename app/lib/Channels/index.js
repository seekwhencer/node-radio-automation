const
    fs = require('fs-extra'),
    Module = require('../Module'),
    Channel = require('./Channel');


module.exports = class Channels extends Module {

    constructor(args) {
        return new Promise((resolve, reject) => {

            super(args);
            this.name = 'channels';
            this.label = 'CHANNELS';
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
            } else {
                this.buildFromOptions();
            }
            resolve(this);
        });
    }

    buildFromOptions() {
        LOG(this.label, 'BUILD FROM OPTIONS');
        return this.build(0, this.options.items);
    }

    buildFromStorage() {
        LOG(this.label, 'BUILD FROM STORAGE');
        const channels = STORAGE.fetch.channels(this.path);
        if (channels.length === 0) {
            this.buildFromOptions();
            return false;
        }
        return this.build(0, channels);
    }

    build(index, channels) {
        if (channels.length === index) {
            return Promise.resolve();
        }
        const options = channels[index];
        return new Channel({
            path: this.path,
            options: options
        }).then(channel => {
            this.items.push(channel);
            return this.build(index + 1, channels);
        });
    }
};