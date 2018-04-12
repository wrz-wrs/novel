const Model = require('../db/model')

class NovelDao {
	constructor () {
		//super()
	}

	/*
	* @params info(json)
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
				let name = arg
				novel = await Model.Novel.findOne({
					where: {
						name,
					},
					// attributes: ['nickname','password'],
				})
			}
			if (typeof arg == 'number') {
				let id = arg
				novel = await Model.Novel.findOne({
					where: {
						id,
					}
				})
			}
			if (!novel) {
				return null
			} else {
				return novel.dataValues
			}
		} catch (err) {
			throw new Error(err.message)
		}
	}

}

module.exports = new NovelDao()