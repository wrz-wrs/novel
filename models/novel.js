const cheerio = require('cheerio')
const iconv   = require('iconv-lite')
const entities = require("entities")
const http = require('http')
const fs = require('fs')

const conf = require('../conf')

const options = {
	'url': 'http://www.biqugezw.com/9_9767/',
	'headers':{
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0',
		'Host': 'www.biqugezw.com',
		'Referer': 'www.biqugezw.com',
	},
}

/*
* 1 默认初始化小说 json文件 保存章节信息
* 
*/

const novel = function () {
	const _ = {}

	_.init = async function (url, novelName = _.time()) {

		let timeStamp = _.loadTimeStamp(novelName)

		if (_.isUpdate(timeStamp)) {

			let chaptersHtml = await _.getBody(url, 'gbk')

			let chaptersJson = _.analysisChapter(chaptersHtml)

			_.saveJson(chaptersJson, novelName)
			
		} else {
			console.log(`24小时后更新...`)
		}


		// console.log(chaptersJson)
	}

	_.getBody = function (url, code) {
		var body = ''
		return new Promise( function (resolve, reject) {
			http.get(url, function (res) {
				var chunks = []
				res.on('data', function(chunk){
					chunks.push(chunk);
				})

				res.on('end', function(){
					body = iconv.decode(Buffer.concat(chunks), code)
					resolve(body)

				})
			})
		})
	}

	_.analysisChapter = function (content) {
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

	_.saveJson = function (json = {}, name = 'default') {

		let _json = {
			updateTime: _.time(),
			novjson: json,
		}

		let path = conf.save_novjson_path

		console.log(`saveJson method param----path:${path}`)

		fs.writeFileSync(`${path}/${name}.json`, JSON.stringify(_json))
	}

	_.time = function () {

		let date = new Date()

		return date.getTime()
	}

	_.isUpdate = function (t) {

		if (t == '') {

			return true
		}

		let oldDate = new Date(t)

		let nowDate = new Date()

		let n_s = nowDate.getTime() - oldDate

		let day = Math.floor(n_s / (24*3600*1000))

		// let s = n_s % (24*3600*1000)    //计算天数后剩余的毫秒数

		// let hours = Math.floor(s / (3600*1000))

		// if (nowDate.getTime() > oldDate.getTime() ) {
		// }
		if (day > 0) {

			return true
		} else {

			return false
		}
	}

	_.checkFile = function (filename) {
		let path = conf.save_novjson_path
		if (fs.existsSync(`${path}/${filename}.json`)) {
			return true
		} else {
			return false
		}
	}

	_.loadTimeStamp = function (filename) {

		let path = conf.save_novjson_path

		let fliepath = `${path}/${filename}.json`

		if (fs.existsSync(`${path}/${filename}.json`)) {

			let json = fs.readFileSync(fliepath)

			json = json.toString()

			// console.log(JSON.parse(json).updateTime)

			return JSON.parse(json).updateTime

		} else {
			return ''
		}
	}

	return _
}

module.exports = novel