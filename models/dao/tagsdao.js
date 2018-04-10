const Model = require('../db/model')

class TagsDao {
	constructor () {
		// super()
	}

	async create (arg) {
		await Model.Tags.create(arg)
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
				return {}
			} else {
				return tag.dataValues
			}
		} catch (e) {
			console.log(e)
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

	async findAll () {
		let tags = await Model.Tags.findAll({
			// attributes: ['nickname','password']
		})

		let result = []
		for(let key in tags) {
			result.push(tags[key].dataValues)
		}
		return result
	}
}

module.exports = new TagsDao()