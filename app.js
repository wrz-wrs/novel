const fs = require('fs')
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const path = require('path')
const static = require('koa-static')
const bodyParser = require('koa-bodyparser')
const jwt = require('jsonwebtoken')
const conf = require('./conf')

// 1452
const router = require('./routes/index')

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './public'


app.use(static(
	path.join( __dirname,  staticPath)
))

// 加载模板引擎
app.use(views(__dirname + '/views', {
	map : {html:'ejs'}
}))

// 使用ctx.body解析中间件
app.use(bodyParser())


const unTokenList = [
	'/api/user/login',
	'/api/user/create',
	'/api/doc'
]

app.use(async (ctx, next) => {
	let url = ctx.url
	url = (url.split('?'))[0]
	let _next = false
	let prikey = fs.readFileSync(__dirname+'/pri.pem')

	for (let k in unTokenList) {
		if (url == unTokenList[k]) {
			_next = true
		}
	}
	if (_next) {
		await next()
	} else {
		try {
			let token = ctx.cookies.get('token')
			let hastoken = jwt.verify(token, prikey)
			if (hastoken) {
				console.log(hastoken)
				await next()
			} else {
				throw new Error('token err')
			}
		} catch (err) {
			console.log(err.message)
			// ctx.redirect('/api/user/login')
			ctx.body = 'token err'
		}
	}
})


app.use(router.routes()).use(router.allowedMethods())

app.listen(conf.port)

app.on('error', async function (err, ctx) {
	// await ctx.render('error',{error: err})
	console.log(err.stack);
})

function iit() {
	if (!fs.existsSync(conf.save_novjson_path)) {
		fs.mkdirSync(conf.save_novjson_path)
	}
}

iit()