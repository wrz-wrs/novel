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
		var oldContent = $('#contents').html()
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
		this.siteName = ''
		this.code = ''
		this.url = ''
		this.content = ''
	}

	_gethtml () {
		let url = this.url
		let code = this.code
		return new Promise( function (resolve, reject) {
			var body = ''
			console.log(url)
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
	}

	_init (paramurl) {
		this.url = paramurl
		this.siteName = this._analysisUrl(this.url)
		this.code = this._getCode(this.siteName)

		console.log(this.url)
	}

	_init2 (paramurl) {
		this.url = paramurl
		this.siteName = this._analysisUrl(paramurl)
		this.code = this._getCode(this.siteName)
		// return this.code
	}

	analysisChapter (content) {
		return this.site[this.siteName].analysisChapter(content)
	}

	analysisContent (content) {
		return this.site[this.siteName].analysisContent(content)
	}

	_analysisUrl (host) {
		try	{
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