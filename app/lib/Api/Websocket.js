import expressWs from 'express-ws';
import jwt from 'jsonwebtoken';
import Module from '../Module.js';

export default class Websocket extends Module {

    constructor(args) {
        super(args);
        this.router = EXPRESS.Router();
        this.epressWs = expressWs(APIAPP, null, {
            wsOptions: {
                verifyClient: (info, cb) => {
                    let token = info.req.headers.authorization;
                    if (!token) {
                        cb(false, 401, 'Unauthorized');
                    } else {
                        if (token.startsWith('Bearer ')) {
                            token = token.slice(7, token.length);
                        }
                        jwt.verify(token, this.options.secret, (err, decoded) => {
                            if (err) {
                                cb(false, 401, 'Unauthorized');
                            } else {
                                info.req.user = decoded;
                                cb(true)
                            }
                        });
                    }
                }
            }
        });

        this.router.ws('/', (ws, req) => {
            ws.on('message', msg => {
                ws.send(msg);
            });
        });

        APIAPP.use("/holodeck", this.router);


    }
};