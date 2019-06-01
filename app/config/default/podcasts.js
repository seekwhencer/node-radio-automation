module.exports = {
    path: 'podcasts',
    flush_on_startup: false,
    load_on_startup: true,
    items: [
        {
            name: 'Forschung Aktuell Beiträge',
            url: 'https://www.deutschlandfunk.de/podcast-forschung-aktuell.677.de.podcast.xml',
            limit: 20
        },
        {
            name: 'Forschung Aktuell Sendungen',
            url: 'https://www.deutschlandfunk.de/podcast-forschung-aktuell-komplette-sendung.417.de.podcast.xml'
        }
    ]
};