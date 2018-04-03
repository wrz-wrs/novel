const router = require('koa-router')()
const h = require('../../conf').h
const novel = require('../../models/novel')

// select novel
router.get('/', async (ctx) => {
	try {
		
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
		let novelname = ctx.request.body.an
		let url = ctx.request.body.url
		let o = await novel.init(url, novelname)
		let res = jsonPackage({})
		res.data = o
		ctx.body = res

	} catch (err) {
		console.log(err)
		ctx.body = err
	}
})

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