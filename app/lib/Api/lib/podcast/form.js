const ScheduleForm = require('../schedule/form.js');
module.exports = class Form {
    constructor() {
        this.scheduleForm = new ScheduleForm();
    }

    parse(reqFields) {
        const singleFields = ['name', 'description', 'url', 'limit', 'autostart', 'cron_1', 'cron_2', 'cron_3', 'cron_4', 'cron_5'];
        let fieldData = {};
        singleFields.forEach(i => {
            if (reqFields[i])
                fieldData[i] = reqFields[i];

            if (reqFields[i] === 'no')
                fieldData[i] = false;

            if (reqFields[i] === 'yes')
                fieldData[i] = true;

        });

        if (!fieldData.cron)
            fieldData.cron = {};

        for (let i = 1; i < 6; i++) {
            if (fieldData[`cron_${i}`]) {
                fieldData.cron[`${i}`] = fieldData[`cron_${i}`];
            }
            delete(fieldData[`cron_${i}`]);
        }

        return fieldData;
    }

    checkCron(crons) {
        return this.scheduleForm.checkCron(crons);
    }
};
