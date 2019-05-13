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
            LOG(this.label, 'INIT');
            this.mergeOptions();

            this.path = P(`${STORAGE.path}/${this.options.paths.config}`);
            this.conf_file = `${this.path}/${this.options.name}.xml`;
            this.log_dir = `${this.path}/${this.options.paths.logdir}`;

            if (this.options.flush_on_startup === true) {
                STORAGE.flush(this.path);
            }
            STORAGE.createFolder(this.path);
            STORAGE.createFolder(this.log_dir);
            this.saveConfig();
            this.run();

            this.on('ready', () => {
                resolve(this);
            });
        });
    }

    saveConfig() {
        const Icecast = this;
        let conf = '<icecast>\n';

        // make paths absolute
        Object.keys(Icecast.options.paths).forEach(function (i) {
            Icecast.options.config.paths[i] = Icecast.options.paths[i];
        });
        Icecast.options.config.paths.config = `${Icecast.path}`;
        Icecast.options.config.paths.logdir = `${Icecast.path}/${Icecast.options.paths.logdir}`;

        Object.keys(Icecast.options.config).forEach(function (i) {
            if (typeof Icecast.options.config[i] === 'string' || typeof Icecast.options.config[i] === 'number') {
                conf += '    <' + i + '>' + Icecast.options.config[i] + '</' + i + '>\n';
            }
            if (typeof Icecast.options.config[i] === 'object') {
                conf += '    <' + i + '>\n';
                Object.keys(Icecast.options.config[i]).forEach(function (ii) {
                    if (typeof Icecast.options.config[i][ii] === 'string' || typeof Icecast.options.config[i][ii] === 'number') {
                        conf += '        <' + ii + '>' + Icecast.options.config[i][ii] + '</' + ii + '>\n';
                    }
                    if (typeof Icecast.options.config[i][ii] === 'object') {
                        const attr = [];
                        if (Icecast.options.config[i][ii].forEach) {
                            Icecast.options.config[i][ii].forEach(function (iii) {
                                Object.keys(iii).forEach(function (k) {
                                    attr.push(k + '="' + iii[k] + '"');
                                });
                            });
                            const s = attr.join(' ');
                            conf += '        <' + ii + ' ' + s + '/>\n';
                        } else {
                            conf += `        <${ii}>\n`;
                            Object.keys(Icecast.options.config[i][ii]).forEach(function (iii) {
                                //Object.keys(iii).forEach(function (k) {
                                attr.push(`            <${iii}>${Icecast.options.config[i][ii][iii]}</${iii}>`);
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
        fs.writeFileSync(this.conf_file, conf);
        LOG(this.label, 'CONFIG SAVED', this.conf_file);
        this.emit('saved', this);
    };

    run() {
        const options = ['-c', this.conf_file];
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

};