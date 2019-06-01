const
    RouteSet = require('../../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();


        // duplicate
        this.router.post('/duplicate', (req, res) => {
            const name = req.fields.name;
            if (!name)
                return this.error(`No name given`, res);

            const id = req.fields.id;
            if (!id)
                return this.error('No Podcast Id given', res);

            const podcast = PODCASTS.get(id, 'id');
            if (!podcast)
                return this.error(`Podcast with id ${id} not exists.`, res);

            const existingPodcast = PODCASTS.get(name, 'name');
            if (existingPodcast)
                return this.error(`Podcast with name: ${name} exists.`, res);

            let newPodcast = {
                ...podcast.options,
                id: false,
                name: name,
                slug: false,
            };

            PODCASTS
                .create(newPodcast)
                .then(podcast => {
                    this.success(req, res, `New Podcast  ${name} created by duplicating ${podcast.name}`, podcast.options);
                });
        });


        return this.router;
    }
};