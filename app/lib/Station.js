import Module from './Module.js';
import Storage from './Storage/index.js';
import Podcasts from './Podcasts/index.js';
import MpdCache from './MpdCache.js';
import Icecast from './Icecast/index.js';
import Shows from './Shows/index.js';
import Channels from './Channels/index.js';
import Api from './Api/index.js';

export default class extends Module {

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
                return new Podcasts();
            })
            .then(podcasts => {
                global.PODCASTS = podcasts;
                return new MpdCache;
            })
            .then(mpdcache => {
                global.MPDCACHE = mpdcache;
                return new Shows();
            })
            .then(shows => {
                global.SHOWS = shows;
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
                LOG('', 'Global Shows:');
                SHOWS.items.forEach((show) => {
                    LOG(' ', show.name.padEnd(30), '| Tracks:', show.playlist.items.length);
                });
                LOG('');
                LOG('', 'Channels:');
                CHANNELS.items.forEach((channel) => {
                    const mount = (`${ICECAST.options.config["listen-socket"].port}${channel.mpd.options.config.audio_output.mount}`).padEnd(20);
                    LOG(' ', channel.name.padEnd(30), '| Mount:', `:${mount}`, '| Show:', channel.show.name.padEnd(30), '| Playlist Rows:', channel.show.playlist.items.length);
                });
                LOG('');
                LOG('//////////////////');
                LOG('');
                LOG('');

                return Promise.resolve(this);
            });

    }
};