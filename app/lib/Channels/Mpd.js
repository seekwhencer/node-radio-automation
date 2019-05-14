const
    fs = require('fs-extra'),
    spawn = require('child_process').spawn,
    Module = require('../Module');


module.exports = class Mpd extends Module {

    constructor(args) {
        super(args);
        this.name = 'mpd';
        this.label = 'MPD';
        this.mergeOptions();
        LOG(this.label, 'INIT', this.name);
        this.process = false;
        this.saveConfig();

        this.on('ready', () => {
            LOG(this.label, 'READY >>>', this.ready);
        });

        this.on('connecting', () => {
            this.emit('ready');
        });

        this.on('data', (chunk) => {
            if (this.options.log_tty) {
                LOG(this.label, this.name, 'TTY', chunk.trim());
            }
        });

        this.on('playing', (chunk) => {
            this.channel.playing = chunk.trim().replace(/player: played /, '').replace(/"/g, '');
            LOG(this.label, this.name, 'PLAYING', this.channel.playing);
        });
    }

    mergeOptions() {
        super.mergeOptions();
        this.options = R.mergeDeepLeft(this.args.options, CONFIG.mpd);
        this.channel = this.args.channel;
        this.id = this.options.id;
        this.name = this.options.name;
        this.slug = this.options.slug;
        this.path = `${this.channel.path}`;
        this.db_path = `${this.path}`;
        this.log_path = `${this.path}`;
        this.pid_path = `${this.path}`;
        this.options.config.playlist_directory = this.channel.path;
        this.options.config.music_directory = P(`${APP_DIR}/${CONFIG.station.path.audio}/${this.options.music_path}`);
        this.options.config.db_file = `${this.db_path}/mpd.cache`;
        this.options.config.pid_file = `${this.pid_path}/mpd.pid`;
        this.options.config.log_file = `${this.log_path}/mpd.log`;
        if (this.options.db_filename) { // if a filename is set, it is a shared database
            this.options.config.db_file = `${STORAGE.path}/mpd_${this.options.db_filename}.cache`;
        }
        this.options.config.audio_output.name = this.name;
        this.options.config.zeroconf_name = this.id;
        this.options.conf_file = `${this.path}/mpd.conf`;
    };

    saveConfig() {
        let conf = '';
        Object.keys(this.options.config).forEach((i) => {
            if (typeof this.options.config[i] === 'string' || typeof this.options.config[i] === 'number') {
                conf += i + ' "' + this.options.config[i] + '"\n';
            }
            if (typeof this.options.config[i] === 'object') {
                conf += i + ' {\n';
                Object.keys(this.options.config[i]).forEach((ii) => {
                    conf += '   ' + ii + ' "' + this.options.config[i][ii] + '"\n';
                });
                conf += '}\n';
            }
        });

        if (CONFIG.station.bluetooth == true) {
            this.options.bluetooth.audio_output.name = 'audio_' + this.id;
            Object.keys(this.options.bluetooth).forEach((i) => {
                if (typeof this.options.bluetooth[i] === 'object') {
                    conf += i + ' {\n';
                    Object.keys(this.options.bluetooth[i]).forEach((ii) => {
                        conf += '   ' + ii + ' "' + this.options.bluetooth[i][ii] + '"\n';
                    });
                    conf += '}\n';
                }
            });
        }

        fs.writeFileSync(this.options.conf_file, conf);
    };

    run(complete_event) {
        const options = [this.options.conf_file, '--no-daemon', '--verbose', /* '--stdout',*/ '--stderr'];
        LOG(this.label, this.name, 'STARTING WITH OPTIONS', JSON.stringify(options));

        const match = {
            updating: new RegExp(/update: starting/),
            updated: new RegExp(/update:\sfinished/),

            collision: new RegExp(/Local name collision/),
            address: new RegExp(/Address already in use/),
            "no-soundcard": new RegExp(/cannot find card/),

            added: new RegExp(/update: added /),
            established: new RegExp(/successfully established/),
            connecting: new RegExp(/Client is CONNECTING/),

            playing: new RegExp(/player: played/),
        };

        this.process = spawn(this.options.bin, options);
        this.process.stderr.setEncoding('utf8');
        this.process.stderr.on('data', (chunk) => {
            this.emit('data', chunk);

            Object.keys(match).forEach((key) => {
                if (match[key].length === undefined) {
                    if (chunk.match(match[key])) {
                        this.emit(key, chunk);
                    }
                } else {
                    match[key].forEach((event) => {
                        if (chunk.match(event)) {
                            this.emit(key, chunk);
                        }
                    });
                }
            });

        });

        this.process.stderr.on('end', function () {

        });
    };

    shutdown() {
        LOG(this.label, 'SHUTTING DOWN');
        const options = [this.options.conf_file, '--kill'];
        spawn(this.options.bin, options);
    };

};