const
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

            this.on('updated', () => {
                LOG(this.label, 'UPDATED');
            });

            this.on('connecting', () => {
                this.shutdown();
                setTimeout(() => {
                    this.process.kill();
                    LOG(this.label, '>>> READY');
                    resolve(this);
                }, 1000);
            });
            this.run();
        });
    }

    mergeOptions() {
        super.mergeOptions();
    }

};