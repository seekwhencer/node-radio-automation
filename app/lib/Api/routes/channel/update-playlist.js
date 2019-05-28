const
    RouteSet = require('../../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        /**
         * update playlist and play
         */
        this.router.get('/:channel/update-playlist', (req, res) => {
            const id = req.params.channel;
            const channel = CHANNELS.get(id, 'id');
            if (!channel)
                return this.error('Channel not found', res);

            channel.updatePlaylist();
            this.success(req, res, `Playlist updated on Channel: ${channel.name} with Show: ${channel.show.name}`);
        });

        return this.router;
    }
};