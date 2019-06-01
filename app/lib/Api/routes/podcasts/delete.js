const
    RouteSet = require('../../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        /**
         * delete a global podcast
         */
        this.router.post('/delete', (req, res) => {
            const id = req.fields.id;
            if (!id)
                return this.error('No Podcast Id given', res);

            const podcast = PODCASTS.get(id, 'id');
            if (!podcast)
                return this.error(`Podcast with id ${id} not exists. No Podcast deleted`, res);

            podcast.delete();
            this.success(req, res, `Podcast ${podcast.name} deleted`, {
                id: podcast.id,
                name: podcast.name
            });
        });


        return this.router;
    }
};