const
    fs = require('fs-extra'),
    Module = require('../Module');

module.exports = class Playlist extends Module {

    constructor(args) {
        super(args);

        this.name = 'playlist';
        this.label = 'PLAYLIST';
        this.mergeOptions();
        LOG(this.label, 'INIT', this.show.name);

        this.items = [];
        this.playlist = null;
        this.music = null;
        this.podcast = null;
        this.intro = null;
        this.spot = null;

        this.build();
    }

    mergeOptions() {
        super.mergeOptions();
        this.show = this.args.show;
    }

    getFiles() {
        const showOptions = this.show.options;
        this.music = STORAGE.fetch.audio(showOptions.music.path, showOptions.music.recursive);
        this.podcast = STORAGE.fetch.audio(showOptions.podcast.path, showOptions.podcast.recursive);
        this.intro = STORAGE.fetch.audio(showOptions.intro.path, showOptions.intro.recursive);
        this.spot = STORAGE.fetch.audio(showOptions.spot.path, showOptions.spot.recursive);
    };

    build() {
        LOG(this.label, 'BUILDING', this.show.id);
        this.getFiles();
        this.addMusic();
        this.addHotRotation();
        this.addPodcast();
        this.addSpot();
        this.addIntro();
        this.buildM3U();
        LOG(this.label, 'BUILD:', this.items.length, 'COMPLETE');
    };

    buildM3U() {
        this.playlist = '';
        if (this.items.length === 0) {
            LOG(this.label, 'NO AUDIO FILES GIVEN');
            return;
        }
        this.playlist = '';
        this.items.forEach(i => {
            if (i)
                if (i.file_path)
                    this.playlist += i.file_path + '\n';
        });
    };

    generate() {
        LOG(this.label, 'GENERATING', this.show.name);
        this.build();
        this.save();
    };

    save() {
        LOG(this.label, 'SAVING', this.options.playlist_path);
        fs.writeFileSync(this.options.playlist_path, this.playlist);
        this.emit('saved-playlist', this.playlist);
    };

    insertNth(add, nth, offset) {
        let build = [];
        if (!offset)
            offset = 0;

        let i = 0, c = 0;
        this.items.forEach(d => {
            if ((c === nth - 1 || i === offset - 1) && i >= offset - 1) {
                //const insert = add[_.random(add.length - 1)];
                const insert = add[RANDOM(add.length - 1)];
                build.push(insert);
                c = 0;
            }
            c++;
            build.push(d);
            i++;
        });
        this.items = build;
    };

    addMusic() {
        let opts = this.show.options.music;
        if (opts.enable !== true)
            return;
        this.music = this.order(this.music, opts.order_by, opts.order_direction);
        this.items = this.music;
    };

    addHotRotation() {
        let opts = this.show.options.hot_rotation;
        if (opts.enable !== true)
            return;

        let data = [];
        let source = this.order(this.music, opts.order_by, opts.order_direction);

        if (opts.latest_tracks > 0) {
            source = source.slice(0, opts.latest_tracks);
        }

        if (opts.age_days > 0) {
            let edge = parseInt((Date.now() / 1000) - parseInt(opts.age_days * 24 * 60 * 60));
            let days = source.filter(function (i) {
                let timestamp = parseInt(i.mtime.replace('mt', '') / 1000);
                if (timestamp < edge) {
                    return i;
                }
            });
            source = days;
        }

        for (let i = 0; i < opts.multiplier; i++) {
            data = data.concat(source);
        }

        this.items = this.items.concat(data);
        this.items = SHUFFLE(this.items);
    };

    addPodcast() {
        let opts = this.show.options.podcast;
        if (opts.enable !== true)
            return;
    };

    addSpot() {
        let opts = this.show.options.spot;
        if (opts.enable !== true)
            return;

        this.insertNth(this.spot, opts.nth, opts.offset);
    };

    addIntro() {
        let opts = this.show.options.spot;
        if (opts.enable !== true)
            return;

        let rand = RANDOM(this.intro.length - 1);
        let insert = this.intro[rand];
        let build = [insert].concat(this.items);
        this.items = build;
    };

    order(arr, order_by, order_direction) {
        let data = arr;
        if (order_by === 'shuffle') {
            data = SHUFFLE(arr);
        }
        if (order_by === 'time') {
            data = R.sortBy(R.compose(R.toLower, R.prop('mtime')))(data);
        }
        if (order_by === 'name') {
            data = R.sortBy(R.compose(R.toLower, R.prop('filename')))(data);
        }
        if (order_direction === 'asc') {
            data = R.reverse(data);
        }
        return data;
    };

    get show() {
        return this._show;
    }

    set show(show) {
        this._show = show;
        if (this.show.channel) {
            this.channel = this.show.channel;
            this.options.playlist_path = P(`${this.channel.mpd.options.config.playlist_directory}/${this.show.id}.m3u`);
            this.generate();
        }
    }

};