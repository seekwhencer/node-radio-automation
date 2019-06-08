const
    schedule = require('node-schedule'),
    Module = require('../Module');

module.exports = class ScheduleJob {

    constructor(args) {
        this.name = 'schedulejob';
        this.label = 'SCHEDULE JOB';
        this.schedule = args.schedule;


        LOG(this.label, 'INIT', this.name);



    }
};