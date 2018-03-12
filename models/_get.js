const iconv   = require('iconv-lite')
const entities = require("entities")
const http = require('http')

const content = function () {
	const o = {}

	o.getBody = function (url, code) {
		return new Promise( function (resolve, reject) {
			var body = ''

			http.get(url, function (res) {
				var chunks = []
				res.on('data', function(chunk){
					chunks.push(chunk);
				})

				res.on('end', function(){

					switch(code) {
						case 'gbk':
							body = iconv.decode(Buffer.concat(chunks), code)
							break;
						default:
							body = Buffer.concat(chunks)
							break;
					}
					resolve(body)

				})
			})
		})
	}

	return o 
}

module.exports = content