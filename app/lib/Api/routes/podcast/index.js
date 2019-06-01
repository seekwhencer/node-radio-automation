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

            res.json(podcast.options);
        });


        return this.router;
    }
};