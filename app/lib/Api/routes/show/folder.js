import RouteSet from '../../RouteSet.js';

export default class extends RouteSet {
    constructor() {
        super();

        this.router.get('/:show/folder', (req, res) => {
            const show_id = req.params.show;
            const show = SHOWS.get(show_id, 'id');
            if (!show)
                return this.error(`Show not found`, res);

            let folders = FOLDERSYNC(P(`${APP_DIR}/${CONFIG.station.path.audio}`));

            let ii = {};
            folders.forEach(i => {
                ii[i] = P(`${APP_DIR}/${CONFIG.station.path.audio}/${i}`);
            });
            res.json(ii);
        });

        this.router.get('/:show/folder/:folder', (req, res) => {
            const folder = req.params.folder;
            if (!['music', 'intro', 'spot', 'podcast'].includes(folder))
                return this.error(`Wrong folder type given`, res);

            const show_id = req.params.show;
            const show = SHOWS.get(show_id, 'id');
            if (!show)
                return this.error(`Show not found`, res);

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