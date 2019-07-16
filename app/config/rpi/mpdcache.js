export default {
    shutdown_time: false, // false (endless running) or seconds<
    start_parameter: [ '--no-daemon', '--verbose', '--stderr'],
    name: 'mpdcache',
    load_on_startup: true,
    log_tty: false,
    config: { // override the mpd config
        port: 5500
    }
};