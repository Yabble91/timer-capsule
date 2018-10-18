const Koa = require('koa');
const app = new Koa();

// x-response-time

app.use(async (ctx, next) => {
  await next();
  console.log('这是插件一')
});

// logger

app.use(async (ctx, next) => {
  console.log('这是插件二')
  await next();
});

// response

app.use(async ctx => {
  console.log('插件三')
});

app.listen(3000);