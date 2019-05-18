const
    RouteSet = require('../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        // get the channel listing
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
                    mount: channel.mpd.options.config.audio_output.mount
                };
            });
            res.json(channels);
        });

        // shutdown channel
        this.router.post('/create', (req, res) => {
            const name = req.fields.name;
            if (!name)
                return this.error(`No name given`, res);

            CHANNELS
                .create({
                    name: name,
                    show: {
                        slug: 'lounge'
                    },
                    mpd: {
                        config: {
                            port: 6130,
                            audio_output: {
                                mount: "/created",
                                port: 8100
                            }
                        }
                    }
                })
                .then(channel => {
                    this.success(req, res, 'New Channel created', {
                        id: channel.id,
                        name: channel.name,
                        mount: channel.mpd.options.config.audio_output.mount,
                        ...{options: channel.options}
                    });
                });
        });

        return this.router;
    }
};
