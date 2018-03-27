const router = require('koa-router')()

router.get('/', async (ctx) => {
	await ctx.render('post', {})
})

router.post('/', async (ctx) => {
	
	let novelname = ctx.request.body.an

	ctx.body = novelname
})

module.exports = router