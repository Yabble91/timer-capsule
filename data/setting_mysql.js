let settings = {}
let config = {
  dev: {
    user: 'root',
    password: '123456a',
    database: 'timer',
    host: '127.0.0.1',
    timezone: '08:00'
  },
  pro: {
    user: 'root',
    password: 'YubbleAndRonnieo@(0909)',
    database: 'timer',
    host: '47.93.15.178',
    timezone: '08:00'
  }
}

if (process.env.NODE_ENV == 'development') {
  settings = Object.assign({}, settings, config.dev)
} else {
  settings = Object.assign({}, settings, config.pro)
}
module.exports = settings
