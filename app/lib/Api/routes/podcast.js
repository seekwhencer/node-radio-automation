const
    RouteSet = require('../RouteSet.js');


module.exports = class extends RouteSet {
    constructor() {
        super();

        this.label = 'API ROUTE PATH FOR ONE PODCAST';
        this.endpoint = 'podcast';
        this.addRoutes();

        return this.router;
    }
};