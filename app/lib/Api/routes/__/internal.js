const
    router = EXPRESS.Router(),
    Health = require('../lib/internal/health.js'),
    Metrics = require('../lib/internal/metrics.js'),
    Ping = require('../lib/internal/ping.js'),
    Release = require('../lib/internal/release.js');

router.get('/', (req, res) => {
    res.json({
        available: {
            release: 'internal/release',
            health: 'internal/health',
            metrics: 'internal/metrics',
            ping: 'inernal/ping'
        }
    });
});

router.get('/release', (req, res) => {
    let release = new Release();
    res.send(release);
});

router.get('/metrics', (req, res) => {
    let metrics = new Metrics();
    res.json(metrics);
});

router.get('/health', (req, res) => {
    let health = new Health();
    res.json(health);
});

router.get('/ping', (req, res) => {
    let ping = new Ping();
    res.send('pong');
});

module.exports = router;