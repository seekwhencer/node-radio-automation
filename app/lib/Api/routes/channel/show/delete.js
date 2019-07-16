import RouteSet from '../../../RouteSet.js';

export default class extends RouteSet {
    constructor() {
        super();

        /**
         * delete a show from channel
         */
        this.router.post('/:channel/show/delete', (req, res) => {
            const channel_id = req.params.channel;
            const channel = CHANNELS.get(channel_id, 'id');
            const show_id = req.fields.id || false;

            if (!channel)
                return this.error('Channel not found', res);

            if (!show_id)
                return this.error('No Show Id given', res);

            const show = channel.shows.get(show_id, 'id');
            if (!show)
                return this.error(`Show with id ${id} not exists. No Show deleted`, res);

            show.delete();
            this.success(req, res, `Show ${show.name} deleted`, {
                id: show.id,
                name: show.name
            });
        });

        return this.router;
    }
};