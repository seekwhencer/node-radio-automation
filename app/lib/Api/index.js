const
    http = require('http'),
    bodyParser = require('body-parser'),
    formidable = require('express-formidable'),
    Module = require('../Module.js'),
    Auth = require('./Auth.js'),
    Websocket = require('./Websocket');

module.exports = class Api extends Module {

    constructor(args) {
        super(args);

        return new Promise((resolve, reject) => {
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

                //APIAPP.use(bodyParser.json());
                APIAPP.use(bodyParser.urlencoded({extended: true}));
                APIAPP.use(formidable());

                // @TODO - this is for development.
                APIAPP.use((req, res, next) => {
                    res.header("Access-Control-Allow-Origin", "*");
                    res.header("Access-Control-Allow-Credentials", "true");
                    res.header("Access-Control-Allow-Methods", "GET,POST");
                    res.header("Access-Control-Allow-Headers",  "Origin, X-Requested-With, Content-Type, Accept, Authorization");
                    next();
                });

                // json web token auth
                this.auth = new Auth(this.options.auth);
                this.websocket = new Websocket(this.options.websocket);

                // fontend
                APIAPP.use('/', EXPRESS.static(`${APP_DIR}/../frontend/dist`));

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

    /**
     * this loads the files in lib/Api/routes
     * any filename without extension equals a top level url endpoint
     * any file should or must have a folder on the same level, containing the single actions
     */
    addRoutes() {
        const routeFolder = `${APP_DIR}/lib/Api/routes`;
        const routeFiles = RDIRSYNC(routeFolder, false, ['js']);
        routeFiles.forEach(route => {
            const LoadedRoute = require(route.file_path);
            LOG(this.label, 'ADDING ROUTE', `/${route.filename}`);
            APIAPP.use(`/${route.filename}`, new LoadedRoute());
        });
        LOG(this.label, routeFiles.length, 'ROUTE FILES ADDED');
    }

};