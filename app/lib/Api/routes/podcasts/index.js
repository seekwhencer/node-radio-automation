const
    RouteSet = require('../../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        /**
         * get the global podcast listing
         */
        this.router.get('/', (req, res) => {
            if (!PODCASTS.items) {
                res.json({
                    message: 'no channels found'
                });
                return;
            }
            const podcasts = PODCASTS.items.map((podcast) => {
                return {
                    id: podcast.id,
                    name: podcast.name
                };
            });
            res.json(podcasts);
        });


        return this.router;
    }
};