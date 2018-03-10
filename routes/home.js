const router = require('koa-router')()

module.exports = router.get('/', async ( ctx )=>{

	await ctx.render('index', {})
})