const
    Form = require('../../lib/podcast/form.js'),
    RouteSet = require('../../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        this.form = new Form();
        /**
         * update one podcast
         */
        this.router.post('/:podcast/update', (req, res) => {
            const podcast_id = req.params.podcast;
            const podcast = PODCASTS.get(podcast_id, 'id');
            if (!podcast)
                return this.error(`Podcast not found`, res);

            const name = req.fields.name;
            if (!name)
                return this.error(`No name given`, res);

            const updateOptions = this.form.parse(req.fields);

            podcast
                .update(updateOptions)
                .then(podcast => {
                    this.success(req, res, 'Podcast updated', podcast.options);
                });
        });


        return this.router;
    }
};