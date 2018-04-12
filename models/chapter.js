const entities = require("entities")
const cheerio = require('cheerio')
const fs = require('fs')

const conf = require('../conf')
const Website = require('./website')
const noveldao = require('./dao/noveldao')
const novel = require('./novel')

/*
* 1.检查文件是否存在
* 2.
*
*/
class getChapter extends Website{

	constructor() {
        super()
	}

	async init (url, ...arg) {
		

		this._init2(url)

		if (this.siteName) {
			let chapterContent = await this._gethtml()
			let chapterJson = this.analysisContent(chapterContent)
			if (arg) {
				// arg存在时缓存文件
				this.__saveJson(arg[0], arg[1], chapterJson)
			}
			return chapterJson
		} else {
			throw new Error('class: Chapter->method: init->无法解析')
		}
	}

	async _load (name, num) {
		let a = noveldao.findOne(name)
		if (!a) {
			throw new Error('class: Chapter->method: _load->select 0')
		} else {

			// 服务器是否已经有缓存文件
			let content = this.__read(name, num)
			if (content) {
				console.log('缓存文件')
				return content
			} else {
				let chas = this.info(name)
				let url = chas.novjson[num].url
				console.log(url+'??????????/')
				return this.init(url, name, num)
			}
		}
	}

	info (novelName) {

		let path = conf.save_novjson_path

		let filepath = `${path}/${novelName}/index.json`

		if (fs.existsSync(filepath)) {

			let json = fs.readFileSync(filepath)
			json = JSON.parse(json)

			return json
		} else {
			throw new Error('class: Chapter->method: load->not find')
		}
	}

	__saveJson (novelName, num, txt) {

		let path = conf.save_novjson_path
		let _num = parseInt(num / 100)
		// let _remainder = num % 100

		let filepath = `${path}/${novelName}/${_num.toString()}.json`
		let content = {}
		if (fs.existsSync(filepath)) {
			content = require(filepath)
			content[num] = txt
		} else {
			content[num] = txt
		}
		fs.writeFileSync(filepath, JSON.stringify(content))
	}


	__read (novelName, num) {
		let path = conf.save_novjson_path
		let _num = parseInt(num / 100)
		let _remainder = num % 100
		let filepath = `${path}/${novelName}/${_num.toString()}.json`
		let content = {}
		if (fs.existsSync(filepath)) {
			content = require(filepath)
			if (content[num] == '') {
				return false
			} else {
				return content[num]
			}
		} else {
			return false
		}
	}
}

module.exports = new getChapter()