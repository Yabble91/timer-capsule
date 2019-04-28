const multer = require('koa-multer');
const Media = require('../model/media');
const path = require('path')
// 配置上传路径
const storage = multer.diskStorage({
  //文件保存路径
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../public/uploads'))
  },
  //修改文件名称
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})
//加载配置
const upload = multer({ storage: storage });

module.exports = (router) => {
  const media = new Media()

  router.prefix('/media')

  // 上传图片集方法
  // 上传图片集的标题
  let imgTit = "";
  let eventData = {};
  router.post('/saveHappy', upload.single('activityPics'), async (ctx, next) => {
    if (imgTit == ctx.req.body.title) {
      // 同一拨图片上传
      eventData.imgPathList.push(ctx.req.file.filename)
      if (eventData.imgPathList.length == ctx.req.body.imgSum) {
        // 开始进行落库
        let mediaRes = await media.insertEventAndMedia(eventData)
        for (let e of mediaRes) {
          if (!e.status) {
            ctx.body = e
          }
        }
        // 清空记忆
        imgTit = ''
        eventData = {}
        ctx.body = {
          status: 1,
          insert: true,
          message: '媒体事件插入成功',
          eventId: mediaRes[1].eventId
        }
      } else {
        ctx.body = {
          status: 1,
          insert: true,
          message: '媒体事件插入成功，还未完成'
        }
      }
    } else if (ctx.req.body.imgSum == 1) {
      // 只有一张
      eventData = ctx.req.body
      eventData.imgPathList = []
      eventData.imgPathList.push(ctx.req.file.filename)
      imgTit = ctx.req.body.title
      // 开始落库
      let mediaRes = await media.insertEventAndMedia(eventData)
      // 清空记忆
      imgTit = ''
      eventData = {}
      if (mediaRes[0].status) {
        ctx.body = {
          status: 1,
          insert: true,
          message: '媒体事件插入成功',
          eventId: mediaRes[1].eventId
        }
      } else {
        console.log('落库报错了')
      }
    } else {
      // 不是一波图片上传
      // 第一次上传这一波图片组
      eventData = {}
      eventData = ctx.req.body
      eventData.imgPathList = []
      eventData.imgPathList.push(ctx.req.file.filename)
      imgTit = ctx.req.body.title
      ctx.body = {
        status: 1,
        insert: true,
        message: '首次插入成功'
      }
    }
  })

  // 查询图片集方法
  router.get('/getHappy', async (ctx, next) => {
    let eventId = ctx.request.query.eventId
    let happyFilm = await media.getEventAndMedia(eventId)
    ctx.body = happyFilm
  })

  // 补充图片集的方法
  let supplyEventId = '';
  let supplyData = {};
  router.post('/supplyHappy', upload.single('activityPics'), async (ctx, next) => {
    if (supplyEventId == ctx.req.body.eventId) {
      // 一波上传
      supplyData.imgPathList.push(ctx.req.file.filename)
      if (supplyData.imgPathList.length == ctx.req.body.imgSum) {
        // 最后一张喵，准备更新原有信息落库喵
        // 更新事件信息
        let updateEveRes = await media.updateEventAndMedia(supplyData, supplyEventId)
        // 如果有删除图片的话将原始图片删除
        let delImgsList = JSON.parse(ctx.req.body.deletedImgsList)
        // 存放删除文件的结果
        let updateDelRes = ''
        if (delImgsList.length) {
          updateDelRes = await media.deleteMedia(delImgsList)
        }
        if (updateDelRes.status) {
          ctx.body = {
            status: 1,
            message: '事件与媒体更新完毕',
            insert: true
          }
        } else if (updateEveRes.status) {
          ctx.body = {
            status: 1,
            message: '事件更新完毕',
            insert: true
          }
        } else {
          ctx.body = {
            status: 0,
            message: '事件与媒体更新失败',
            insert: false
          }
        }
      } else {
        ctx.body = {
          status: 1,
          insert: true,
          message: '插入成功，未完成'
        }
      }
    } else {
      // 第一次上传
      supplyEventId = ctx.req.body.eventId
      supplyData = ctx.req.body
      supplyData.imgPathList = []
      supplyData.imgPathList.push(ctx.req.file.filename)
      if (ctx.req.body.imgSum == 1) {
        // 只有一张的情况下直接落库
        // 更新事件与媒体
        let updateEveRes = await media.updateEventAndMedia(supplyData, supplyEventId)
        // 如果有删除图片的话将原始图片删除
        let delImgsList = JSON.parse(ctx.req.body.deletedImgsList)
        let updateDelRes = '' // 用来接收删除图片的结果
        if (delImgsList.length) {
          updateDelRes = await media.deleteMedia(delImgsList)
        }
        if (updateDelRes.status) {
          ctx.body = {
            status: 1,
            message: '事件与媒体更新完毕',
            insert: true
          }
        } else if (updateEveRes.status) {
          ctx.body = {
            status: 1,
            message: '事件更新完毕',
            insert: true
          }
        } else {
          ctx.body = {
            status: 0,
            message: '事件与媒体更新失败',
            insert: false
          }
        }
      } else {
        ctx.body = {
          status: 1,
          message: '插入媒体成功，但还未完成',
          insert: true
        }
      }
    }
  })

  let delImgsData = {}
  // 删除图片
  router.post('/updateDelImgs', async (ctx, next) => {
    delImgsData = ctx.request.body.formData
    let delImgsList = JSON.parse(delImgsData.deletedImgsList)
    // 只有一张的情况下直接落库
    // media.updateEvent(delImgsData)
    // 删除掉以前的照片文件
    let delRes = await media.deleteMedia(delImgsList)
    ctx.body = delRes.status == 1 ? { status: 1, message: '删除图片成功', delete: true } : { status: 0, message: '删除图片失败', delete: false }
  })

  // 获取固定年份月份的事件信息
  router.get('/getDateEvent', async (ctx, next) => {
    let periodDate = ctx.request.query.period
    let perRes = await media.seekDateEvent(periodDate)
    ctx.body = Object.assign({}, {status: 1, message: '查取成功'}, {dateArr: perRes})
  })

  return router
}