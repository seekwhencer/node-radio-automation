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

        // create a new channel
        this.router.post('/create', (req, res) => {
            const name = req.fields.name;
            if (!name)
                return this.error(`No name given`, res);

            const existingChannel = CHANNELS.get(name, 'name');
            if (existingChannel)
                return this.error(`Channel with name: ${name} exists. No channel created`, res);

            let newChannel = {
                name: name,
                mpd: {
                    config: {
                        port: CHANNELS.getFreeMpdPort(),
                        audio_output: {
                            mount: "/created",
                            port: 8100
                        }
                    }
                }
            };

            const showMatch = req.fields.show;
            if (showMatch) {
                const showField = req.fields.show_match_field || 'id';
                const show = SHOWS.get(showMatch, showField);
                if (!show) {
                    return this.error(`Show not exists. { ${showField}:${showMatch} } No channel created`, res);
                }
                newChannel.show[showField] = showMatch;
            }

            CHANNELS
                .create(newChannel)
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
