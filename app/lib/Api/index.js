const
    http = require('http'),
    Module = require('../Module.js'),
    Auth = require('./Auth.js');


module.exports = class Api extends Module {

    constructor(args) {
        return new Promise((resolve, reject) => {
                super(args);
                this.name = 'api';
                this.label = 'API';

                this.http = null;

                this.mergeOptions();
                LOG(this.label, 'INIT');

                this.on('ready', () => {
                    LOG(this.label, '>>> READY ON PORT', this.port);
                    LOG('');
                    resolve(this);
                });

                // json web token auth
                this.auth = new Auth(this.options.auth);

                APIAPP.use('/station', require('./endpoints/station.js'));
                APIAPP.use('/channels', require('./endpoints/channels.js'));
                APIAPP.use('/channel', require('./endpoints/channel.js'));
                APIAPP.use('/internal', require('./endpoints/internal.js'));
                APIAPP.use('/m3u', require('./endpoints/m3u.js'));

                APIAPP.use((req, res, next) => {
                    const err = new Error('Not Found');
                    err.status = 404;
                    res.json(err);
                });

                this.http = http.createServer(APIAPP);
                this.http.listen(this.port, () => {
                    this.emit('ready');
                });
            }
        );
    };

    mergeOptions() {
        super.mergeOptions();
        this.host = this.options.host;
        this.port = this.options.port;
    }

    shutdown() {
        this.http.close(() => {
            LOG(this.label, 'CLOSED');
        });
    }
    ;
}
;