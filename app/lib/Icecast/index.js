const
    fs = require('fs-extra'),
    spawn = require('child_process').spawn,
    http = require('http'),
    Module = require('../Module.js');


module.exports = class Iceccast extends Module {

    constructor(args) {
        return new Promise((resolve, reject) => {
            super(args);
            this.name = 'icecast';
            this.label = 'ICECAST';

            this.mergeOptions();
            LOG(this.label, 'INIT');

            if (this.options.flush_on_startup === true) {
                STORAGE.flush(this.path);
            }

            STORAGE.createFolder(this.path);
            STORAGE.createFolder(this.options.log_dir);

            if (this.options.load_on_startup === true && this.options.flush_on_startup !== true) {
                this.setOptionsFromStorage();
            }

            this.save();
            this.saveXML();
            this.run();

            this.on('ready', () => {
                resolve(this);
            });
        });
    }

    mergeOptions() {
        super.mergeOptions();
        this.path = P(`${STORAGE.path}/${this.options.paths.config}`);

        // make paths absolute
        Object.keys(this.options.paths).forEach(i => {
            this.options.config.paths[i] = this.options.paths[i];
        });
        this.options.config.paths.config = `${this.path}`;
        this.options.config.paths.logdir = `${this.path}/${this.options.paths.logdir}`;

        this.options.log_dir = `${this.path}/${this.options.paths.logdir}`;
        this.options.xml_file = `${this.path}/${this.options.name}.xml`;
        this.options.conf_file = `${this.path}/${this.options.name}.json`;

        STORAGE.createFolder(this.path);
        STORAGE.createFolder(this.options.log_dir);
    }

    saveXML() {
        let conf = '<icecast>\n';
        Object.keys(this.options.config).forEach(i => {
            if (typeof this.options.config[i] === 'string' || typeof this.options.config[i] === 'number') {
                conf += '    <' + i + '>' + this.options.config[i] + '</' + i + '>\n';
            }
            if (typeof this.options.config[i] === 'object') {
                conf += '    <' + i + '>\n';
                Object.keys(this.options.config[i]).forEach(ii => {
                    if (typeof this.options.config[i][ii] === 'string' || typeof this.options.config[i][ii] === 'number') {
                        conf += '        <' + ii + '>' + this.options.config[i][ii] + '</' + ii + '>\n';
                    }
                    if (typeof this.options.config[i][ii] === 'object') {
                        const attr = [];
                        if (this.options.config[i][ii].forEach) {
                            this.options.config[i][ii].forEach(iii => {
                                Object.keys(iii).forEach(k => {
                                    attr.push(k + '="' + iii[k] + '"');
                                });
                            });
                            const s = attr.join(' ');
                            conf += '        <' + ii + ' ' + s + '/>\n';
                        } else {
                            conf += `        <${ii}>\n`;
                            Object.keys(this.options.config[i][ii]).forEach(iii => {
                                //Object.keys(iii).forEach(function (k) {
                                attr.push(`            <${iii}>${this.options.config[i][ii][iii]}</${iii}>`);
                                //});
                            });
                            //const s = attr.join(' ');
                            //conf += '        <' + ii + ' ' + s + '/>\n';
                            conf += `${attr.join('\n')}\n`;
                            conf += `        </${ii}>\n`;
                        }
                    }
                });
                conf += '    </' + i + '>\n';
            }
        });
        conf += '</icecast>\n';
        fs.writeFileSync(this.options.xml_file, conf);
        LOG(this.label, 'XML SAVED', this.options.xml_file);
        this.emit('saved', this);
    };

    run() {
        const options = ['-c', this.options.xml_file];
        LOG(this.label, 'STARTING', this.options.bin, 'WITH CONFIG', options.join(' '));

        this.process = spawn(this.options.bin, options);
        this.process.stdout.setEncoding('utf8');
        this.process.stderr.setEncoding('utf8');

        this.process.stderr.on('data', chunk => {
            LOG(this.label, 'TTY', chunk.trim());
        });

        this.process.stderr.on('end', () => {
            LOG(this.label, 'EXITED');
        });
        setTimeout(() => {
                this.checkProcess()
            }, this.options.checkup_delay
        );
    };

    get path() {
        return this._path;
    }

    set path(path) {
        this._path = path;
    }

    checkProcess() {
        LOG(this.label, 'CHECK IF IT IS RUNNING ...');
        http.get({
            hostname: this.options.config.hostname,
            port: this.options.config["listen-socket"].port,
            path: '/' + this.options.status_endpoint
        }, (res) => {
            let json = '';
            res.on('data', data => {
                json += data;
            });
            res.on('end', () => {
                this.emit('ready', json);
                LOG(this.label, '>>> READY');
                LOG('');
            });
        }).on('error', err => {
            LOG(this.label, 'IS NOT RUNNING', JSON.stringify(err));
            setTimeout(() => {
                    this.checkProcess()
                }, this.options.checkup_delay
            );
        });
    };

    save() {
        let save = this.options;
        fs.writeJsonSync(this.options.conf_file, save);
        LOG(this.label, 'JSON SAVED', this.options.conf_file);
    }

    setOptionsFromStorage() {
        LOG(this.label, 'BUILD FROM STORAGE');
        const options = STORAGE.fetch.one(this.options.conf_file);
        if (!options) {
            return false;
        }
        this.args = options; // override the existing options
        this.mergeOptions();
    }

};