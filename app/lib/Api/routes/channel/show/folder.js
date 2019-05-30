const
    RouteSet = require('../../../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        this.router.get('/:channel/show/:show/folder', (req, res) => {
            const channel_id = req.params.channel;
            const channel = CHANNELS.get(channel_id, 'id');
            const show_id = req.params.show || false;

            if (!channel)
                return this.error('Channel not found', res);

            if (!show_id)
                return this.error('No Show Id given', res);

            const show = channel.shows.get(show_id, 'id');
            if (!show)
                return this.error(`Show with id ${id} not exists.`, res);

            let folders = FOLDERSYNC(P(`${APP_DIR}/${CONFIG.station.path.audio}`));

            let ii = {};
            folders.forEach(i => {
                ii[i] = P(`${APP_DIR}/${CONFIG.station.path.audio}/${i}`);
            });
            res.json(ii);
        });

        this.router.get('/:channel/show/:show/folder/:folder', (req, res) => {
            const channel_id = req.params.channel;
            const channel = CHANNELS.get(channel_id, 'id');
            const show_id = req.params.show || false;

            if (!channel)
                return this.error('Channel not found', res);

            if (!show_id)
                return this.error('No Show Id given', res);

            const show = channel.shows.get(show_id, 'id');
            if (!show)
                return this.error(`Show with id ${id} not exists.`, res);

            const folder = req.params.folder;
            if (!['music', 'intro', 'spot', 'podcast'].includes(folder))
                return this.error(`Wrong folder type given`, res);

            const folders = FOLDERSYNC(P(`${APP_DIR}/${CONFIG.station.path.audio}/${folder}`));

            if (!folders)
                return this.error(`No folder found`, res);

            let ii = {};
            folders.forEach(i => {
                ii[i] = P(`${APP_DIR}/${CONFIG.station.path.audio}/${folder}/${i}`);
            });
            res.json(ii);
        });

        return this.router;
    }
};