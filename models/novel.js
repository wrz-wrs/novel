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
* 1 默认初始化小说 json文件 保存章节信息
* 
*/

class Novel extends Website{

	constructor () {
        super()
	}

	async init (url, novelName = this.time()) {

		this._init(url)

		let timeStamp = this.loadTimeStamp(novelName)

		if (this.isUpdate(timeStamp) && this.siteName) {

			let chaptersHtml = await this._gethtml()
			let chaptersJson = this.analysisChapter(chaptersHtml)
			this.saveJson(chaptersJson, novelName, url)
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

	saveHtml (content, name = 'default') {
		console.log(content)
		let path = conf.save_novjson_path
		fs.writeFileSync(`${path}/${name}.html`, content.toString())
	}

	saveJson (json = {}, name = 'default', website) {

		let _json = {
			updateTime: this.time(),
			name: name,
			website: website,
			author: '',
			novjson: json,
		}

		let path = conf.save_novjson_path

		console.log(`saveJson method param----path:${path}`)

		fs.writeFileSync(`${path}/${name}.json`, JSON.stringify(_json))
	}

	time () {

		let date = new Date()

		return date.getTime()
	}

	isUpdate (t) {

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

	checkFile (filename) {
		let path = conf.save_novjson_path
		if (fs.existsSync(`${path}/${filename}.json`)) {
			return true
		} else {
			return false
		}
	}

	loadTimeStamp (filename) {

		let path = conf.save_novjson_path

		let fliepath = `${path}/${filename}.json`

		if (fs.existsSync(`${path}/${filename}.json`)) {

			let json = fs.readFileSync(fliepath)

			json = json.toString()

			// console.log(JSON.parse(json).updateTime)

			return JSON.parse(json).updateTime

		} else {
			return ''
		}
	}
}

module.exports = new Novel()