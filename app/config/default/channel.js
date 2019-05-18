module.exports = {
    checkup_delay : 1000,
    name: "Default",
    autostart: true,
    show: {
        slug: 'breaks'
    },
    mpd: {
        config: {
            port: 6110,
            audio_output: {
                mount: "/breaks",
                port: 8100
            }
        }
    }
};