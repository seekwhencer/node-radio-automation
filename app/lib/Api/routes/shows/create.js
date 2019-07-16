import RouteSet from '../../RouteSet.js';
import Form from '../../lib/show/form.js';

export default class extends RouteSet {
    constructor() {
        super();

        this.form = new Form();

        /**
         * Create a new Show
         */
        this.router.post('/create', (req, res) => {
            const name = req.fields.name;
            if (!name)
                return this.error(`No name given`, res);

            const existingShow = SHOWS.get(name, 'name');
            if (existingShow)
                return this.error(`Show with name: ${name} exists. No show created`, res);

            const options = this.form.parse(req.fields);
            SHOWS
                .create(options)
                .then(show => {
                    this.success(req, res, 'New Show created', show.options);
                });
        });


        return this.router;
    }
};