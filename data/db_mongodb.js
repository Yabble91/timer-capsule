const settings = require('./setting_mongodb');
const Monk = require('monk');
const mongodb = Monk(settings.hostDb)

module.exports = mongodb