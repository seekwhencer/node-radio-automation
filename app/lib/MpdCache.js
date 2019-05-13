const
    Event = require('events'),
    Mpd = require('./Channels/Mpd');

module.exports = class MpdCache extends Mpd {

    constructor() {
        return new Promise((resolve, reject) => {

            const args = {
                options: {
                    name: 'mpdcacache',
                    mpd: {
                        config: {}
                    }
                },
                channel: {
                    path: STORAGE.path
                }
            };

            super(args);
            this.name = 'mpd';
            this.label = 'MPDCACHE';
            this.defaults = {};
            this.mergeOptions();
            LOG(this.label, 'INIT', this.name);

            this.event.removeAllListeners();

            this.on('ready', () => {
                setTimeout(() => {
                    this.shutdown();
                }, this.options.shutdown_time);

                LOG(this.label, '>>> READY');
                LOG('');
                resolve(this);
            });

            this.on('updated', () => {
                LOG(this.label, 'UPDATED');
                this.emit('ready');
            });

            this.run();
        });
    }

    mergeOptions() {
        super.mergeOptions();
        this.options.config.pid_file = `${this.pid_path}/mpd_shared.pid`;
        this.options.config.log_file = `${this.log_path}/mpd_shared.log`;
        this.options.conf_file = `${this.path}/mpd_shared.conf`;
    }
};