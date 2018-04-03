const router = require('koa-router')()
// const 

router.get('/', async (ctx) => {
	await ctx.render('post', {})
})

// router.post('/', async (ctx) => {
	
// 	let novelname = ctx.request.body.an
// 	let url = ctx.request.body.url

	
// 	ctx.body = novelname
// })

module.exports = router