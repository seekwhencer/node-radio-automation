const
    RouteSet = require('../../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        this.router.get('/:podcast/folder', (req, res) => {
            const podcast_id = req.params.podcast;
            const podcast = PODCASTS.get(podcast_id, 'id');
            if (!podcast)
                return this.error(`Podcast not found`, res);

            let folders = FOLDERSYNC(P(`${APP_DIR}/${CONFIG.station.path.audio}`));

            let ii = {};
            folders.forEach(i => {
                ii[i] = P(`${APP_DIR}/${CONFIG.station.path.audio}/${i}`);
            });
            res.json(ii);
        });

        this.router.get('/:podcast/folder/:folder', (req, res) => {
            const folder = req.params.folder;
            if (!['music', 'intro', 'spot', 'podcast'].includes(folder))
                return this.error(`Wrong folder type given`, res);

            const podcast_id = req.params.podcast;
            const podcast = PODCASTS.get(podcast_id, 'id');
            if (!podcast)
                return this.error(`Podcast not found`, res);

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