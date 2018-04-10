const router = require('koa-router')()

const doc = require('./doc')
const post = require('./post')
const novel = require('./novel')
const user = require('./user')

router.use('/doc', doc.routes(), doc.allowedMethods())

router.use('/post', post.routes(), post.allowedMethods())

router.use('/novel', novel.routes(), novel.allowedMethods())

router.use('/user', user.routes(), user.allowedMethods())

module.exports = router