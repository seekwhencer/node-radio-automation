const
    RouteSet = require('../RouteSet.js');


module.exports = class extends RouteSet {
    constructor() {
        super();

        this.label = 'API ROUTE PATH FOR CHANNELS';
        this.endpoint = 'channels';
        this.addRoutes();

        return this.router;
    }
};
