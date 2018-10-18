const db = require('../data/db');

class User {
  constructor(params) {
    this.userId
  }

  async getAllUsers () {
    var users = await db.query("select * from users;")
    return users
  }

  async findUser (openid) {
    this.userId = openid
    let userInfo = await db.query(`select * from users where uid = '${this.userId}';`)
    return userInfo
  }

  async insertUser (user) {
    let { openid, nickName, country, gender, province, city, avatarUrl, session_key } = JSON.parse(user)
    let sql = `insert into users ( uid, nickName, country, gender, province, city, avatarUrl, sessionKey ) values ( '${openid}', '${nickName}', '${country}', '${gender}', '${province}', '${city}', '${avatarUrl}', '${session_key}' )`
    let result = await db.query(sql)
    return result
  }
}

module.exports = User