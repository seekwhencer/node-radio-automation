export default {
    host: 'localhost',
    port: 8200,
    root_endpoint: 'v1',
    auth: {
        secret: 'simsalabim',
        username: 'admin',
        password: 'change!me',
        expires: (1440 * 12), // minutes * hours
        root_endpoint: 'v1',
    },
    websocket: {
        secret: 'simsalabim',
        username: 'admin',
        password: 'change!me',
        expires: (1440 * 12),
        root_endpoint: 'v1',// minutes * hours
    }
};