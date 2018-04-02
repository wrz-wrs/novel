const router = require('koa-router')()
const novel = require('../../models/novel')

// select novel
// router.get('/', async (ctx) => {
// 	ctx.body = jsonPackage({name:'kkk'})
// })

// create novel
router.post('/', async (ctx) => {
	
	try	{
		let novelname = ctx.request.body.an
		let url = ctx.request.body.url
		await novel.init(url, novelname)
		let res = jsonPackage({})
		res.status = 200
		delete res.data
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
		doclink: 'http://127.0.0.1',
		example: 'http://127.0.0.1',
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