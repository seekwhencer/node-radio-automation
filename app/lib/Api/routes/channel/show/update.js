const
    RouteSet = require('../../../RouteSet.js'),
    ShowForm = require('../../../lib/show/form.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        this.showForm = new ShowForm();

        /**
         * update a show from channel
         */
        this.router.post('/:channel/show/update', (req, res) => {
            const channel_id = req.params.channel;
            const channel = CHANNELS.get(channel_id, 'id');
            const show_id = req.fields.id || false;

            if (!channel)
                return this.error('Channel not found', res);

            if (!show_id)
                return this.error('No Show Id given', res);

            const show = channel.shows.get(show_id, 'id');
            if (!show)
                return this.error(`Show with id ${show_id} not exists.`, res);

            const updateOptions = this.showForm.parse(req.fields);

            show
                .update(updateOptions)
                .then(show => {
                    this.success(req, res, 'Show updated', show.options);
                });

        });

        return this.router;
    }
};