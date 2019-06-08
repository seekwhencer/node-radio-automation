module.exports = {
    host: 'localhost',
    port: 8200,
    auth: {
        secret: 'simsalabim',
        username: 'admin',
        password: 'change!me',
        expires: (1440 * 12) // minutes * hours
    },
    websocket: {
        secret: 'simsalabim',
        username: 'admin',
        password: 'change!me',
        expires: (1440 * 12) // minutes * hours
    }
};