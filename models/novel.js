const cheerio = require('cheerio')
const iconv   = require('iconv-lite')
const entities = require("entities")
const http = require('http')
const fs = require('fs')
const conf = require('../conf')

const gethtml = require('./_get')
const website = require('./website')

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

class Novel {

	constructor () {
        // super()
	}

	async init (url, novelName = this.time()) {

		let site = website.analysisUrl(url)
		let code = website.getCode(site)

		console.log(site)
		let timeStamp = this.loadTimeStamp(novelName)

		if (this.isUpdate(timeStamp) && site) {

			let chaptersHtml = await gethtml.getBody(url, code)

			let chaptersJson = website.analysisChapter(site, chaptersHtml)

			console.log(chaptersJson)

			// this.saveJson(chaptersJson, novelName)
			
		} else {
			console.log(`24小时后更新...`)
		}
	}

	saveJson (json = {}, name = 'default') {

		let _json = {
			updateTime: this.time(),
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