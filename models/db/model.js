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
	headurl: {
		type: Sequelize.STRING,
		defaultValue: './img/defaulthead.jpg',
	},
	sex: {
		type: Sequelize.STRING,
		defaultValue: '♂♀'
	},
	info: {
		type: Sequelize.STRING
	},
	createdTime: Sequelize.DATE
}, {
	timestamps: false
})


const Novel = sequelize.define('novels', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	ntype: {
		type: Sequelize.STRING,
	},
	cover: {
		type: Sequelize.STRING,
	},
	author: {
		type: Sequelize.STRING,
	},
	source: {
		type: Sequelize.STRING,
	},
	type:{
		type: Sequelize.STRING,
	},
	isbn: {
		type: Sequelize.STRING,
	}
})

const Tags = sequelize.define('tags', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true
	},
	tagname: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	novelid: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: Novel,
			key: 'id'
		}
	},
	userid: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: User,
			key: 'id'
		}
	}
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
	novelid: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: Novel,
			key: 'id'
		}
	},
	chapter: {
		type: Sequelize.INTEGER,
		allowNull: false
	}
})

// 创建history表
// History.sync()
// 强制同步模型
// sequelize.sync({force: true})

// 同步所有尚未在数据库中的模型
// sequelize.sync()

const Model = {
	User,
	History,
	Novel,
	Tags,
}
module.exports = Model