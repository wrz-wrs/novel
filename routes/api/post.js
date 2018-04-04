const router = require('koa-router')()
const h = require('../../conf').h
const novel = require('../../models/novel')
const noveldao = require('../../models/dao/noveldao')

// select novel
router.get('/', async (ctx) => {
	try {
		let name = ctx.request.body.an
		let author = ctx.request.body.author
		let cover = ctx.request.body.cover
		let source = ctx.request.body.source
		if (!name || !source) {

		} else {

			let json = {name,author,cover,source,}
			__create(json)
		}


		let o = jsonPackage({})
		delete o.data
		ctx.body = o
	} catch (e) {
		ctx.body = e
	}
})

// create novel
router.post('/', async (ctx) => {
	try	{
		let name = ctx.request.body.an
		let author = ctx.request.body.author
		let cover = ctx.request.body.cover
		let source = ctx.request.body.source
		if (!name || !source) {

		} else {

			let json = {name,author,cover,source,}
			__create(json)
		}

		ctx.body = res

	} catch (err) {
		console.log(err)
		ctx.body = err
	}
})

/*
* json{name,author,cover,source,} **must
*/
async function __create (json) {
	// 创建json文件
	let o = await init(json.source, json.name) 
	//写入数据库
	await noveldao.create(json)

}

function jsonPackage(arg) {
	var json = {
		status: 400,
		errmsg: '',
		data:{
			name: '',
			website: [],
			author: '',
			timeStamp: '',
		},
		doclink: `${h}/api/doc`,
		example: [
				`${h}/api/post?an=放开那个女巫&url=http://www.23us.so/files/article/html/14/14220/index.html`,
			],
	}

	if ((typeof arg) != 'object') {
		throw new Error('argument is not json')
	} else {
		for(var key in arg) {
			json.data[key] = arg[key]
		}
		json.status = 200
		return json
	}
	return json
}


module.exports = router