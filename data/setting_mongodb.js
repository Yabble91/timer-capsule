let settings = {}
let config = {
  dev: {
    cookieSecret: 'mySweet',
    db: 'timer', 
    host: 'localhost',
    hostDb: 'localhost/timer',
    port: 27017
  },
  pro: {
    cookieSecret: 'mySweet',
    db: 'timer', 
    host: 'localhost',
    hostDb: 'localhost/timer',
    port: 27017
  }
}

if (process.env.NODE_ENV == 'development') {
  settings = Object.assign({}, settings, config.dev)
} else {
  settings = Object.assign({}, settings, config.pro)
}
module.exports = settings
