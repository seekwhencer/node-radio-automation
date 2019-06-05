const
    expressWs = require('express-ws');
    Module = require('../Module.js'),

module.exports = class Websocket extends Module {

    constructor(args) {
        super(args);
        this.router = EXPRESS.Router();
        this.epressWs = expressWs(APIAPP);

        this.router.ws('/echo', (ws, req) => {
            ws.on('message', msg => {
                ws.send(msg);
            });
        });

        APIAPP.use("/com", this.router);



    }
};