const router = require('koa-router')()

const h = require('../../conf').h
const novel = require('../../models/novel')
const chapter = require('../../models/chapter')
const noveldao = require('../../models/dao/noveldao')
const tagsdao = require('../../models/dao/tagsdao')

// select novel
router.get('/', async (ctx) => {
	try {

		let novelname = ctx.request.query.an
		let chapterNumber = ctx.request.query.cn
		let res = {}

		if (!novelname) {
			res.status = 400
			res.errmsg = 'argument is err'
			delete res.data
			ctx.body = res
		} else {

			let json = chapter.load(novelname)
			let name = json.name
			let website = json.website
			let author = json.author
			let timeStamp = json.updateTime
			let _o = {
				timeStamp,
				name,
				website,
				author,
			}

			if (chapterNumber) {

				_o.title = json.novjson[chapterNumber].serial
				let chapterUrl = json.novjson[chapterNumber].url
				_o.content = await chapter.init(chapterUrl)

			} else {
				_o.content = json.novjson
			}

			res = jsonPackage(_o)
			res.example = `${h}/api/novel?an=放开那个女巫&cn=1`
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

		if (name && cover && source) {
			let _o = {name, author, cover, source}
			let _mes = await novel.init(source, name) // 保存chapters的json文件
			await noveldao.create(_o) // 信息写入到数据库

			res = jsonPackage(res)
			res.data = _mes
			ctx.body = res
		} else {
			res = jsonPackage(res)
			res.status = 404
			res.errmsg = 'check @params an||author||cover||index'
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
		await err_res(err, ctx)
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

let createExample = `${h}`+
'/api/novel/create?an=放开那个女巫&author=二目&cover=http://www.23us.so/files/article/image/14/14220/14220s.jpg&index=http://www.23us.so/files/article/html/14/14220/index.html';
let tagsExample = `${h}`+
'/api/novel/tags?novelid=1&tagname=魔法&userid=1'

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

async function err_res (err, ctx) {
	let res = {}
	res = jsonPackage(res)
	res.status = 404
	res.errmsg = err.message
	res.example = tagsExample
	ctx.body = res
}

module.exports = router