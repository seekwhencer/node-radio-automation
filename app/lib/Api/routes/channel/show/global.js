import RouteSet from '../../../RouteSet.js';

export default class extends RouteSet {
    constructor() {
        super();

        /**
         * copy global show to channel shows
         */
        this.router.post('/:channel/show/global', (req, res) => {
            const channel_id = req.params.channel;
            const channel = CHANNELS.get(channel_id, 'id');
            const show_id = req.fields.id || false;
            let name = req.fields.name || false;

            if (!channel)
                return this.error('Channel not found', res);

            if (!show_id)
                return this.error('Show ID not given', res);

            const globalShow = SHOWS.get(show_id, 'id');
            if (!globalShow)
                return this.error('Show not found', res);

            name = name ? name : globalShow.options.name;

            const existingShowName = channel.shows.get(name, 'name');
            if (existingShowName)
                return this.error(`Show with name ${name} exists `, res);

            channel.shows
                .create({
                    ...globalShow.options,
                    name: name,
                    id: false,
                    slug: false
                })
                .then(show => {
                    this.success(req, res, 'New Show created from global', show.options);
                });
        });

        return this.router;
    }
};