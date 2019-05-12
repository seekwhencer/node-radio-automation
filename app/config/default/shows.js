module.exports = {
    path: 'shows',
    flush_on_startup: false,
    load_on_startup: true,

    items: [
        {
            name: "Breaks",
            music: {
                folder: "breaks",
                recursive: false,
            }
        },
        {
            name: "Lounge",
            music: {
                folder: "lounge",
                recursive: true
            }
        }
    ]
};