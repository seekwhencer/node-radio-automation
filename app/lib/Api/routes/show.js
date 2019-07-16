import RouteSet from '../RouteSet.js';
import * as Routes from './show/index.js';

export default class extends RouteSet {
    constructor(args) {
        super(args);

        this.label = 'API ROUTE PATH FOR ONE GLOBAL SHOW';
        this.endpoint = 'show';
        this.addRoutes(Routes);

        return this.router;
    }
};