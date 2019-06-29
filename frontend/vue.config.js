const os = require('os');
module.exports = {
    css: {
        loaderOptions: {
            sass: {
                data: `
                      @import "@/scss/themes/default-dark.scss";
                      @import "@/scss/index.scss";
                      
                `
            }
        }
    },
    devServer: {
        watchOptions: {
            poll: 1000,
            aggregateTimeout: 600,
            ignored: [/node_modules/, /public/]
        },
        allowedHosts: [
            os.hostname()
        ]
    }
};
