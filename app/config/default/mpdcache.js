module.exports = {
    shutdown_time: 30, // false (endless running) or seconds<
    name: 'mpdcacache',
    load_on_startup: true,
    log_tty: true,
    config: { // override the mpd config
        port: 5500
    }
};