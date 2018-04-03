const router = require('koa-router')()

const doc = require('./doc')
const post = require('./post')
const novel = require('./novel')

router.use('/doc', doc.routes(), doc.allowedMethods())

router.use('/post', post.routes(), post.allowedMethods())

router.use('/novel', novel.routes(), novel.allowedMethods())

module.exports = router