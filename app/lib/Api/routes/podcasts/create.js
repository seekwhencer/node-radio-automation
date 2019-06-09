const
    RouteSet = require('../../RouteSet.js'),
    Form = require('../../lib/podcast/form.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        this.form = new Form();

        /**
         * Create a new Podcast
         */
        this.router.post('/create', (req, res) => {
            const name = req.fields.name;
            if (!name)
                return this.error(`No name given`, res);

            const existingPodcast = PODCASTS.get(name, 'name');
            if (existingPodcast)
                return this.error(`Podcast with name: ${name} exists. No podcast created`, res);

            const options = this.form.parse(req.fields);

            if (!this.form.checkCron(options.cron))
                return this.error(`ERROR CRON JOB FORMAT.`, res);

            PODCASTS
                .create(options)
                .then(podcast => {
                    this.success(req, res, 'New Podcast created', podcast.options);
                });
        });


        return this.router;
    }
};