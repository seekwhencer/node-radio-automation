export default {
    path: 'channels',
    flush_on_startup: false,
    load_on_startup: true,
    mpd_start_port: 6100,
    mpd_port_step: 10,

    items: [
        {
            name: "Breaks",
            autostart: true,
            show: {
                slug: 'breaks'
            },
            mpd: {
                config: {
                    port: 6100,
                    audio_output: {
                        mount: "/breaks",
                        port: 8100
                    }
                }
            }
        },

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
    ]
};