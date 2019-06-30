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
                order_by: 'shuffle',
                order_direction: 'asc'
            },
            hot_rotation: {
                enabled: true,
                latest_tracks: 100
            },
            spot: {
                nth: 2
            },
            intro: {
                folder: "station",
                order_by: "shuffle"
            }
        }

    ]
};