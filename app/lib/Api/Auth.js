const
    Module = require('../Module.js'),
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken'),
    formidable = require('express-formidable');

module.exports = class Auth extends Module {

    constructor(args) {
        super(args);
        return new Promise((resolve, reject) => {
            this.name = 'auth';
            this.label = 'AUTH';

            this.http = null;
            this.mergeOptions();
            LOG(this.label, 'INIT');

            let rootEndpoint = '';
            if (this.options.root_endpoint) {
                rootEndpoint = `/${this.options.root_endpoint}`;
            }

            APIAPP.use(new RegExp(`${rootEndpoint}`), (req, res, next) => {
                // skip all non api urls
                if (this.options.root_endpoint) {
                    if (this.options.root_endpoint !== req.originalUrl.split('/')[1]) {
                        return next();
                    }
                    if (['login', 'internal'].includes(req.originalUrl.split('/')[2])) {
                        return next();
                    }
                } else {
                    // public routes without token check
                    if (['', 'login', 'internal', 'js', 'css', 'images'].includes(req.originalUrl.split('/')[1])) {
                        return next();
                    }
                }

                // token check
                let token = req.headers['access-token'] || req.headers['x-access-token'] || req.headers['authorization'];
                if (token) {
                    if (token.startsWith('Bearer ')) {
                        token = token.slice(7, token.length);
                    }
                    jwt.verify(token, this.options.secret, (err, decoded) => {
                        if (err) {
                            return this.sendError('token invalid', res);
                        } else {
                            req.decoded = decoded;
                            req.user = decoded.user;
                            next();
                        }
                    });
                } else {
                    return this.sendError('no token given', res);
                }
            });

            // the login page
            APIAPP.post(`${rootEndpoint}/login`, (req, res) => {
                const username = `${req.fields.username}`;
                const password = `${req.fields.password}`;

                if (username === this.options.username) {
                    if (password === this.options.password) {
                        const payload = {
                            check: true,
                            user: username
                        };
                        const token = jwt.sign(payload, this.options.secret, {
                            expiresIn: this.options.expires
                        });
                        res.json({
                            message: 'authenticated',
                            token: token
                        });
                    } else {
                        return this.sendError('wrong password', res);
                    }
                } else {
                    return this.sendError('wrong username', res);
                }
            });

            // the logout page
            APIAPP.post(`${rootEndpoint}/logout`, (req, res) => {
                res.json({
                    message: 'logged out'
                });
            });

            resolve(this);

        });
    }

    sendError(message, res, data) {
        if (!data)
            data = {};

        res.json({
            error: message,
            ...data
        });
    }

};