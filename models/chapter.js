const entities = require("entities")
const cheerio = require('cheerio')
const fs = require('fs')

const conf = require('../conf')
const Website = require('./website')

class getChapter extends Website{

	constructor() {
        super()
	}

	async init (url) {
		
		this._init2(url)

		if (this.siteName) {
			let chapterContent = await this._gethtml()
			let chapterJson = this.analysisContent(chapterContent)

			return chapterJson
		} else {
			throw new Error('无法解析')
		}
	}

	load (novelName) {

		let path = conf.save_novjson_path

		let fliepath = `${path}/${novelName}.json`

		if (fs.existsSync(fliepath)) {

			let json = fs.readFileSync(fliepath)
			json = JSON.parse(json)

			return json
		} else {
			return false
		}
	}
}

module.exports = new getChapter()