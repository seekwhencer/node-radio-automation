import Utils from './Utils.js';
import path from 'path';
import R from 'ramda';
import Express from 'express';
import Log from './Log.js';
import Config from './Config.js';
import Package from '../package.json';

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

global.PACKAGE = Package;
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

export default class {
    constructor(){
        this.ENV = ENV;
        this.APP_DIR = APP_DIR;
        this.PACKAGE = PACKAGE;
        this.CONFIG = CONFIG;
        this.LOG = LOG;
        this.DEBUG = DEBUG;
        this.R = R;
        this.EXPRESS = EXPRESS;
        this.APIAPP = APIAPP;
    }
}