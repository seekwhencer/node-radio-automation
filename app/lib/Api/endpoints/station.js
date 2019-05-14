const
    router = EXPRESS.Router();

router.get('/', (req, res) => {
    let api_base = 'http://' + API.host + ':' + API.port + '/';
    let out = {
        api: [
            api_base + 'channels'
        ]
    };
    res.json(out);
});

module.exports = router;
