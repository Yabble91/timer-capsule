const multer = require('koa-multer');
const Media = require('../model/Media');
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

  router.post('/saveHappy', upload.single('activityPics'), async (ctx, next) => {
    console.log('接收成功')
    console.log(ctx.req.file)
  })

  return router
}