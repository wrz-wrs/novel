const router 	= require('koa-router')()

const h 		= require('../../conf').h
const novel 	= require('../../models/novel')
const chapter 	= require('../../models/chapter')
const noveldao 	= require('../../models/dao/noveldao')
const tagsdao 	= require('../../models/dao/tagsdao')

// select novel
router.get('/info', async (ctx) => {
	try {

		let novelname = ctx.request.query.an
		let res = {}

		if (!novelname) {
			res.status = 400
			res.errmsg = 'argument is err'
			delete res.data
			ctx.body = res
		} else {

			let json = await noveldao.findOne(novelname)
			let update = await novel.init(json.source, json.name)
			let _o = {
				update: update,
				name: 	json.name,
				author: json.author,
				cover: 	json.cover,
				type: 	json.type,
				source: json.source,
			}

			res = jsonPackage(_o)
			res.example = `${h}/api/novel/info?an=放开那个女巫`
			ctx.body = res
		}
	} catch (err) {
		console.log(err)
		ctx.body = err.message
	}
})

router.get('/search', async (ctx) => {
	try {
		let res = {}
		let an = ctx.request.query.an
		if (an) {
			let result = await novel.search(an)
			res = jsonPackage({result})
			ctx.body = res
		} else {
			throw new Error('argument an is null')
		}
	} catch (err) {
		await err_res(err, ctx)
	}
})

router.get('/create', async (ctx) => {
	try {
		let res = {}
		let name = ctx.request.query.an
		let author = ctx.request.query.author || '佚名'
		let cover = ctx.request.query.cover
		let source = ctx.request.query.index
		let type = ctx.request.query.type

		if (name && cover && source && type) {
			let _o = {name, author, cover, source, type}
			let _mes = await novel.init(source, name) // 保存chapters的json文件
			await noveldao.create(_o) // 信息写入到数据库

			res = jsonPackage(res)
			res.data = _mes
			ctx.body = res
		} else {
			res = jsonPackage(res)
			res.status = 404
			res.errmsg = '@params an||author||cover||index||type'
			res.example = createExample
			ctx.body = res
		}
	} catch (err) {
		await err_res(err, ctx)
	}
})

router.get('/tags', async (ctx) => {
	try {
		let res = {}
		let novelid = ctx.request.query.novelid
		let tagname = ctx.request.query.tagname
		let userid = ctx.request.query.userid

		if (novelid && tagname && userid) {
			let _tag = {tagname, novelid, userid}
			// ***** create tags
			await tagsdao.findOrCreate(_tag)
			res = jsonPackage(res)
			res.example = tagsExample
			ctx.body = res
		} else {
			res = jsonPackage(res)
			res.status = 404
			res.errmsg = 'check @params tagname||novelid||userid'
			res.example = tagsExample
			ctx.body = res
		}
	} catch (err) {
		await err_res(err, ctx, tagsExample)
	}
})

router.get('/list', async (ctx) => {
	try {
		let res = {}
		let type = ctx.request.query.type
		let limit = ctx.request.query.limit || 10
		let offset = ctx.request.query.offset || 0

		if (!type) {
			res = await noveldao.findAll('', limit, offset)
		} else {
			res = await noveldao.findAll(type, limit, offset)
		}
		res = jsonPackage(res)
		ctx.body = res
	} catch (err) {
		err_res(err, ctx)
	}
})

router.get('/searchTag', async (ctx) => {
	try {
		// throw new Error('??????')
		let res = {}
		let tagname = ctx.request.query.tagname
		let limit = ctx.request.query.limit
		let offset = ctx.request.query.offset
		console.log(typeof tagname)
		if (tagname && limit && offset) {
			res = await tagsdao.findAll(tagname, limit, offset)
		}
		if (!tagname && limit && offset) {
			res = await tagsdao.findAll('', limit, offset)
		}
		if (!tagname && !limit && !offset) {
			throw new Error('must need params limit and offset')
		}

		res = jsonPackage(res)
		res.example = ''
		ctx.body = res
	} catch (err) {
		await err_res(err, ctx)
	}
})

router.get('/read', async (ctx) => {
	try {
		let res = {}
		let an = ctx.request.query.an
		let chaNum = ctx.request.query.cno
		if (!an || !chaNum) {
			throw new Error('@params an cno')
		} else {
			// chapterContent => cc
			let cc = await chapter._load(an, chaNum)
			res = jsonPackage(cc)
			ctx.body = res
		}
	} catch (err) {
		await err_res(err, ctx, readExample)
	}
})

let createExample = `${h}`+
'/api/novel/create?an=放开那个女巫&author=二目&cover=http://www.23us.so/files/article/image/14/14220/14220s.jpg&index=http://www.23us.so/files/article/html/14/14220/index.html';
let tagsExample = `${h}`+
'/api/novel/tags?novelid=1&tagname=魔法&userid=1'
let readExample1 = `${h}`+
'/api/novel/tags?novelid=1&tagname=放开那个女巫&cno=1'

let readExample = `${h}`+'/api/novel/read?an=放开那个女巫&cno=1'

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
		example: [
				`${h}/api/novel?an=放开那个女巫`,
				`${h}/api/novel?an=放开那个女巫&cn=1`
			],
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