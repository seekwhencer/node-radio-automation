import RouteSet from '../../RouteSet.js';

export default class extends RouteSet {
    constructor() {
        super();

        /**
         *  get one show
         */
        this.router.get('/:show', (req, res) => {
            const show_id = req.params.show;
            const show = SHOWS.get(show_id, 'id');
            if (!show)
                return;

            res.json(show.options);
        });


        return this.router;
    }
};