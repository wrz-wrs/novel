const router = require('koa-router')()

const h = require('../../conf').h
const userdao = require('../../models/dao/userdao')

// select novel
router.get('/create', async (ctx) => {
	try {

		let nickname = ctx.request.query.un
		let password = ctx.request.query.ps
		if (nickname && password) {
			await userdao.create(nickname, password)
			ctx.body = jsonPackage({})
		} else {
			let res = {}
			res = jsonPackage(res)
			res.errmsg = 'check un || ps'
			ctx.body = res
		}
	} catch (err) {
		let res = jsonPackage(res)
		res.status = 500
		res.errmsg = err.message
		ctx.body = res
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