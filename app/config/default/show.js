module.exports = {


    defaults: {
        id: "",
        name: "Default Show",
        slug: "",
        stream_meta: "Default Stream Meta",
        description: "Streng dem definierten Wesen des Blindtextes folgend...",
        color: "",
        playlist_path: "",

        path: {
            music: "music",
            podcast: "podcast",
            spot: "spot",
            intro: "intro"
        },

        music: {
            enable: true,
            folder: "electro",
            path: "",
            recursive: true,
            order_by: "shuffle", // time,name,shuffle
            order_direction: "asc" // asc or desc
        },

        hot_rotation: {
            enable: false,
            only: false,
            age_days: false,
            latest_tracks: 100,
            at_beginning: true,
            shuffle_beginning: true,
            multiplier: 5,
            order_by: "time", // time or name,
            order_direction: "asc" // or desc
        },

        podcast: {
            enable: true,
            folder: "forschung",
            path: "",
            recursive: false,
            nth: 10,
            offset: 1,
            age_days: false,
            latest_tracks: 100,
            random_first: true,
            order_by: "shuffle", // time or name,
            order_direction: "asc" // or desc
        },

        spot: {
            enable: true,
            folder: "station",
            path: "",
            recursive: false,
            nth: 2,
            offset: 2,
            latest_tracks: 100,
            random_first: true,
            order_by: "shuffle", // time or name,
            order_direction: "asc" // or desc
        },

        intro: {
            enable: true,
            folder: "station",
            recursive: false,
            path: "",
            order_by: "shuffle", // time or name,
            order_direction: "asc" // or desc
        }
    }
}