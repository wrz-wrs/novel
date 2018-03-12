const router = require('koa-router')()

const home = require('./home')
const art = require('./art')
const post = require('./post')


router.use('/', home.routes(), home.allowedMethods())

router.use('/a', art.routes(), art.allowedMethods())

router.use('/post', post.routes(), post.allowedMethods())


module.exports = router