const cheerio = require('cheerio')
const iconv   = require('iconv-lite')
const entities = require("entities")
const http = require('http')
const fs = require('fs')
const conf = require('../conf')

const gethtml = require('./_get')
const Website = require('./website')

const options = {
	'url': 'http://www.biqugezw.com/9_9767/',
	'headers':{
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0',
		'Host': 'www.biqugezw.com',
		'Referer': 'www.biqugezw.com',
	},
}


/*
* 下面的方法都是私有方法
*
*/
function _saveHtml (content, name = 'default') {
	console.log(content)
	let path = conf.save_novjson_path
	fs.writeFileSync(`${path}/${name}.html`, content.toString())
}

function _saveJson (json = {}, name = 'default', website) {

	try	{
		let _json = {
			updateTime: _time(),
			name: name,
			website: website,
			author: '',
			novjson: json,
		}

		let path = conf.save_novjson_path

		console.log(`saveJson method param----path:${path}`)

		if (!fs.existsSync(`${path}/${name}/`)) {
			fs.mkdirSync(`${path}/${name}/`)
		}

		fs.writeFileSync(`${path}/${name}/index.json`, JSON.stringify(_json))
	} catch (err) {
		throw new Error(err.message)
	}
}

function _time () {

	let date = new Date()

	return date.getTime()
}

function _isUpdate (t) {

	if (t == '') {
		return true
	}

	let oldDate = new Date(t)
	let nowDate = new Date()
	let n_s = nowDate.getTime() - oldDate
	let day = Math.floor(n_s / (24*3600*1000))

	// let s = n_s % (24*3600*1000)    //计算天数后剩余的毫秒数

	// let hours = Math.floor(s / (3600*1000))

	// if (nowDate.getTime() > oldDate.getTime() ) {
	// }
	if (day > 0) {
		return true
	} else {
		return false
	}
}

function _checkFile (filename) {
	let path = conf.save_novjson_path
	if (fs.existsSync(`${path}/${filename}.json`)) {
		return true
	} else {
		return false
	}
}

function _loadTimeStamp (filename) {

	let path = conf.save_novjson_path
	let fliepath = `${path}/${filename}/index.json`

	if (fs.existsSync(fliepath)) {

		let json = fs.readFileSync(fliepath)
		json = json.toString()
		// console.log(JSON.parse(json).updateTime)
		return JSON.parse(json).updateTime

	} else {
		return ''
	}
}

/*
* 私有方法over
*/


/*
* 1 默认初始化小说 json文件 保存章节信息
* 
*/

class Novel extends Website{

	constructor () {
        super()
	}

	async init (url, novelName = _time()) {

		this._init(url)

		let timeStamp = _loadTimeStamp(novelName)

		if (_isUpdate(timeStamp) && this.siteName) {

			let chaptersHtml = await this.gethtml()
			let chaptersJson = this.analysisChapter(chaptersHtml)
			_saveJson(chaptersJson, novelName, url)
			// callback()
			return '创建成功'
		} else {
			console.log(`24小时后更新...`)
			return '24小时后更新...'
		}
	}

	async search (nn) {
		this._init3('23us')

		let result = await this._search(nn)

		return result
	}

}

module.exports = new Novel()