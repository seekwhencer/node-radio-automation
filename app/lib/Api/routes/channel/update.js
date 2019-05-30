const
    RouteSet = require('../../RouteSet.js'),
    Form = require('../../lib/channel/form.js'),
    slugify = require('slugify');

module.exports = class extends RouteSet {
    constructor() {
        super();

        this.form = new Form();

        /**
         * update a channel
         */
        this.router.post('/:channel/update', (req, res) => {
            const id = req.params.channel;
            const channel = CHANNELS.get(id, 'id');
            if (!channel)
                return this.error('Channel not found', res);

            const name = req.fields.name;
            if (!name)
                return this.error(`No name given`, res);

            const existingChannel = CHANNELS.get(name, 'name', channel.id);
            if (existingChannel)
                return this.error(`Channel with name: ${name} exists.`, res);

            let mount = req.fields.mount;
            let existingMount = false;
            if (mount) {
                existingMount = CHANNELS.mountExists(mount, channel.id);
            }

            if (existingMount)
                return this.error(`Channel with mount point: ${mount.toLowerCase()} exists. No channel updated`, res);

            let updateChannel = this.form.parse(req.fields);

            const showMatch = req.fields.show;
            if (showMatch) {
                const showField = req.fields.show_match_field || 'id';
                const show = channel.shows.get(showMatch, showField);
                if (!show)
                    return this.error(`Show not exists. { ${showField}:${showMatch} } No channel updated`, res);

                if (showMatch !== show.id) {
                    updateChannel.show = {};
                    updateChannel.show[showField] = showMatch;
                }
            }
            channel
                .update(updateChannel)
                .then((channel) => {
                    channel.reload();
                    this.success(req, res, `${channel.name} updated.`, updateChannel);
                });

        });

        return this.router;
    }
};