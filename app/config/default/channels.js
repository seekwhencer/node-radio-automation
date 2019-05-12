module.exports = {
    path: 'channels',
    flush_on_startup: false,
    load_on_startup: true,

    items: [
        {
            name: "Lounge",
            autostart: true,
            show: {
                slug: 'lounge'
            },
            mpd: {
                config: {
                    port: 6110,
                    audio_output: {
                        mount: "/lounge",
                        port: 8100
                    }
                }
            }
        },
        {
            name: "Breaks",
            autostart: true,
            show: {
                slug: 'breaks'
            },
            mpd: {
                config: {
                    port: 6120,
                    audio_output: {
                        mount: "/breaks",
                        port: 8100
                    }
                }
            }
        }
    ]
};