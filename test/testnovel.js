const novel = require('../models/novel')


var cc = async function() {
	try	{
		await novel.init('http://www.23us.so/files/article/html/14/14220/index.html', '放开那个女巫')
		await novel.init('http://www.23us.so/files/article/html/15/15610/index.html', '某御坂妹')
		// console.log(s)
	} catch (err) {
		console.log(err)
	}
}

cc()
/*
{
	"updateTime":1520684137324,
	"novjson":{
		"0":{"serial":"第一章 从今天开始做王子","url":"/9_9767/1890292.html"},
		"1":{"serial":"第二章 女巫安娜（上）","url":"/9_9767/1890293.html"},
		"2":{"serial":"第三章 女巫安娜（下）","url":"/9_9767/1890294.html"},
		"3":{"serial":"第四章 火焰","url":"/9_9767/1890295.html"},
		"4":{"serial":"第五章 理由","url":"/9_9767/1890296.html"},
		"5":{"serial":"第六章 训练（上）","url":"/9_9767/1890297.html"},
		"6":{"serial":"第七章 训练（下）","url":"/9_9767/1890298.html"}，
		.....
	}
}
*/