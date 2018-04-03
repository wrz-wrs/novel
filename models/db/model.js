const sequelize = require('./index')
const Sequelize = require('sequelize')

const User = sequelize.define('users', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	nickname: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	},
	password:{
		type: Sequelize.STRING,
		allowNull: false
	},
	createdAt: Sequelize.DATE,
	updatedAt: false,
})

const History = sequelize.define('historys', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true
	},
	userid: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: User,
			key: 'id'
		}
	},
	novel: {
		type: Sequelize.STRING,
		allowNull: false
	},
	chapter: {
		type: Sequelize.INTEGER,
		allowNull: false
	}
})

// 创建history表
// History.sync()
// 强制同步模型
// History.sync({force: true})

// 同步所有尚未在数据库中的模型
// sequelize.sync()

const Model = {
	User,
	History,
}
module.exports = Model