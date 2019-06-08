module.exports = {
    bin: "/usr/bin/mpd",
    start_parameter: [ '--no-daemon', '--verbose', /* '--stdout',*/ '--stderr'],
    log_tty: false,
    ready_delay: 200,
    skip_timeout: 10000,

    debug: {
        stderr: false
    },

    music_path: '',
    db_filename: 'shared',

    config: {
        user: "mk",
        playlist_directory: "",
        music_directory: "",
        db_file: "",
        pid_file: "",
        log_file: "",
        buffer_before_play: "80%",
        audio_buffer_size: 102400,
        port: 6600,
        log_level: "verbose", // secure
        bind_to_address: "0.0.0.0",
        zeroconf_enabled: "yes",
        zeroconf_name: "",
        auto_update: "yes",
        audio_output: {
            type: "shout",
            encoding: "mp3",
            name: "",
            host: "localhost",
            port: 8100,
            mount: "",
            password: "changeme",
            bitrate: 128,
            format: "44100:16:2"
        }
    },
    bluetooth: {
        audio_output: {
            type: "alsa",
            name: "audio out",
            device: "bluetooth",
            format: "44100:16:2",
            driver: "software"
        }
    }
};