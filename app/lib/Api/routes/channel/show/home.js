import RouteSet from '../../../RouteSet.js';

export default class extends RouteSet {
    constructor() {
        super();

        /**
         * get playing show from channel
         */
        this.router.get('/:channel/show', (req, res) => {
            const channel_id = req.params.channel;
            const channel = CHANNELS.get(channel_id, 'id');
            if (!channel)
                return this.error('Channel not found', res);

            if (!channel.show)
                return this.error('Channel is playing no Show', res);

            this.success(req, res, `Channel: ${channel.name} playing Show: ${channel.show.name}.`, {
                ...channel.show.options
            });
        });

        /**
         * set playing show from channel
         */
        this.router.post('/:channel/show', (req, res) => {
            const channel_id = req.params.channel;
            const channel = CHANNELS.get(channel_id, 'id');
            const show_id = req.fields.id || false;

            if (!channel)
                return this.error('Channel not found', res);

            if (!show_id)
                return this.error('Show ID not given', res);

            const show = channel.shows.get(show_id, 'id');
            if (!show)
                return this.error('Show not found', res);

            channel.setShow(show.id, 'id');
            channel.updatePlaylist();
            this.success(req, res, `Channel: ${channel.name} got Show: ${channel.show.name} now.`);
        });

        /**
         * get one show from channel
         */
        this.router.get('/:channel/show/:show', (req, res) => {
            const channel_id = req.params.channel;
            const channel = CHANNELS.get(channel_id, 'id');
            if (!channel)
                return this.error('Channel not found', res);

            const show_id = req.params.show || false;
            if (!show_id)
                return this.error('No Show Id given', res);

            const channelShow = channel.shows.get(show_id, 'id');
            if (!channelShow)
                return this.error('Show not found', res);

            res.json(channelShow.options);
        });

        return this.router;
    }
};