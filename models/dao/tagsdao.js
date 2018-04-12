const Model = require('../db/model')

class TagsDao {
	constructor () {
		// super()
	}

	async create (arg) {
		try	{
			await Model.Tags.create(arg)
		} catch (err) {
			console.log(err.message)
			throw new Error(err.message)
		}
	}


	async findOrCreate (arg) {
		try {
			if ((typeof arg) != 'object') {
				throw new Error(`class Tags->findOrCreate @param is not json`)
			} else {
				await Model.Tags.findOrCreate({where: arg})
			}
		} catch (err) {
			throw new Error(err.message)
		}
	}


	async findOne (arg) {
		try {

			let tag = {}
			if (typeof arg == 'string') {
				let tagname = arg
				tag = await Model.Tags.findOne({
					where: {
						tagname,
					},
					// attributes: ['nickname','password'],
				})
			}
			if (typeof arg == 'number') {
				let id = arg
				tag = await Model.Tags.findOne({
					where: {
						id,
					}
				})
			}
			if (!tag) {
				throw new Error(`${arg} not find`)
			} else {
				return tag.dataValues
			}
		} catch (err) {
			throw new Error(err.message)
		}

	}

	//////////
	async findOneByID (id) {
		let tag = await Model.Tags.findOne({
			where: {
				id,
			}
		})
		return tag.dataValues
	}

	async findOneByName (name) {
		let tag = await Model.Tags.findOne({
			where: {
				tagname: name
			}
		})
		return tag.dataValues
	}

	async findAll (...arg) {
		let tags = {}
		if (arg[0] == '') {
			tags = await Model.Tags.findAll({
				limit: arg[1] || 10,
				offset: arg[2] || 0,
			})
		} else {
			tags = await Model.Tags.findAll({
				where: {
					tagname: arg[0],
				},
				limit: arg[1] || 10,
				offset: arg[2] || 0,
			})
		}

		let result = []
		for(let key in tags) {
			result.push(tags[key].dataValues)
		}
		return result
	}
}

module.exports = new TagsDao()