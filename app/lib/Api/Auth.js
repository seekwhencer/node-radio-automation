const
    Module = require('../Module.js'),
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken'),
    formidable = require('express-formidable');

module.exports = class Auth extends Module {

    constructor(args) {
        return new Promise((resolve, reject) => {
            super(args);
            this.name = 'auth';
            this.label = 'AUTH';

            this.http = null;
            this.mergeOptions();
            LOG(this.label, 'INIT');

            APIAPP.use(bodyParser.json());
            APIAPP.use(bodyParser.urlencoded({extended: true}));
            APIAPP.use(formidable());

            APIAPP.use((req, res, next) => {

                // public routes without token check
                if (['/login'].includes(req.originalUrl))
                    return next();

                // token check
                const token = req.headers['access-token'];
                if (token) {
                    jwt.verify(token, this.options.secret, (err, decoded) => {
                        if (err) {
                            return res.send('nope');
                        } else {
                            req.decoded = decoded;
                            next();
                        }
                    });
                } else {
                    return res.send('nope');
                }
            });

            // the login page
            APIAPP.post('/login', (req, res) => {
                if (req.fields.username === this.options.username) {
                    if (req.fields.password === this.options.password) {
                        const payload = {
                            check: true
                        };
                        const token = jwt.sign(payload, this.options.secret, {
                            expiresIn: this.options.expires
                        });
                        res.json({
                            message: 'authenticated',
                            token: token
                        });
                    } else {
                        return res.send('nope');
                    }
                } else {
                    return res.send('nope');
                }
            });

            resolve(this);

        });
    }

};