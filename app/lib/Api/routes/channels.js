import RouteSet from '../RouteSet.js';
import * as Routes from './channels/index.js';

export default class extends RouteSet {
    constructor(args) {
        super(args);

        this.label = 'API ROUTE PATH FOR CHANNELS';
        this.endpoint = 'channels';
        this.addRoutes(Routes);

        return this.router;
    }
};
