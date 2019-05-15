module.exports = class TopLevelRouteSet {
    constructor() {
        this.router = EXPRESS.Router();

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

        return this.router;
    }
};
