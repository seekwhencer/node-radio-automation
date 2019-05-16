const
    RouteSet = require('../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

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

        return this.router;
    }
};
