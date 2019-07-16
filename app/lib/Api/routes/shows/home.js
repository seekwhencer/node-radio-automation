import RouteSet from '../../RouteSet.js';

export default class extends RouteSet {
    constructor() {
        super();

        /**
         * get the global show listing
         */
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


        return this.router;
    }
};