const Model = require('../db/model')

class UserDao {
	constructor () {
		// super()
	}

	async create (nickname, password) {
		await Model.User.create({
			nickname,
			password,//加密？
		})
		return true
	}

	async update () {
		// await Model.User.
	}

	async findOne (arg) {
		try {

			let user = {}
			if (typeof arg == 'string') {
				let nickname = arg
				user = await Model.User.findOne({
					where: {
						nickname,
					},
					// attributes: ['nickname','password'],
				})
			}
			if (typeof arg == 'number') {
				let id = arg
				user = await Model.User.findOne({
					where: {
						id,
					}
				})
			}
			if (!user) {
				return {}
			} else {
				return user.dataValues
			}
		} catch (e) {
			console.log(e)
		}

	}

	//////////
	async findOneByID (id) {
		let user = await Model.User.findOne({
			where: {
				id,
			}
		})
		return user.dataValues
	}

	async findAll () {
		let users = await Model.User.findAll({
			// attributes: ['nickname','password']
		})

		let result = []
		for(let key in users) {
			result.push(users[key].dataValues)
		}
		return result
	}
}

module.exports = new UserDao()