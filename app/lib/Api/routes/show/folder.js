const
    RouteSet = require('../../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        this.router.get('/:show/folder', (req, res) => {
            const show_id = req.params.show;
            const show = SHOWS.get(show_id, 'id');
            if (!show)
                return this.error(`Show not found`, res);

            const folders = FOLDERSYNC( P(`${APP_DIR}/${CONFIG.station.path.audio}/${show.options.path.music}`) );
            res.json(folders);
        });


        return this.router;
    }
};