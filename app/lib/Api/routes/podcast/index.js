const
    RouteSet = require('../../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        /**
         *  get one podcast
         */
        this.router.get('/:podcast', (req, res) => {
            const podcast_id = req.params.podcast;
            const podcast = PODCASTS.get(podcast_id, 'id');
            if (!podcast)
                return;

            const data = {
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

            res.json(data);
        });


        return this.router;
    }
};