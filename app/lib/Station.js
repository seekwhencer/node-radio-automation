const
    Module = require('./Module'),
    Storage = require('./Storage'),
    MpdCache = require('./MpdCache'),
    Icecast = require('./Icecast'),
    Shows = require('./Shows'),
    Channels = require('./Channels'),
    Api = require('./Api');


module.exports = class Station extends Module {

    constructor(args) {
        super(args);

        this.name = 'station';
        this.label = 'STATION';

        return new Storage()
            .then(storage => {
                global.STORAGE = storage;
                return new Icecast();
            })
            .then(icecast => {
                global.ICECAST = icecast;
                return new Shows();
            })
            .then(shows => {
                global.SHOWS = shows;
                return new MpdCache;
            })
            .then(mpdcache => {
                global.MPDCACHE = mpdcache;
                return new Channels();
            })
            .then(channels => {
                global.CHANNELS = channels;
                return new Api();
            })
            .then(api => {
                global.API = api;

                LOG('');
                LOG('//////////////////');
                LOG('');
                LOG(this.label, '>>> IS UP AND RUNNING ...');
                LOG('');
                LOG('', 'Icecast on Port:', `${ICECAST.options.config["listen-socket"].port}`);
                LOG('', 'Api on Port:    ', `${API.options.port}`);
                LOG('');
                LOG('', 'Shows:');
                SHOWS.items.forEach((show) => {
                    LOG(' ', '>', show.name, '<', '| Tracks:', '>', show.playlist.items.length, '<');
                });
                LOG('');
                LOG('', 'Channels:');
                CHANNELS.items.forEach((channel) => {
                    LOG(' ', '>', channel.name, '<', '| Mount:', `:${ICECAST.options.config["listen-socket"].port}${channel.mpd.options.config.audio_output.mount}`, '| Show:', '>', channel.show.name, '<', '| Tracks:', '>', channel.show.playlist.items.length, '<');
                });
                LOG('');
                LOG('//////////////////');
                LOG('');
                LOG('');

                return Promise.resolve(this);
            });

    }
};