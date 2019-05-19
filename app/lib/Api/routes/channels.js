const
    slugify = require('slugify'),
    RouteSet = require('../RouteSet.js');

module.exports = class extends RouteSet {
    constructor() {

        super();

        // get the channel listing
        this.router.get('/', (req, res) => {
            if (!CHANNELS.items) {
                res.json({
                    message: 'no channels found'
                });
                return;
            }
            const channels = CHANNELS.items.map((channel) => {
                return {
                    id: channel.id,
                    name: channel.name,
                    mount: channel.mpd.options.config.audio_output.mount,
                    show: channel.show.name
                };
            });
            res.json(channels);
        });

        /**
         * Create a new Channel
         *
         * possible multipart fields could be:
         *
         *   name                   // must be free. no channel with this name can be exists
         *   show                   // the initial show, if no match field is set, is means the 'id
         *   show_match_field       // possible matchig fields are: 'id','name','slug
         *   mount                  // if not given, the mount point equals the slugified name
         *
         */
        this.router.post('/create', (req, res) => {
            const name = req.fields.name;
            if (!name)
                return this.error(`No name given`, res);

            const existingChannel = CHANNELS.get(name, 'name');
            if (existingChannel)
                return this.error(`Channel with name: ${name} exists. No channel created`, res);

            let mount = req.fields.mount;
            let existingMount = false;
            if (mount) {
                existingMount = CHANNELS.mountExists(mount);
            } else {
                mount = `/${slugify(name, {replacement: '-', lower: true})}`;
                existingMount = CHANNELS.mountExists(mount);
            }

            if (existingMount)
                return this.error(`Channel with mount point: ${mount.toLowerCase()} exists. No channel created`, res);

            let newChannel = {
                name: name,
                mpd: {
                    config: {
                        port: CHANNELS.getFreeMpdPort(),
                        audio_output: {
                            mount: mount.toLowerCase()
                        }
                    }
                }
            };

            const showMatch = req.fields.show;
            if (showMatch) {
                const showField = req.fields.show_match_field || 'id';
                const show = SHOWS.get(showMatch, showField);
                if (!show) {
                    return this.error(`Show not exists. { ${showField}:${showMatch} } No channel created`, res);
                }
                newChannel.show = {};
                newChannel.show[showField] = showMatch;
            }

            CHANNELS
                .create(newChannel)
                .then(channel => {
                    this.success(req, res, 'New Channel created', {
                        id: channel.id,
                        name: channel.name,
                        mount: channel.mpd.options.config.audio_output.mount,
                        ...{options: channel.options}
                    });
                });
        });

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
