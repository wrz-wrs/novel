const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const path = require('path')
const bodyParser = require('koa-bodyparser')

const router = require('./routes/index')

// 加载模板引擎
app.use(views(__dirname + '/views', {
	map : {html:'ejs'}
}))

// 使用ctx.body解析中间件
app.use(bodyParser())


app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)

app.on('error', async function (err, ctx) {
	// await ctx.render('error',{error: err})
	console.log(err.stack);
})