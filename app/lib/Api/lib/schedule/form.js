module.exports = class Form {
    constructor() {

    }

    parse(reqFields) {
        const singleFields = ['name', 'description', 'show_id', 'cron_1', 'cron_2', 'cron_3', 'cron_4', 'cron_5'];
        let fieldData = {};
        singleFields.forEach(i => {
            if (reqFields[i])
                fieldData[i] = reqFields[i].trim();

            if (reqFields[i] === 'no')
                fieldData[i] = false;

            if (reqFields[i] === 'yes')
                fieldData[i] = true;

        });
        return fieldData;
    }
};
