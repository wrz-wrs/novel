const entities = require("entities")
const cheerio = require('cheerio')
const fs = require('fs')

const conf = require('../conf')
const gethtml = require('./_get')
const website = require('./website')

class getChapter extends website{

	constructor() {
        super()
	}

	async init (url) {
		
		this._init2(url)

		if (this.siteName) {
			let chapterContent = await this._gethtml()
			let chapterJson = this.analysisContent(chapterContent)

			return chapterJson
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