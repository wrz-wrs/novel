const router = require('koa-router')()
const h = require('../../conf').h

// create novel
router.get('/', async (ctx) => {
	
	try	{
		
		let o = {
			'user': `${h}/api/user/create`,
			'history': `${h}/api/user/history`,
			'search': `${h}/api/novel/search?an=放开那个女巫`,
			'create': `${h}/api/novel/create`,
			'read': `${h}/api/novel/read`,
			'tags': `${h}/api/novel/tags`,
			'novelInfo': `${h}/api/novel/info?an=放开那个女巫`,
			'searchTag': '',
			
			// 'novelChapter': `${h}/api/novel?an=放开那个女巫&cn=1`,
		}
		ctx.body = o

	} catch (err) {
		console.log(err)
		ctx.body = err
	}
})


module.exports = router