const
    RouteSet = require('../RouteSet.js'),
    Form = require('../lib/show/form.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        this.param = 'show';
        this.source = SHOWS;

        this.form = new Form();

        /**
         *  get one show
         */
        this.router.get('/:show', (req, res) => {
            const show = this.one(req, res);
            if (!show)
                return;

            res.json(show.options);
        });

        /**
         * update one show
         */
        this.router.post('/:show/update', (req, res) => {
            const show = this.one(req, res);
            if (!show)
                return this.error(`Show not found`, res);

            const name = req.fields.name;
            if (!name)
                return this.error(`No name given`, res);

            const updateOptions = this.form.parse(req.fields);

            show
                .update(updateOptions)
                .then(show => {
                    this.success(req, res, 'Show updated', show.options);
                });
        });

        this.router.get('/:show/folder', (req, res) => {
            const show = this.one(req, res);
            if (!show)
                return this.error(`Show not found`, res);

            const folders = FOLDERSYNC( P(`${APP_DIR}/${CONFIG.station.path.audio}/${show.options.path.music}`) );
            res.json(folders);
        });

        return this.router;
    }
};