const
    path = require('path'),
    fs = require('fs-extra');

global.P = function(dir){
    if(dir.substring(0, 1) === '/'){
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
 * @param excludes
 * @returns {Array}
 * @constructor
 */
global.RDIRSYNC = function (folder, recursive, includes, excludes) {
    var data = [];
    var walk = function (folder, recursive) {
        if (fs.existsSync(folder)) {
            var dir = fs.readdirSync(folder + '');

            dir.forEach(function (i) {
                var insert = folder + '/' + i;
                if (fs.existsSync(insert)) {
                    try {
                        var xstat = fs.statSync(insert);
                        if (!xstat.isDirectory()) {
                            var filename = path.basename(insert).replace(path.extname(insert), '');
                            var extension = path.extname(insert).replace('.', '');
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
                            if (recursive === true) {
                                walk(folder + '/' + i, recursive);
                            }
                        }
                    } catch (err) {
                        LOG(that.name, 'NOT READABLE', insert, err);
                        walk(folder + '/' + i, recursive);
                    }
                } else {
                    LOG(that.name, 'NOT EXISTS', insert);
                    walk(folder + '/' + i, recursive);
                }
            });
        } else {
            LOG(that.name, 'NOT EXISTS ', folder);
        }
    };
    walk(folder, recursive);
    return data;
};