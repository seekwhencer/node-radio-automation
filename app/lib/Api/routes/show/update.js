import RouteSet from '../../RouteSet.js';
import Form from '../../lib/show/form.js';

export default class extends RouteSet {
    constructor() {
        super();

        this.form = new Form();
        /**
         * update one show
         */
        this.router.post('/:show/update', (req, res) => {
            const show_id = req.params.show;

            if (!show_id)
                return this.error('No Show Id given', res);

            const show = SHOWS.get(show_id, 'id');
            if (!show)
                return this.error(`Show not found`, res);

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