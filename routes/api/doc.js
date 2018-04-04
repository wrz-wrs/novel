const router = require('koa-router')()
const h = require('../../conf').h

// select novel
// router.get('/', async (ctx) => {
// 	ctx.body = jsonPackage({name:'kkk'})
// })

// create novel
router.get('/', async (ctx) => {
	
	try	{
		
		let o = {
			'search': `${h}/api/novel/search?an=放开那个女巫`,
			'create': `${h}`,
			'novelInfo': `${h}/api/novel?an=放开那个女巫`,
			'novelChapter': `${h}/api/novel?an=放开那个女巫&cn=1`,
		}
		ctx.body = o

	} catch (err) {
		console.log(err)
		ctx.body = err
	}
})

/*
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
*/

module.exports = router