const Model = require('../db/model')

class HistoryDao {
	constructor () {
		//super()
	}

	/*
	* @params arg(json)
	*/
	async create (arg) {
		try {

			await Model.History.create(arg)
		} catch (err) {
			throw new Error(err.message)
		}
	}

	async update (id, arg) {
		try {
			await Model.History.update({
					userid: arg.userid,
					novelid: arg.novelid,
					chapter: arg.chapter,
				},{
					where: {
						id,
					},
				})
		} catch (err) {
			throw new Error(err.message)
		}
	}

	async findAll (arg) {
		let user = {}
		if (!arg) {
			historys = await Model.History.findAll()
		} else {
			historys = await Model.History.findAll({
				where: {
					userid: arg
				}
			})
		}
		if (!historys) {
			return {}
		} else {
			return historys.dataValues
		}
	}
}

module.exports = new HistoryDao()