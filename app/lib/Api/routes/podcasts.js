const
    RouteSet = require('../RouteSet.js');


module.exports = class extends RouteSet {
    constructor() {
        super();

        this.label = 'API ROUTE PATH FOR PODCASTS';
        this.endpoint = 'podcasts';
        this.addRoutes();

        return this.router;
    }
};