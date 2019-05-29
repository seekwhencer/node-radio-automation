const
    RouteSet = require('../RouteSet.js');


module.exports = class extends RouteSet {
    constructor() {
        super();

        this.label = 'API ROUTE PATH FOR ONE GLOBAL SHOW';
        this.endpoint = 'show';
        this.addRoutes();

        return this.router;
    }
};