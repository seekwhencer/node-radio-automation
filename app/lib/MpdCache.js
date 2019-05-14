/**
 * This is a mpd instance to build the shared mp3 file index database.
 * Shared means that one mpd database is used by all channels - at the moment.
 *
 *
 */

const
    Mpd = require('./Channels/Mpd');

module.exports = class MpdCache extends Mpd {

    constructor() {
        return new Promise((resolve, reject) => {

            const args = {
                options: CONFIG.mpdcache,
                channel: {
                    path: STORAGE.path
                }
            };

            super(args);
            this.name = 'mpdcache';
            this.label = 'MPDCACHE';
            this.defaults = {};

            LOG(this.label, 'INIT', this.name);

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

            this.on('updated', () => {
                LOG(this.label, 'UPDATED');
                this.emit('ready');
            });

            this.on('end', () => {
                this.shutdown();
            });

            this.run();
        });
    }

    mergeOptions() {
        super.mergeOptions();
        this.options.config.zeroconf_name = this.name;
        this.options.config.pid_file = `${this.pid_path}/mpd_shared.pid`;
        this.options.config.log_file = `${this.log_path}/mpd_shared.log`;
        this.options.conf_file = `${this.path}/mpd_shared.conf`;
    }
};