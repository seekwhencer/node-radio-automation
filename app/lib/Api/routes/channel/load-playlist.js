import RouteSet from '../../RouteSet.js'

export default class extends RouteSet {
    constructor() {
        super();

        /**
         * load playlist only
         */
        this.router.get('/:channel/load-playlist', (req, res) => {
            const id = req.params.channel;
            const channel = CHANNELS.get(id, 'id');
            if (!channel)
                return this.error('Channel not found', res);

            channel.loadPlaylist();
            this.success(req, res, `Playlist loaded on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        return this.router;
    }
};