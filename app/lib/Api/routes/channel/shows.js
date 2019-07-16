import RouteSet from '../../RouteSet.js'

export default class extends RouteSet {
    constructor() {
        super();

        /**
         * get all shows from channel
         */
        this.router.get('/:channel/shows', (req, res) => {
            const channel_id = req.params.channel;
            const channel = CHANNELS.get(channel_id, 'id');
            if (!channel)
                return this.error('Channel not found', res);

            if (!channel.shows.items) {
                if (!channel)
                    return this.error('Channel has no shows', res);
            }
            const shows = channel.shows.items.map((show) => {
                return {
                    id: show.id,
                    name: show.name
                };
            });
            res.json(shows);
        });

        return this.router;
    }
};