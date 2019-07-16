import RouteSet from '../RouteSet.js';
import * as Routes from './podcast/index.js';

export default class extends RouteSet {
    constructor(args) {
        super(args);

        this.label = 'API ROUTE PATH FOR ONE PODCAST';
        this.endpoint = 'podcast';
        this.addRoutes(Routes);

        return this.router;
    }
};