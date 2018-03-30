const entities = require("entities")
const cheerio = require('cheerio')
const fs = require('fs')

const conf = require('../conf')
const gethtml = require('./_get')
const website = require('./website')

class getChapter {

	constructor() {
        // super()
	}

	async init (url) {
		
		url = website.autoChangeSite(url)
		let site = website.analysisUrl(url)
		let code = website.getCode(site)

		if (site) {

			let chapterContent = await gethtml.getBody(url, code)

			let chapterJson = website.analysisContent(site, chapterContent)

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