const
    RouteSet = require('../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        this.param = 'show';
        this.source = SHOWS;

        // get one show
        this.router.get('/:show', (req, res) => {
            const show = this.one(req, res);
            if (!show)
                return;

            let message = {
                id: show.id,
                name: show.name,
                ...{options: show.options}
            };
            res.json(message);
        });

        return this.router;
    }
};