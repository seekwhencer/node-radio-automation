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
                    id: podcast.options.id,
                    name: podcast.options.name,
                    slug: podcast.options.slug,
                    url: podcast.options.url,
                    autostart: podcast.options.autostart,
                    limit: podcast.options.limit,
                    cron: podcast.options.cron,
                    cronString: podcast.cronString,
                    next: podcast.nextTime(),
                    timestamp: podcast.nextTimestamp()
                };
            });
            res.json(podcasts);
        });


        return this.router;
    }
};