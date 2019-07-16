import RouteSet from '../../RouteSet.js';
import * as Routes from './show/index.js';

export default class extends RouteSet {
    constructor(args) {
        super(args);

        this.label = 'API ROUTE PATH FOR ONE SHOW OF A CHANNEL';
        this.endpoint = false;
        this.addRoutes(Routes, this);

        return this.router;
    }
};