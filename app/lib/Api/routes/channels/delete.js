const
    RouteSet = require('../../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {
        super();

        /**
         *  delete channel
         *
         *  wants the id
         */
        this.router.post('/delete', (req, res) => {
            const id = req.fields.id;
            if (!id)
                return this.error('No Channel Id given', res);

            const channel = CHANNELS.get(id, 'id');
            if (!channel)
                return this.error(`Channel with id ${id} not exists. No channel deleted`, res);

            channel.delete();
            this.success(req, res, `Channel ${channel.name} deleted`, {
                id: channel.id,
                name: channel.name,
                mount: channel.mpd.options.config.audio_output.mount
            });
        });

        return this.router;
    }
};