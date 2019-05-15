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

        new Storage()
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
            });

    }



};