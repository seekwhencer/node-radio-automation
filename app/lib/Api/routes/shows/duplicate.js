import RouteSet from '../../RouteSet.js';

export default class extends RouteSet {
    constructor() {
        super();


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


        return this.router;
    }
};