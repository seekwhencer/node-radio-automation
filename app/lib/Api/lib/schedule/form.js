import cronParser from 'cron-parser';

export default class Form {
    constructor() {
    }

    parse(reqFields) {
        const singleFields = ['name', 'description', 'show_id', 'cron_1', 'cron_2', 'cron_3', 'cron_4', 'cron_5', 'action'];
        let fieldData = {};
        singleFields.forEach(i => {
            if (reqFields[i])
                fieldData[i] = reqFields[i].trim();

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
            delete (fieldData[`cron_${i}`]);
        }

        if (!fieldData.action)
            fieldData.action = 'play';

        if (!['play', 'pause', 'stop', 'respawn'].includes(fieldData.action))
            delete (fieldData.action);

        return fieldData;
    };

    checkCron(crons) {
        let cronArray = [];
        for (let i = 1; i < 6; i++) {
            cronArray.push(`${crons[`${i}`]}`);
        }
        const cronString = cronArray.join(' ');
        try {
            const sched = cronParser.parseExpression(cronString, {
                tz: 'Europe/Berlin'
            });
            sched.next();
            return true;
        } catch (err) {
            return false;
        }
    };
};
