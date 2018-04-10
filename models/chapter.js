const entities = require("entities")
const cheerio = require('cheerio')
const fs = require('fs')

const conf = require('../conf')
const Website = require('./website')
const noveldao = require('./dao/noveldao')
const novel = require('./novel')

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
				this.__saveJson(arg[0], arg[1])
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
			let content = read(name, num)
			if (content) {
				return content
			} else {
				let chas = this.load(name)
				let url = chas.novjson[num].url
				return this.init(url, )
			}
		}
	}

	load (novelName) {

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
		let _remainder = num % 100

		let filepath = `${path}/${novelName}/${_num.toString()}.json`
		let content = {}
		if (fs.existsSync(filepath)) {
			content = require(filepath)
			content[num] = txt
		} else {
			if (_num < 1) {
				for (let i = 1; i < num; i++) {
					content[i] = ""
				}
			} else {
				for (let i = 1; i < _remainder; i++) {
					let n = _num * 100 + i
					content[i] = ""
				}
			}
		}
		fs.writeFileSync(filepath, JSON.stringify(content))
	}


	read (novelName, num) {
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