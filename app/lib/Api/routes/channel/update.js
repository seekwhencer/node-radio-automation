import RouteSet from '../../RouteSet.js'
import Form from '../../lib/channel/form.js';

export default class extends RouteSet {
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
            if (name) {
                const existingChannel = CHANNELS.get(channel.id, 'id', channel.id);
                if (existingChannel)
                    return this.error(`Channel with name: ${name} exists.`, res);
            }
            let mount = req.fields.mount;
            if (mount) {
                if (CHANNELS.mountExists(mount, channel.id))
                    return this.error(`Channel with mount point: ${mount.toLowerCase()} exists. No channel updated`, res);
            }

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