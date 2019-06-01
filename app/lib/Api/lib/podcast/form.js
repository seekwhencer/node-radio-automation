module.exports = class Form {
    constructor() {

    }

    parse(reqFields) {
        const singleFields = ['name', 'description', 'url', 'limit', 'autostart'];

        let fieldData = {};

        singleFields.forEach(i => {

            if (fieldData[i] === 'no')
                fieldData[i] = false;

            if (fieldData[i] === 'yes')
                fieldData[i] = true;

            if (reqFields[i])
                fieldData[i] = reqFields[i];


        });

        return fieldData;
    }
};
