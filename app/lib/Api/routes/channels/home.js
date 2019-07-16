import RouteSet from '../../RouteSet.js'

export default class extends RouteSet {
    constructor() {
        super();

        /**
         * get the channel listing
         */

        this.router.get('/', (req, res) => {
            if (!CHANNELS.items) {
                res.json({
                    message: 'no channels found'
                });
                return;
            }
            const channels = CHANNELS.items.map((channel) => {
                return {
                    id: channel.id,
                    name: channel.name,
                    mount: channel.mpd.options.config.audio_output.mount,
                    show: {
                        id: channel.show.id,
                        name: channel.show.name
                    },
                    shows: channel.shows.items.map(i => {
                        return {
                            id: i.id,
                            name: i.name
                        };
                    })
                };
            });
            res.json(channels);
        });


        return this.router;
    }
};