const
    Form = require('../../lib/show/form.js'),
    RouteSet = require('../../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        this.form = new Form();
        /**
         * update one show
         */
        this.router.post('/:show/update', (req, res) => {
            const show_id = req.params.show;
            const show = SHOWS.get(show_id, 'id');
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


        return this.router;
    }
};