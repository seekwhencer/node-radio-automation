const
    RouteSet = require('../../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        /**
         * delete a global show
         */
        this.router.post('/delete', (req, res) => {
            const id = req.fields.id;
            if (!id)
                return this.error('No Show Id given', res);

            const show = SHOWS.get(id, 'id');
            if (!show)
                return this.error(`Show with id ${id} not exists. No Show deleted`, res);

            show.delete();
            this.success(req, res, `Show ${show.name} deleted`, {
                id: show.id,
                name: show.name
            });
        });


        return this.router;
    }
};