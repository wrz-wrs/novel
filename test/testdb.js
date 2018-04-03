const Model = require('../models/db/model')

// User.findAll().then(user => {
//   console.log(user[0].dataValues.nickname)
// })

// Model.User.create({
//     nickname: 'admin',
//     password: '123456'
//   });

async function cc() {
	let o = await Model.User.findAll({attributes:['nickname','password']})
	for(var key in o) {
		console.log(o[key].dataValues)
	}
}

cc()