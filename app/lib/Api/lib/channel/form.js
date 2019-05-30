module.exports = class Form {
    constructor() {

    }

    parse(reqFields) {
        const singleFields = ['name', 'description', 'autostart', 'checkup_delay'];
        const mpdFields = ['buffer_before_play', 'audio_buffer_size'];
        const mpdOutputFields = ['mount', 'bitrate', 'encoding', 'format'];

        let fieldData = {};

        // mapping the top level mpd options
        mpdFields.forEach(field => {
            if (reqFields[field]) {
                if (!fieldData.mpd)
                    fieldData.mpd = {};

                if (!fieldData.mpd.config)
                    fieldData.mpd.config = {};

                fieldData.mpd.config[field] = reqFields[field];
            }
        });

        // mapping the mpd config options for audio output
        mpdOutputFields.forEach(field => {
            if (reqFields[field]) {
                if (!fieldData.mpd)
                    fieldData.mpd = {};

                if (!fieldData.mpd.config)
                    fieldData.mpd.config = {};

                if (!fieldData.mpd.config.audio_output)
                    fieldData.mpd.config.audio_output = {};

                fieldData.mpd.config.audio_output[field] = reqFields[field];
            }
        });

        Object.keys(reqFields).forEach((key) => {
            if (reqFields[key] === 'no')
                reqFields[key] = false;

            if (reqFields[key] === 'yes')
                reqFields[key] = true;

        });

        singleFields.forEach(i => {
            if (reqFields[i])
                fieldData[i] = reqFields[i];
        });

        return fieldData;
    }
};
