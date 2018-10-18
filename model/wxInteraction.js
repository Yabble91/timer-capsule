const axios = require('axios')

class wxInteract {
  constructor() {
  }

  getOpenId(params) {
    let { code, appSecret, appId } = params
    return axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`)
  }

  insertDB() {

  }

}

module.exports = wxInteract