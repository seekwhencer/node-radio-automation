const
    RouteSet = require('../../../RouteSet.js'),
    ShowForm = require('../../../lib/show/form.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        this.showForm = new ShowForm();

        /**
         * Create a new Show
         */
        this.router.post('/:channel/show/create', (req, res) => {
            const channel_id = req.params.channel;
            const channel = CHANNELS.get(channel_id, 'id');

            if (!channel)
                return this.error('Channel not found', res);

            const name = req.fields.name;
            if (!name)
                return this.error(`No name given`, res);

            const existingShow = channel.shows.get(name, 'name');
            if (existingShow)
                return this.error(`Show with name: ${name} exists. No show created`, res);

            const options = this.showForm.parse(req.fields);
            channel.shows
                .create(options)
                .then(show => {
                    this.success(req, res, 'New Show created', show.options);
                });
        });


        return this.router;
    }
};