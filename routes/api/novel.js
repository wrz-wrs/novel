const router = require('koa-router')()
const novel = require('../../models/novel')

const chapter = require('../../models/chapter')

// select novel
router.get('/', async (ctx) => {

	try {
		let novelname = ctx.request.query.an
		let chapterNumber = ctx.request.query.cn
		let json = chapter.load(novelname)
		let title = json.novjson[chapterNumber].serial
		let chapterUrl = json.novjson[chapterNumber].url

		let content = await chapter.init(chapterUrl)
		let res = jsonPackage({'title': title, content: content.dataArray})
		if (!novelname) {
			res.status = 400
			res.errmsg = 'argument is err'
			delete res.data
			ctx.body = res
		} else {
			ctx.body = res
		}
	} catch (e) {
		console.log(e)
		ctx.body = e
	}
})


function jsonPackage(arg) {
	var json = {
		status: 400,
		errmsg: '',
		data:{
			name: '',
			website: '',
			author: '',
			title: '',
			content: [],
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