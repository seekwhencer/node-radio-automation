export default class RouteSet {
    constructor(parent) {
        this.parent = parent || false;
        this.router = EXPRESS.Router();
        this.endpoint = '';
        this.url = '';
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
    };

    addRoutes(Routes) {
        LOG('>>>>> ROUTES FOR:', this.endpoint, Object.keys(Routes).length, typeof this.parent);

        if (!this.parent) {
            if (CONFIG.api.root_endpoint) {
                this.url = `/${CONFIG.api.root_endpoint}`;
            }
            LOG('>>> WITHOUT PARENT:', this.url);
        } else {
            this.url = `${this.parent.url}`;
            if (this.endpoint) {
                this.url += `/${this.endpoint}`;
            }
            LOG('>>> WITH PARENT:', this.parent.endpoint, this.url);
        }

        Object.keys(Routes).forEach(r => {
            const router = new Routes[r](this);
            const rx = router.stack
                .filter(r => r.route)
                .map(r => `${this.url}${r.route.path}`);

            APIAPP.endpoints = APIAPP.endpoints.concat(rx);
            APIAPP.use(this.url, router);
        });
    };
};