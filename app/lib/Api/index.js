const
    http = require('http'),
    Module = require('../Module.js');


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

            this.app = EXPRESS();

            this.app.use('/internal', require('./endpoints/internal.js'));
            this.app.use('/station', require('./endpoints/station.js'));
            this.app.use('/channel', require('./endpoints/channel.js'));
            this.app.use('/channels', require('./endpoints/channels.js'));
            this.app.use('/m3u', require('./endpoints/m3u.js'));

            this.app.use((req, res, next) => {
                const err = new Error('Not Found');
                err.status = 404;
                res.json(err);
            });

            this.http = http.createServer(this.app);
            this.http.listen(this.port, () => {
                this.emit('ready');
            });
        });
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
    };
};