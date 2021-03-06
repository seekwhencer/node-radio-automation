import Module from '../Module.js';
import Channel from './Channel.js';

export default class Channels extends Module {

    constructor(args) {
        super(args);

        return new Promise((resolve, reject) => {
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

            this.on('ready', () => {
                LOG(this.label, '>>> READY');
                LOG('');
                resolve(this);
            });
            if (this.options.load_on_startup === true) {
                this.buildFromStorage()
                    .then(() => {
                        this.emit('ready');
                    });
            } else {
                this.buildFromOptions()
                    .then(() => {
                        this.emit('ready');
                    });
            }
        });
    }

    buildFromOptions() {
        LOG(this.label, 'BUILD FROM OPTIONS');
        return this.build(0, this.options.items);
    }

    buildFromStorage() {
        LOG(this.label, 'BUILD FROM STORAGE');
        const channels = STORAGE.fetch.channels(this.path);

        if (channels.length === 0 || !channels) {
            return this.buildFromOptions();
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

    get(match, field, not) {
        if (!field) {
            field = 'slug';
        }
        if (typeof field === 'string') {
            return this.items.filter(chanel => {
                if (chanel[field].toLowerCase() === match.toLowerCase()) {
                    if (not === chanel.id) {
                        return false;
                    }
                    return true;
                }
            })[0];
        }
        if (typeof field === 'number') {
            return this.items[field];
        }
    };

    create(args) {
        return new Channel({
            path: this.path,
            options: args
        }).then(channel => {
            this.items.push(channel);
            return Promise.resolve(channel);
        });
    }

    getFreeMpdPort() {
        const ports = this.items.map(i => i.mpd.options.config.port).filter(i => i).sort();
        const arr = ports.slice(0);
        arr.sort((a, b) => a - b);
        const port = arr.reduce((lowest, num, i) => {
            const seqIndex = (i * this.options.mpd_port_step) + this.options.mpd_start_port;
            return num !== seqIndex && seqIndex < lowest ? seqIndex : lowest
        }, (arr.length * this.options.mpd_port_step) + this.options.mpd_start_port);
        LOG(this.label, ' GET FREE MPD PORT', port, ports);
        return port;
    }

    mountExists(mount, not) {
        return this.items
            .filter(i => i.id !== not)
            .map(i => i.mpd.options.config.audio_output.mount.toLowerCase())
            .filter(i => mount.toLowerCase() ? i.toLowerCase() : false)
            .includes(mount.toLowerCase());
    }

    delete(id) {
        const name = this.get(id, 'id').name;
        this.items = this.items.filter(i => {
            return i.id !== id;
        });
        LOG(this.label, 'DELETED CHANNEL', name, this.items.length);
    }

};