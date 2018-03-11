const entities = require("entities")
const cheerio = require('cheerio')
const GetHTML = require('./_get')
const fs = require('fs')

const conf = require('../conf')

const gethtml = new GetHTML()

const get = function () {
	const o = {}

	o.init = async function (url) {
		
		console.log(url)
		
		let chapterContent = await gethtml.getBody(url, 'gbk')

		let chapterJson = o.analysisContent(chapterContent)

		return chapterJson

	}

	o.analysisContent = function (content) {
		// entities.decodeXML()

		const $ = cheerio.load(content)

		var oldContent = $('#content').html()

		oldContent = oldContent.replace(/[\r\n]/g, '')

		var contentList = oldContent.split('<br>')
		var newContent = []

		contentList.forEach(function (v) {
			if (v != '') {
				newContent.push(entities.decodeXML(v))
			}
		})

		var json = {
			'dataArray': newContent,
		}

		return json
	}

	o.load = function (novelName) {

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

	return o 
}

module.exports = get