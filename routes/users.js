const User = require('../model/users')

module.exports = (router) => {
  const user = new User()

  router.prefix('/users')

  router.get('/', function (ctx, next) {
    ctx.body = 'this is a users response!'
  })

  router.get('/getAll', async (ctx, next) => {
    let allUser = await user.getAllUsers()
    ctx.body = allUser
  })

  router.get('/getUserInfo', async (ctx, next) => {
    let userInfo = ctx.request.query.userInfo
    let { openid } = JSON.parse(userInfo)
    let userInfo_db = await user.findUser(openid)
    let result
    if (!Object.keys(userInfo_db).length) {
      // 没有这个用户，向数据库插入保存
      let insertRes = await user.insertUser(userInfo)
      if (insertRes.affectedRows) {
        result = {
          status: 1,
          insert: true
        }
      } else {
        result = {
          status: 0,
          errmsg: '插入失败了'
        }
      }
    } else {
      // 已经存在这个用户
      result = {
        status: 1,
        hasUser: true
      }
    }

    ctx.body = result
  })

  return router
}
