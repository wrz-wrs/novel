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

	async findAll (...arg) {
		let novels = {}
		if (arg[0] == '') {
			novels = await Model.Novel.findAll({
				limit: arg[1],
				offset: arg[2],
			})
		} else {
			novels = await Model.Novel.findAll({
				where: {
					type: arg[0],
				},
				limit: arg[1],
				offset: arg[2],
			})
		}

		let result = []
		for(let key in novels) {
			result.push(novels[key].dataValues)
		}
		return result
	}
}

module.exports = new NovelDao()