export default class Form {
    constructor() {

    }

    parse(reqFields) {
        const singleFields = ['name', 'description', 'stream_meta', 'color'];
        const arrayFields = {
            path: ['music', 'intro', 'spot', 'podcast'],
            music: ['folder', 'recursive', 'order_by', 'order_direction'],
            hot_rotation: ['enable', 'only', 'age_days', 'latest_tracks', 'at_beginning', 'shuffle_beginning', 'multiplier', 'order_by', 'order_direction'],
            intro: ['enable', 'folder', 'recursive', 'order_by', 'order_direction'],
            spot: ['enable', 'folder', 'recursive', 'nth', 'offset', 'age_days', 'latest_tracks', 'random_first', 'order_by', 'order_direction'],
            podcast: ['enable', 'folder', 'recursive', 'nth', 'offset', 'age_days', 'latest_tracks', 'random_first', 'order_by', 'order_direction'],
        };

        let fieldData = {};

        singleFields.forEach(i => {
            if (reqFields[i])
                fieldData[i] = reqFields[i];
        });

        Object.keys(arrayFields).forEach(i => {
            fieldData[i] = {};
            arrayFields[i].forEach(ii => {
                if (reqFields[`${i}_${ii}`]) {
                    fieldData[i][ii] = reqFields[`${i}_${ii}`];
                }

                if (fieldData[i][ii] === 'no')
                    fieldData[i][ii] = false;

                if (fieldData[i][ii] === 'yes')
                    fieldData[i][ii] = true;

                if (parseInt(fieldData[i][ii]) > 0)
                    fieldData[i][ii] = parseInt(fieldData[i][ii]);

            });
            if (Object.keys(fieldData[i]).length === 0)
                delete(fieldData[i]);
        });

        return fieldData;
    }
};
