const Cha = require('../models/chapter')


var chapter = new Cha()

var cc = async function() {
	var s = await chapter.init('http://www.biqugezw.com/9_9767/1890292.html')
	console.log(s)
}

cc()