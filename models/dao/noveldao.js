const Model = require('../db/model')

class NovelDao {
	constructor () {
		//super()
	}

	/*
	* @param info(json)
	*/
	async create (info) {
		try {
			await Model.Novel.create(info)
		} catch (err) {
			throw new Error(err.message)
		}
	}

	async findOne (arg) {
		try {

			let novel = {}
			if (typeof arg == 'string') {
				let nickname = arg
				novel = await Model.User.findOne({
					where: {
						nickname,
					},
					// attributes: ['nickname','password'],
				})
			}
			if (typeof arg == 'number') {
				let id = arg
				novel = await Model.User.findOne({
					where: {
						id,
					}
				})
			}
			if (!novel) {
				return {}
			} else {
				return novel.dataValues
			}
		} catch (err) {
			throw new Error(err.message)
		}
	}

}

module.exports = new NovelDao()