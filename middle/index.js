// const request = require('request')
const cheerio = require('cheerio')
const iconv   = require('iconv-lite')
const entities = require("entities")
const http = require('http')
const fs = require('fs')


const options = {
	'url': 'http://www.biqugezw.com/9_9767/',
	'headers':{
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0',
		'Host': 'www.biqugezw.com',
		'Referer': 'www.biqugezw.com',
	},
}

function saveJson (json = {}, name = 'default.json', path = __dirname) {
	console.log(`saveJson method param----path:${path}`)
	fs.writeFileSync(`${path}/${name}`, json)
}

var cra = function () {
	var o = {}

	/*
	* @public
	* @param url, name, 
	*/
	o._init = async function () {
		var chapters = await o._getBody(options.url)

		var json = o.analysisChapter(chapters)

		saveJson(JSON.stringify(json), '放开那个女巫.json')
	}

	o.init = async function (url) {

		var chapterContent = await o._getBody(url)

		var content = await o.analysisContent(chapterContent)

		return content
	}

	o._getBody = function (url) {
		var body = ''
		return new Promise( function (resolve, reject) {
			http.get(url, function (res) {
				var chunks = []
				res.on('data', function(chunk){
					chunks.push(chunk);
				})

				res.on('end', function(){
					body = iconv.decode(Buffer.concat(chunks), 'gbk')
					resolve(body)

				})
			})
		})
	}

	o.analysisChapter = function (content) {
		const $ = cheerio.load(content)

		var list = []

		$('#list dl dd a').each( function (i, elem) {
			list[i] = {
				'serial': $(this).text(),
				'url': $(this).attr('href')
			}
		})

		var json = {}

		list.forEach( function (v, k) {
			json[k] = v
		})

		return json
	}

	o.analysisContent = function (content) {
		// entities.decodeXML()

		return new Promise( (resolve, reject) => {

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

			resolve(json)
		})
	}

	return o
}


module.exports = cra