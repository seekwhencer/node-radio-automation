const
    spawn = require('child_process').spawn,
    Module = require('../Module');


module.exports = class Mpc extends Module {
    constructor(args) {
        super(args);
        this.name = 'mpc';
        this.label = 'MPC';
        this.mergeOptions();
        LOG(this.label, 'INIT', this.channel.name);

        this.queueIndex = 0;

        this.on('status', (chunk) => {
            const chunkArr = chunk.split("\n");
            const status = chunkArr[0].replace(/ -  - /g, '').replace(/"/g, '').split(/ - /);
            this.status = {
                seek: status[0],
                filename: status[1]
            };
            LOG(this.label, this.name, 'GOT STATUS', this.status);
        });
        this.ready = true;
    }

    mergeOptions() {
        super.mergeOptions();

        if (this.args.channel) {
            this.channel = this.args.channel;
        }
        this.options = R.mergeDeepLeft(this.args.options, CONFIG.mpc);

        this.id = this.options.id;
        this.name = this.options.name;
        this.host = this.options.host || this.options.config.host;
        this.port = this.options.port || this.options.config.port;
    };

    run() {

    }

    updateDatabase() {
        this.queue(['update', '--wait']).resetQueue();
    };

    setCrossfade(seconds) {
        this.queue(['crossfade', seconds]).resetQueue();
    };

    play(number) {
        let options = ['play'];
        if (number) {
            options = ['play', number]
        }
        this.queue(options).resetQueue();
    };

    repeat() {
        this.queue(['repeat']).resetQueue();
    };

    pause() {
        this.queue(['pause']).resetQueue();
    };

    stop() {
        this.queue(['stop']).resetQueue();
    };

    loadPlaylist(playlist) {
        this.queue(['load', playlist]).resetQueue();
    };

    status() {
        this.query(['-f', '"%title% - %artist% - %time% - %file%"']);
    };

    crop() {
        this.queue(['crop']).resetQueue();
    };

    shuffle() {
        this.queue(['shuffle']).resetQueue();
    };

    skip() {
        this.queue(['next']).resetQueue();
    };

    updatePlaylist(playlist) {
        LOG(this.label, this.name, 'UPDATE PLAYLIST');
        this.channel.show.playlist.generate();
        this.playlist = this.channel.show.id;

        if (!playlist)
            playlist = this.playlist;

        this.crop();
        this.loadPlaylist(playlist);
        this.setCrossfade(8);
        this.play(2);
        this.repeat();
        this.resetQueue();
    };

    initPlaylist() {
        LOG(this.label, this.name, 'UPDATE PLAYLIST FIRST TIME');
        this.playlist = this.channel.show.id;
        this.loadPlaylist(this.playlist);
        this.setCrossfade(8);
        this.repeat();
        this.play(1);
        this.resetQueue();
    };

    query(query) {
        const options = ['-p', this.port, '-h', this.host].concat(query);
        LOG(this.label, this.name, 'QUERYING', options.join(' '));

        this.process = spawn(this.options.bin, options);
        this.process.stdout.setEncoding('utf8');
        this.process.stdout.on('data', (chunk) => {
            //LOG(this.label, 'STDOUT TTY', chunk.trim());
            const match = {
                status: new RegExp(/-  -/)
            };
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
            this.emit('data', chunk, this);
        });
        this.process.stderr.on('end', () => {
            this.emit('exit', this);
        });
    };

    queue(query) {
        setTimeout(() => {
            this.query(query);
            this.queueIndex = this.queueIndex+1;
        }, this.queueIndex * this.options.query_delay);
        return this;
    }

    resetQueue(){
        this.queueIndex = 0;
    }
};