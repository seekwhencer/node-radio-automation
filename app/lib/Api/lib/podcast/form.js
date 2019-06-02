module.exports = class Form {
    constructor() {

    }

    parse(reqFields) {
        const singleFields = ['name', 'description', 'url', 'limit', 'autostart'];
        let fieldData = {};
        singleFields.forEach(i => {
            if (reqFields[i])
                fieldData[i] = reqFields[i];

            if (reqFields[i] === 'no')
                fieldData[i] = false;

            if (reqFields[i] === 'yes')
                fieldData[i] = true;

        });
        return fieldData;
    }
};
