const router = require('koa-router')()

const post = require('./post')
const novel = require('./novel')

router.use('/post', post.routes(), post.allowedMethods())

router.use('/novel', novel.routes(), novel.allowedMethods())

module.exports = router