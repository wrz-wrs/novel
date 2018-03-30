const chapter = require('../models/chapter')


var cc = async function() {
	try	{
		var s = await chapter.init('/9_9767/1890292.html')
		console.log(s)
	} catch (err) {
		console.log(err)
	}
}

cc()