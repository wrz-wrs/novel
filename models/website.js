/*
 * 定义不同站点的解析方式
 */

const cheerio = require('cheerio')
const iconv   = require('iconv-lite')
const entities = require("entities")

const biqugezw = {

	code: 'gbk',

	host: 'http://www.biqugezw.com',

	analysisChapter: function (content) {

		const $ = cheerio.load(content)

		var list = []
		$('#list dl dd a').each( function (i, elem) {
			list[i] = {
				'serial': $(this).text(),
				'url': $(this).attr('href')
			}
		})

		var json = {}
		list.forEach( function (value, key) {
			json[key] = value
		})

		return json
	},

	analysisContent: function (content) {
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
}

const us23 = {
	code: 'utf8',

	host: 'http://www.23us.so',

	analysisChapter: function (content) {

		const $ = cheerio.load(content)
		
		let list = []

		$('#at tbody tr td a').each( function (i, elem) {
			list[i] = {
				'serial': $(this).text(),
				'url': $(this).attr('href')
			}
		})

		var json = {}
		list.forEach( function (value, key) {
			json[key] = value
		})

		return json
	},

	analysisContent: function (content) {
		const $ = cheerio.load(content)

		var oldContent = $('#content').html()

		oldContent = oldContent.replace(/[\r\n]/g, '')

		var contentList = oldContent.split('<br>')
		var newContent = []

		contentList.forEach(function (v) {
			if (v != '') {
				newContent.push(v)
			}
		})

		var json = {
			'dataArray': newContent,
		}

		return json
	},
}


class Website {
	constructor () {
		this.site = {
			'biqugezw': biqugezw,
			'23us': us23,
		}
	}

	analysisChapter (siteName, content) {
		return this.site[siteName].analysisChapter(content)
	}

	analysisContent (siteName, content) {
		return this.site[siteName].analysisContent(content)
	}

	analysisUrl (host) {
		try	{
			host = (host.match(/www\.(.*?)\./gi))[0]  // return www.***.
			host = host.replace(/www\./gi, '').replace(/\./gi, '')
			if (typeof this.site[host] == 'object') {
				return host
			} else {
				console.log('暂时无法解析此网站')
				return false
			}
		} catch (err) {
			
		}
	}

	/*
	* 默认站点 this.site[0].host
	* @param url /9_9767/1890292.html
	*/
	autoChangeSite (url) {
		let list = []

		for(var key in this.site) {
			list.push(this.site[key].host)
		}

		return list[0] + url
	}

	getCode (siteName) {
		return this.site[siteName].code
	}
}


module.exports = new Website()