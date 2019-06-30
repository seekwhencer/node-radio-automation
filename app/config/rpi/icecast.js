module.exports = {
    name: "radio",
    bin: "/usr/bin/icecast2",

    path: 'icecast',
    flush_on_startup: false,
    load_on_startup: true,

    autostart: true,
    checkup_delay: 500,
    status_delay: 500,
    run: '',
    status_endpoint: 'status-json.xsl',

    paths: {
        config: "icecast",
        logdir: "log",
        basedir: "/usr/share/icecast2",
        webroot: "/usr/share/icecast2/web",
        adminroot: "/usr/share/icecast2/admin",
    },

    config: {
        location: "Home",
        hostname: "localhost",
        admin: "",
        limits: {
            clients: 100,
            sources: 10,
            threadpool: 20,
            "queue-size": 524288,
            "client-timeout": 60,
            "header-timeout": 30,
            "source-timeout": 60,
            "burst-on-connect": 1,
            "burst-size": 65535
        },
        authentication: {
            "source-password": "changeme",
            "relay-password": "changeme",
            "admin-user": "admin",
            "admin-password": "changeme"
        },
        "listen-socket": {
            port: 8100
        },
        fileserve: 1,
        paths: {
            basedir: "",
            logdir: "",
            webroot: "",
            adminroot: "",
            alias: [
                {source: "/"},
                {destination: "/status.xsl"}
            ]
        },
        logging: {
            accesslog: "icecast_access.log",
            errorlog: "icecast_error.log",
            loglevel: 4,
            logsize: 10000,
        },
        security: {
            chroot: 0
        }
    }
};