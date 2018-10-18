const defaultRoute = require('./default')(require('koa-router')())
const users = require('./users')(require('koa-router')())

module.exports = function (app) {
  app.use(users.routes(), users.allowedMethods())
  app.use(defaultRoute.routes(), defaultRoute.allowedMethods())
}
