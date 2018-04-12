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
}

module.exports = new HistoryDao()