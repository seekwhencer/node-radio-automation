import RouteSet from '../../RouteSet.js';
import Form from '../../lib/podcast/form.js';

export default class extends RouteSet {
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

            const updateOptions = this.form.parse(req.fields);

            if (!this.form.checkCron(updateOptions.cron))
                return this.error(`ERROR CRON JOB FORMAT.`, res);

            podcast
                .update(updateOptions)
                .then(podcast => {
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

                    this.success(req, res, 'Podcast updated', data);
                });
        });


        return this.router;
    }
};