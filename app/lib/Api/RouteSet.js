module.exports = class RouteSet {
    constructor() {
        this.router = EXPRESS.Router();

        this.endpoint = 'index';
        this.baseFolder = `${APP_DIR}/lib/Api/routes/${this.endpoint}`;
    }

    one(req, res) {
        const match = req.params[this.param];
        const item = this.source.get(match, 'id');
        return item;
    }

    success(req, res, message, data) {
        res.json({
            message: message,
            ...{data: data}
        });
    }

    error(message, res, data) {
        if (!data)
            data = {};

        res.json({
            error: message,
            ...{data: data}
        });
    }

    get endpoint() {
        return this._endpoint;
    }

    set endpoint(value) {
        this._endpoint = value;
        this.baseFolder = `${APP_DIR}/lib/Api/routes/${this.endpoint}`;
    };


    addRoutes(routePath) {
        if (!routePath)
            routePath = this.baseFolder;

        const routeFiles = RDIRSYNC(routePath, false, ['js']);
        routeFiles.forEach(route => {
            const LoadedRoute = require(route.file_path);
            APIAPP.use(`/${this.endpoint}`, new LoadedRoute());
            LOG(this.label, 'ROUTE ADDED', route.file_path);
        });

        // 2nd level
        const routeFolders = RDIRSYNC(routePath, false, ['js'], true).filter(i => i.foldername);

        if (routeFolders.length === 0)
            return;

        routeFolders.forEach(folder => {
            LOG(this.label, 'ADDING SUB ROUTES IN:', folder.path);
            this.addRoutes(folder.path);
        });
        LOG(this.label, routeFiles.length, 'ADDED ROUTE FILES');
    }


};