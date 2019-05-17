module.exports = class RouteSet {
    constructor() {
        this.router = EXPRESS.Router();
    }

    one(req, res) {
        const match = req.params[this.param];
        const item = this.source.get(match, 'id');
        if (!item) {
            res.json({
                error: `no ${this.param} found`,
                search: {
                    match: match,
                    field: 'id'
                }
            });
            return false;
        }
        return item;
    }

    success(req, res, message, data) {
        res.json({
            message: message,
            ...{data: data}
        });
    }

};