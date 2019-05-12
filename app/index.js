const
    Station = require('./lib/Station.js');

require('./lib/Globals');

global.STATION = new Station();
module.exports = STATION;
