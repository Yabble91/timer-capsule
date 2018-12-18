// 为多媒体的处理模块
const db = require('../data/db');

class Media {
  constructor(params) {}

  // 保存事件
  async saveEvent (imgsData, eventId) {
    let {
      title,
      description,
      startDate,
      endDate,
      currentLoc,
      currentLocDetail,
      openId,
      imgSum,
    } = imgsData

    // 首先事件表插入数据
    let sql_event = `insert into event ( event_id, start_date, end_date, title, detail, images_num, location, location_detail, uid ) values 
    ( '${eventId}', '${startDate}', '${endDate}', '${title}', '${description}', '${imgSum}', '${currentLoc}', '${currentLocDetail}', '${openId}' )`
    let eventRes = await db.query(sql_event)
    if (eventRes.affectedRows) {
      return {
        status: 1,
        insert: true,
        eventId
      }
    } else {
      return {
        status: 0,
        msg: '插入事件失败'
      }
    }
  }

  // 保存媒体
  async saveMedia (imgsData, eventId) {
    let { imgPathList } = imgsData
    for (let i in imgPathList) {
      // 依次媒体表插入数据
      let sql_media = `insert into event_media ( media_url, media_type, event_id ) values
      ( '${imgPathList[i]}', 'img', '${eventId}' )`
      let mediaRes = await db.query(sql_media)
      if (imgPathList.length - 1 == i) {
        if (mediaRes.affectedRows) {
          return {
            status: 1,
            insert: true,
            eventId
          }
        } else {
          return {
            status: 0,
            msg: '插入媒体文件失败'
          }
        }
      }
    }
  }

  // 查询事件
  async getEvent (eventId) {
    let sql_getEvent = await db.query(`select * from event where event_id = '${eventId}';`)
    let eventRes = sql_getEvent[0]
    return {
      detail: eventRes.detail,
      startDate: eventRes.start_date,
      endDate: eventRes.end_date,
      title: eventRes.title,
      location: eventRes.location_detail
    }
  }

  // 查询媒体
  async getMedia (eventId) {
    let sql_getMedia = await db.query(`select * from event_media where event_id = '${eventId}';`)
    let mediaRes = {
      imgs: [],
      video: []
    }
    for (let e of sql_getMedia) {
      if (e.media_type == 'img') {
        mediaRes.imgs.push(e.media_url)
        continue
      }
      if (e.media_type == 'video') {
        mediaRes.video.push(e.media_url)
        continue
      }
    }
    return mediaRes
  }

  // 修改事件信息
  async updateEvent (eventData) {
    let { title, description, eventId } = eventData
    let sql_updateEvent = await db.query(`update event set title='${title}', detail='${description}' WHERE event_id='${eventId}'`)
    return sql_updateEvent
  }

  // 插入事件和媒体
  async insertEventAndMedia (eventData) {
    let event_id = eventData.openId.substring(15) + Date.now()
    let eventRes = this.saveEvent(eventData, event_id)
    let mediaRes = this.saveMedia(eventData, event_id)
    return await Promise.all([eventRes, mediaRes])
  }

  // 查询事件和媒体
  async getEventAndMedia (eventId) {
    let eventRes = await this.getEvent(eventId)
    let mediaRes = await this.getMedia(eventId)
    return Object.assign({}, eventRes, mediaRes)
  }

  // 修改已有事件和媒体
  async updateEventAndMedia (eventData) {
    // 更新事件信息
    let eventRes = await this.updateEvent(eventData)
    console.log(eventRes)
  }
}

module.exports = Media