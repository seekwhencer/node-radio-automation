require('./Utils');

const path = require('path'),
    Config = require('./Config'),
    R = require('ramda'),
    Express = require('express'),
    Log = require('./Log');



/**
 * Defining some global things here:
 */
global.DEBUG = process.env.NODE_DEBUG || true;
if(DEBUG === 'true') global.DEBUG = true;
if(DEBUG === 'false') global.DEBUG = false;

global.LOG = new Log().log;

/**
 * global process events
 */
process.on('uncaughtException', (error) => {
    LOG('ERROR:', error);
});
process.on('SIGINT', function () {

   // some graceful exit code

    setTimeout(function () {
        process.exit(0);
    }, 2000);
});
process.stdin.resume();

/**
 * mapping global things
 */
global.APP_DIR = path.resolve(process.env.PWD);
process.env.NODE_CONFIG_ENV = process.env.NODE_ENV;
process.env.SUPPRESS_NO_CONFIG_WARNING = true;

global.PACKAGE = require(`${APP_DIR}/package.json`);
global.ENV = process.env.NODE_ENV || 'default';

LOG('//////////////////');
LOG('RUNNING:', PACKAGE.name);
LOG('VERSION:', PACKAGE.version);
LOG('ENVIRONMENT:', ENV);
LOG('/////////');
LOG('');

global.CONFIG = new Config();
global.R = R;
global.EXPRESS = Express;
global.APIAPP = EXPRESS();
