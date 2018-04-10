const router = require('koa-router')()
const h = require('../../conf').h

// create novel
router.get('/', async (ctx) => {
	
	try	{
		
		let o = {
			'user': `${h}/api/user/create`,
			'search': `${h}/api/novel/search?an=放开那个女巫`,
			'create': `${h}/api/novel/create`,
			'tags': `${h}/api/novel/tags?novelid=1&tagname=魔法&userid=1`,
			'novelInfo': `${h}/api/novel?an=放开那个女巫`,
			'novelChapter': `${h}/api/novel?an=放开那个女巫&cn=1`,
		}
		ctx.body = o

	} catch (err) {
		console.log(err)
		ctx.body = err
	}
})


module.exports = router