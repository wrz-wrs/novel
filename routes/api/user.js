const router = require('koa-router')()

const h = require('../../conf').h
const userdao = require('../../models/dao/userdao')
const historydao = require('../../models/dao/historydao')

// select novel
router.get('/create', async (ctx) => {
	try {

		let nickname = ctx.request.query.un
		let password = ctx.request.query.ps

		if (nickname && password) {

			await userdao.create(nickname, password)
			ctx.body = jsonPackage({})

		} else {
			throw new Error('check params @ un || ps')
		}
	} catch (err) {
		let res = {}
		res = jsonPackage(res)
		res.status = 500
		res.errmsg = err.message
		ctx.body = res
	}
})

router.get('/history', async (ctx) => {
	try	{
		let res = {}
		let id = ctx.request.query.hid
		let userid = ctx.request.query.uid
		let novelid = ctx.request.query.nid
		let chapter = ctx.request.query.cnum

		let _o = {userid, novelid, chapter}
		if (id && userid && novelid && chapter) {

			console.log('update')
			await historydao.update(id, _o)
			res = jsonPackage({})
			ctx.body = res

		} else if (userid && novelid && chapter) {

			console.log('create')
			await historydao.create(_o)
			res = jsonPackage({})
			ctx.body = res

		} else {
			throw new Error('@params uid||nid||cnum')
		}
		// await err_res(err, ctx)
	} catch (err) {
		await err_res(err, ctx, historyExample, historyExample2)
	}
})

let historyExample = `${h}`+ '/api/user/history?uid=1&nid=1&cnum=1&hid=1'
let historyExample2 = `${h}`+ '/api/user/history?uid=1&nid=1&cnum=1'

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

async function err_res (err, ctx, ...arg) {
	let res = {}
	res = jsonPackage(res)
	res.status = 404
	res.errmsg = err.message
	let example = []
	for(let k in arg) {
		example.push(arg[k])
	}
	res.example = example
	ctx.body = res
}

module.exports = router