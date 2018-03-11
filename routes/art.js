const router = require('koa-router')()
const CRA = require('../middle/index')

const Chapter = require('../models/chapter')

const cra = new CRA()
const chapter = new Chapter()

router.get('/', async (ctx) => {

	// var an = ctx.query.an
	// var cn = ctx.query.cn

	let novelname = '放开那个女巫'
	let chapterNumber = ctx.query.cn
	console.log(ctx.query.cn)
	if (chapterNumber == null) {
		ctx.body = ''
	} else {
		try {
			let json = chapter.load(novelname)
			let title = json.novjson[chapterNumber].serial

			await ctx.render('read', {
				title: title,
				name: novelname,
				cn: chapterNumber,
			})

		} catch (err) {
			console.log(err)
		}
	}

})

router.post('/', async (ctx) => {

	let novelname = ctx.request.body.an
	let chapterNumber = ctx.request.body.cn

	try {

		let json = chapter.load(novelname)
		let title = json.novjson[chapterNumber].serial
		let chapterUrl = json.novjson[chapterNumber].url

		let content = await chapter.init('http://www.biqugezw.com' + chapterUrl)
		let res = {
			title: title,
			dataArray: content.dataArray
		}
		ctx.body = res		
	} catch (err) {

		console.log(err)
	}
	
})

module.exports = router