module.exports = {
    css: {
        loaderOptions: {
            sass: {
                data: `
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
        }
    }
};
