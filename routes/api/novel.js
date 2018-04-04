const router = require('koa-router')()

const h = require('../../conf').h
const novel = require('../../models/novel')
const chapter = require('../../models/chapter')

// select novel
router.get('/', async (ctx) => {
	try {

		let novelname = ctx.request.query.an
		let chapterNumber = ctx.request.query.cn
		let res = {}

		if (!novelname) {
			res.status = 400
			res.errmsg = 'argument is err'
			delete res.data
			ctx.body = res
		} else {

			let json = chapter.load(novelname)
			let name = json.name
			let website = json.website
			let author = json.author
			let timeStamp = json.updateTime
			let o = {
				timeStamp,
				name,
				website,
				author,
			}

			if (chapterNumber) {

				o.title = json.novjson[chapterNumber].serial
				let chapterUrl = json.novjson[chapterNumber].url
				o.content = await chapter.init(chapterUrl)

			} else {
				o.content = json.novjson
			}

			res = jsonPackage(o)
			res.example = `${h}/api/novel?an=放开那个女巫&cn=1`
			ctx.body = res
		}
	} catch (err) {
		console.log(err)
		ctx.body = err.message
	}
})

router.get('/search', async (ctx) => {
	try {
		let res = {}
		let an = ctx.request.query.an
		if (an) {
			let result = await novel.search(an)
			res = jsonPackage({result})
			ctx.body = res
		} else {
			res = jsonPackage()
			res.status = 404
			res.errmsg = 'argument an is null'
			ctx.body = res
		}

	} catch (err) {
		console.log(err)
		ctx.body = err.message
	}
})


function jsonPackage(arg) {
	var json = {
		status: 400,
		errmsg: '',
		data:{
			// timeStamp: '',
			// name: '',
			// website: '',
			// author: '',
			// title: '',
			// content: [],
		},
		doclink: `${h}/api/doc`,
		example: [
				`${h}/api/novel?an=放开那个女巫`,
				`${h}/api/novel?an=放开那个女巫&cn=1`
			],
	}

	if ((typeof arg) != 'object') {
		// throw new Error('argument is not json')
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