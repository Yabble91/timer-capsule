const wxServer = require('../model/wxInteraction')

module.exports = (router) => {
  router.get('/', async (ctx, next) => {
    await ctx.render('index', {
      title: 'Hello Koa 2!'
    })
  })

  router.post('/onLogin', async (ctx, next) => {
    const { code } = ctx.request.body
    const appSecret = '1d90b57d62084529144049d761ba193b'
    const appId = 'wx85cdf179af7ae8fd'

    const wx = new wxServer()
    let data = await wx.getOpenId({code, appSecret, appId})
    let resultData = {}
    if (data.data.errcode) {
      resultData = {
        status: 0,
        ...data.data
      }
    } else {
      resultData = {
        status: 1,
        ...data.data
      }
    }
    ctx.body = resultData
  })

  return router
}