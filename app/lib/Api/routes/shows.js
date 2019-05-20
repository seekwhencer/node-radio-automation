const
    RouteSet = require('../RouteSet.js'),
    Form = require('../lib/show/form.js');


module.exports = class extends RouteSet {
    constructor() {
        super();

        this.form = new Form();

        // get the show listing
        this.router.get('/', (req, res) => {
            if (!SHOWS.items) {
                res.json({
                    message: 'no channels found'
                });
                return;
            }
            const shows = SHOWS.items.map((show) => {
                return {
                    id: show.id,
                    name: show.name
                };
            });
            res.json(shows);
        });

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

        // duplicate
        this.router.post('/duplicate', (req, res) => {
            const name = req.fields.name;
            if (!name)
                return this.error(`No name given`, res);

            const id = req.fields.id;
            if (!id)
                return this.error('No Show Id given', res);

            const show = SHOWS.get(id, 'id');
            if (!show)
                return this.error(`Show with id ${id} not exists.`, res);

            const existingShow = SHOWS.get(name, 'name');
            if (existingShow)
                return this.error(`Show with name: ${name} exists.`, res);

            let newShow = {
                ...show.options,
                id: false,
                name: name,
                slug: false,
            };

            SHOWS
                .create(newShow)
                .then(show => {
                    this.success(req, res, `New Show  ${name} created by duplicating ${show.name}`, show.options);
                });
        });

        this.router.post('/delete', (req, res) => {
            const id = req.fields.id;
            if (!id)
                return this.error('No Show Id given', res);

            const show = SHOWS.get(id, 'id');
            if (!show)
                return this.error(`Show with id ${id} not exists. No Show deleted`, res);

            show.delete();
            this.success(req, res, `Show ${show.name} deleted`, {
                id: show.id,
                name: show.name
            });
        });

        return this.router;
    }
};
