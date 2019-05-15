const
    http = require('http'),
    bodyParser = require('body-parser'),
    formidable = require('express-formidable'),
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

                APIAPP.use(bodyParser.json());
                APIAPP.use(bodyParser.urlencoded({extended: true}));
                APIAPP.use(formidable());

                // json web token auth
                this.auth = new Auth(this.options.auth);

                // autoloads the routes.
                // the filename without extension equals a top level route
                this.addRoutes();

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
    };

    addRoutes() {
        const routeFolder = `${APP_DIR}/lib/Api/routes`;
        const routeFiles = RDIRSYNC(routeFolder, false, ['js']);
        routeFiles.forEach(route => {
            const LoadedRoute = require(route.file_path);
            APIAPP.use(`/${route.filename}`, new LoadedRoute());
            LOG(this.label, 'ROUTE ADDED', `/${route.filename}`);
        });
        LOG(this.label, routeFiles.length, 'ROUTE FILES ADDED');
    }
};