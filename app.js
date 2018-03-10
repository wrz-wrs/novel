const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const path = require('path')
const router = require('./routes/index')


// 加载模板引擎
app.use(views(path.join(__dirname, './views'), {
	extension: 'html'
}))

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)

app.on('error', function (err) {
	console.log(err.stack);
});