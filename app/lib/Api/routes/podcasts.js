import RouteSet from '../RouteSet.js';
import * as Routes from './podcasts/index.js';

export default class extends RouteSet {
    constructor(args) {
        super(args);

        this.label = 'API ROUTE PATH FOR PODCASTS';
        this.endpoint = 'podcasts';
        this.addRoutes(Routes);

        return this.router;
    }
};