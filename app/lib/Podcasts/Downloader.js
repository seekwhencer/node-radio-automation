import fs from 'fs-extra';
import request from 'request';
import parsePodcast from 'node-podcast-parser';
import slugify from 'slugify';
import Module from '../Module.js';

export default class PodcastDownloader extends Module {
    constructor(args) {
        super(args);
        this.label = 'PODCAST DOWNLOADER';
        this.name = 'downloader';

        this.mergeOptions();
        this.items = [];
    };

    mergeOptions() {
        super.mergeOptions();
    }

    fetch() {
        return new Promise(async (resolve, reject) => {
            try {
                let feed = await this.getFeed();
                this.items = [];
                let episodes = this.options.limit == 0 ? feed.episodes : feed.episodes.slice(0, this.options.limit);
                for (const podcast of episodes) {
                    let fileName = `${podcast.title.replace(/[/\\?%*:|"<>&]/g, "-")}`;
                    fileName = `${slugify(fileName, {replacement: '_', lower: true})}.mp3`;
                    const filePath = `${this.options.path}/${fileName}`;
                    await this.download(filePath, podcast.enclosure.url);
                    this.items.push(podcast);
                }
                resolve(this.items);
            } catch (error) {
                reject(error);
            }
        });
    };

    getFeed() {
        return new Promise((resolve, reject) => {
            request(this.options.url, (err, res, data) => {
                if (err)
                    reject('Network error', err);

                parsePodcast(data, (err, data) => {
                    if (err)
                        reject('Parsing error', err);

                    resolve(data);
                });
            });
        });
    };

    download(path, url) {
        if (!fs.existsSync(path)) {
            return new Promise((resolve, reject) => {
                LOG(this.label, 'REQUESTING ______ ', path);
                request(url).pipe(fs.createWriteStream(path)).on('finish', function () {
                    resolve(path)
                }).on('error', function (error) {
                    reject(error);
                });
            });
        } else {
            LOG(this.label, 'EXISTS', path);
            return Promise.resolve(path);
        }
    }

};