import RouteSet from '../RouteSet.js';
import * as Routes from './shows/index.js';

export default class extends RouteSet {
    constructor(args) {
        super(args);

        this.label = 'API ROUTE PATH FOR GLOBAL SHOWS';
        this.endpoint = 'shows';
        this.addRoutes(Routes);

        return this.router;
    }
};