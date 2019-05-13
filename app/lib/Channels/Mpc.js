const
    spawn = require('child_process').spawn,
    Module = require('../Module');


module.exports = class Mpc extends Module {
    constructor(args){
        super(args);
        this.name = 'mpc';
        this.label = 'MPC';
        this.mergeOptions();
        LOG(this.label, 'INIT', this.channel.name);
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

        this.next_query_delay = 0;

        this.ready = true;
    };

    run(){

    }

    updateDatabase() {
        this.query(['update', '--wait']);
    };

    setCrossfade(seconds) {
        this.query(['crossfade', seconds]);
    };

    play(number) {
        let options = ['play'];
        if (number) {
            options = ['play', number]
        }
        this.query(options);
    };

    repeat() {
        this.query(['repeat']);
    };

    pause() {
        this.query(['pause']);
    };
    stop() {
        this.query(['stop']);
    };

    loadPlaylist(playlist) {
        this.query(['load', playlist]);
    };

    status() {
        this.query(['-f', '"%title% - %artist% - %time% - %file%"']);
    };

    crop() {
        this.query(['crop']);
    };
    shuffle() {
        this.query(['shuffle']);
    };
    skip() {
        this.query(['next']);
    };

    updatePlaylist(playlist) {
        LOG(this.label, this.name, 'UPDATE PLAYLIST');
        this.playlist = this.channel.show.id;

        if (!playlist)
            playlist = this.playlist;

        this.crop();
        this.loadPlaylist(playlist);
        this.setCrossfade(8);
        this.play(2);
        this.repeat();
        this.status();
    };

    initPlaylist() {
        LOG(this.label, this.name, 'UPDATE PLAYLIST FIRST TIME');
        this.playlist = this.channel.show.id;
        this.loadPlaylist(this.playlist);
        this.setCrossfade(8);
        this.repeat();
        this.play(1);
        this.status();
    };

    query(query) {
        setTimeout(() => {
            const options = ['-p', this.port, '-h', this.host].concat(query);
            LOG(this.label, this.name, 'QUERYING', options.join(' '));

            this.process = spawn(this.options.bin, options);
            this.process.stdout.setEncoding('utf8');
            this.process.stderr.setEncoding('utf8');

            this.process.stderr.on('data', (chunk) => {
                this.emit('data', chunk, this);
            });

            this.process.stdout.on('data', (chunk) => {
                this.emit('data', chunk, this);
            });

            this.process.stderr.on('end', () => {
                this.emit('exit', this);
            });

            this.next_query_delay = this.next_query_delay - this.options.query_delay;

            if (this.next_query_delay === this.options.query_delay) {
                LOG(this.label, this.name, 'QUEUE END');
            }

        }, this.next_query_delay);
        this.next_query_delay = this.next_query_delay + this.options.query_delay;
    };
};