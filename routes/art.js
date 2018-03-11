const router = require('koa-router')()
const CRA = require('../middle/index')

router.get('/', async (ctx) => {

	var an = ctx.query.an
	var cn = ctx.query.cn
	
	await ctx.render('read', {
		name:'ssss',
		cn:'sss',
	})
})

router.post('/', async (ctx) => {
	var an = ctx.query.an
	var cn = ctx.query.cn

	// console.log(an)
	var cra = new CRA()

	try {
		
		ctx.body = await cra.init('http://www.biqugezw.com/9_9767/1890292.html')
		
	} catch (err) {

		console.log(err)
	}
	
})

module.exports = router