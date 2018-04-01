const chapter = require('../models/chapter')


var cc = async function() {
	try	{
		var s = await chapter.init('http://www.23us.so/files/article/html/15/15610/8053887.html')
		console.log(s)
	} catch (err) {
		console.log(err)
	}
}

cc()