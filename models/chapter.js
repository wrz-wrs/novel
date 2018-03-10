const entities = require("entities")
const cheerio = require('cheerio')
const GetHTML = require('./_get')

const gethtml = new GetHTML()

const get = function () {
	const o = {}

	o.init = async function (url) {
		
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

	return o 
}

module.exports = get