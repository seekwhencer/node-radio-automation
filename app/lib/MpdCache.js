/**
 * This is a mpd instance to build the shared mp3 file index database.
 * Shared means that one mpd database is used by all channels - at the moment.
 *
 *
 */

const
    fs = require('fs-extra'),
    Mpd = require('./Channels/Mpd');

module.exports = class MpdCache extends Mpd {

    constructor() {

        const args = {
            options: CONFIG.mpdcache,
            channel: {
                path: STORAGE.path
            }
        };
        super(args);

        return new Promise((resolve, reject) => {

            this.name = 'mpdcache';
            this.label = 'MPDCACHE';
            this.defaults = {};

            this.mergeOptions();
            LOG(this.label, 'INIT', this.name);

            if (this.options.load_on_startup) {
                this.setOptionsFromStorage();
            }

            this.event.removeAllListeners();

            this.on('ready', () => {
                if (this.options.shutdown_time > 0) {
                    setTimeout(() => {
                        this.shutdown();
                    }, this.options.shutdown_time * 1000);
                }
                LOG(this.label, '>>> READY');
                LOG('');
                resolve(this);
            });

            if (fs.existsSync(this.options.config.db_file)) {
                if (ENV !== 'rpi') {
                    this.on('connecting', () => {
                        this.emit('ready');
                    });
                } else {
                    this.on('established', () => {
                        this.emit('ready');
                    });
                }
            } else {
                this.on('updated', () => {
                    LOG(this.label, 'UPDATED');
                    this.emit('ready');
                });
            }
            this.on('data', (chunk) => {
                if (this.options.log_tty) {
                    LOG(this.label, this.name, 'TTY', chunk.trim());
                }
            });

            this.on('end', () => {
                this.shutdown();
            });

            this.save();
            this.run();
        });
    }

    mergeOptions() {
        super.mergeOptions();
        this.path = `${STORAGE.path}`;
        this.options.config.zeroconf_name = this.name;
        this.options.config.pid_file = `${this.pid_path}/${this.name}.pid`;
        this.options.config.log_file = `${this.log_path}/${this.name}.log`;
        this.options.conf_file = `${this.path}/${this.name}.conf`;
        this.options.json_file = `${this.path}/${this.name}.json`;
    }

    save() {
        let save = this.options;
        fs.writeJsonSync(this.options.json_file, save);
        LOG(this.label, 'JSON SAVED', this.options.json_file);
    }

    setOptionsFromStorage() {
        LOG(this.label, 'BUILD FROM STORAGE');
        const options = STORAGE.fetch.one(this.options.json_file);
        if (!options) {
            return false;
        }
        this.args = options; // override the existing options
        this.mergeOptions();
    }
};