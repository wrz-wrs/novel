/*
 * 定义不同站点的解析方式
 */

const cheerio = require('cheerio')
const iconv   = require('iconv-lite')
const entities = require("entities")
const request = require('superagent')
const http = require('http')

//Hm_lvt_e76a04e81c3547cd631a432ba2046367:1519989506
/*
 * 挂掉了 superagent
 */
const biqugezw = {

	code: 'gbk',

	host: 'http://www.biqugezw.com',

	analysisChapter: function (content) {

		const $ = cheerio.load(content)

		console.log($('#list'))
		var list = []
		$('.box-con #list dl dd a').each( function (i, elem) {
			list[i] = {
				'serial': $(this).text(),
				'url': $(this).attr('href')
			}
		})
		console.log(list[0])
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

	search: 'http://zhannei.baidu.com/cse/search?s=8053757951023821596&q=',

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

	analysisSearchResults: function (html) {

		let $ = cheerio.load(html)
		let resultsPic = []
		let results = []

		$('#results .result-list .result-game-item .result-game-item-pic').each( function (i, elem) {

			let cover = $(this).children().children().attr('src')
			let novelIndexUrl = $(this).children().attr('href')

			resultsPic.push({
				novelIndexUrl,
				cover,
			})
		})

		$('#results .result-list .result-game-item .result-game-item-detail').each( function (i, elem) {
			let title = $(this).children('.result-game-item-title').children('a').attr('title')
			let author = $(this).children('.result-game-item-info').children('p').first().children('span').last().text()
			let type = $(this).children('.result-game-item-info').children('p').eq(1).children('span').last().text()

			author = author.replace(/\s+/g, "")
			type = type.replace(/\s+/g, "")
			console.log(type)
			results.push({
				title,
				author,
				type,
				cover: resultsPic[i].cover,
				novelIndexUrl: resultsPic[i].novelIndexUrl,
			})
		})

		return results
	},

	analysisContent: function (content) {

		const $ = cheerio.load(content)
		var oldContent = $('#contents').html()
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
	},
}


class Website {
	constructor () {
		this.site = {
			'23us': us23,
			'biqugezw': biqugezw,
		}
		this.siteName = '' // 23us || biqugezw
		this.code = ''
		this.url = ''
		this.content = ''
	}

	gethtml () {
		let url = this.url
		let code = this.code
		return new Promise( function (resolve, reject) {
			var body = ''
			console.log('\n\n\n')
			console.log(`解析url：${url}`)
			console.log('\n\n\n')
			http.get(url, function (res) {
				var chunks = []
				res.on('data', function(chunk){
					chunks.push(chunk);
				})

				res.on('end', function(){

					switch(code) {
						case 'gbk':
							// console.log('is gbk')
							body = iconv.decode(Buffer.concat(chunks), code)
							break;
						default:
							body = Buffer.concat(chunks)
							body = body.toString()
							break;
					}
					resolve(body)
				})
			})
		})


		// request
		// 	.get(this.url)
	}

	// http://zhannei.baidu.com/cse/search?s=8053757951023821596&q=www

	/*
	*
	* @param nn string (novel name)
	*/
	async _search (nn) {
		this.url += nn
		this.url = encodeURI(this.url)
		let html = await this.gethtml()
		let result = this.site[this.siteName].analysisSearchResults(html)
		return result
	}


	_init (paramurl) {
		this.url = paramurl
		this.siteName = this._analysisUrl(this.url)
		this.code = this.site[this.siteName].code

		console.log(this.url)
	}

	_init2 (paramurl) {
		this.url = paramurl
		this.siteName = this._analysisUrl(paramurl)
		this.code = this.site[this.siteName].code
		// return this.code
	}

	_init3 (_site) {
		this.url = this.site[_site].search
		this.siteName = _site
		this.code = this.site[this.siteName].code
	}

	analysisChapter (content) {
		return this.site[this.siteName].analysisChapter(content)
	}

	analysisContent (content) {
		return this.site[this.siteName].analysisContent(content)
	}

	_analysisUrl (host) {
		try	{
			console.log(host)
			host = (host.match(/www\.(.*?)\./gi))[0]  // return www.***.
			host = host.replace(/www\./gi, '').replace(/\./gi, '')

			if (typeof this.site[host] == 'object') {
				return host
			} else {
				console.log('暂时无法解析此网站')
				throw new Error('Error Message: Website._analysisUrl() Error')
				return false
			}
		} catch (err) {
			console.log('?????????????????????')
			console.log(err)
		}
	}

	/*
	* 默认站点 this.site[0].host
	* @param url /9_9767/1890292.html
	*/
	_autoChangeSite (url) {
		let list = []

		for(var key in this.site) {
			list.push(this.site[key].host)
		}
		// console.log(list[0])
		// console.log(url)
		return list[0] + url
	}

	_getCode (siteName) {
		return this.site[siteName].code
	}
}


module.exports = Website