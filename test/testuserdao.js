const userdao = require('../models/dao/userdao')

// console.log()

async function cc(argument) {
	// console.log(await userdao.findAll())
	console.log(await userdao.findOne('admin'))
	// console.log(await userdao.findOneByID(1))
}

cc()