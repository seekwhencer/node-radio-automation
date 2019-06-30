module.exports = {
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
        }
    ]
};