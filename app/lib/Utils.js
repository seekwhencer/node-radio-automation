import fs from 'fs-extra';
import path from 'path';

global.P = function (dir) {
    if (dir.substring(0, 1) === '/') {
        return path.resolve(dir);
    } else {
        if (STORAGE.path.substring(0, 1) === '/') {
            return path.resolve(`${STORAGE.path}/${dir}`);
        } else {
            return path.resolve(`${APP_DIR}/${STORAGE.path}/${dir}`);
        }
    }
};

/**
 *
 * @param folder
 * @param recursive
 * @param includes
 * @returns {Array}
 * @constructor
 */
global.RDIRSYNC = function (folder, recursive, includes, withDirs) {
    let data = [];
    const walk = function (folder, recursive) {
        if (fs.existsSync(folder)) {
            const dir = fs.readdirSync(folder + '');

            dir.forEach(function (i) {
                let insert = folder + '/' + i;
                if (fs.existsSync(insert)) {
                    try {
                        const xstat = fs.statSync(insert);
                        if (!xstat.isDirectory()) {
                            let filename = path.basename(insert).replace(path.extname(insert), '');
                            let extension = path.extname(insert).replace('.', '');
                            if (includes.includes(extension)) {
                                data.push({
                                    id: filename,
                                    file_path: insert,
                                    filename: filename,
                                    extension: extension,
                                    size: xstat.size,
                                    atime: 'at' + xstat.atime.getTime(),
                                    mtime: 'mt' + xstat.mtime.getTime(),
                                    ctime: 'ct' + xstat.ctime.getTime()
                                });
                            }
                        } else {
                            if (withDirs) {
                                let foldername = path.basename(insert);
                                data.push({
                                    id: foldername,
                                    path: insert,
                                    foldername: foldername,
                                    atime: 'at' + xstat.atime.getTime(),
                                    mtime: 'mt' + xstat.mtime.getTime(),
                                    ctime: 'ct' + xstat.ctime.getTime()
                                });
                            }
                            if (recursive === true) {
                                walk(folder + '/' + i, recursive);
                            }
                        }
                    } catch (err) {
                        LOG('RDIRSYNC NOT READABLE', insert, err);
                        walk(folder + '/' + i, recursive);
                    }
                } else {
                    LOG('RDIRSYNC NOT EXISTS', insert);
                    walk(folder + '/' + i, recursive);
                }
            });
        } else {
            LOG('RDIRSYNC NOT EXISTS ', folder);
        }
    };
    walk(folder, recursive);
    return data;
};

global.FOLDERSYNC = function (folder) {
    if (fs.existsSync(folder)) {
        const dir = fs.readdirSync(folder);
        return dir;
    }
};

global.SHUFFLE = function (a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

global.RANDOM = function (max, min) {
    if (!min)
        min = 0;

    return Math.floor((Math.random() * max) + min);
};

export default class {
    constructor() {
        this.P = global.P;
        this.RDIRSYNC = RDIRSYNC;
        this.FOLDERSYNC = FOLDERSYNC;
        this.SHUFFLE = SHUFFLE;
        this.RANDOM = RANDOM;
    }
};