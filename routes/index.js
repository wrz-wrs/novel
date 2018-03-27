const router = require('koa-router')()

const home = require('./home')
const art = require('./art')
const post = require('./post')

const api = require('./api/index')


router.use('/', home.routes(), home.allowedMethods())

router.use('/a', art.routes(), art.allowedMethods())

router.use('/post', post.routes(), post.allowedMethods())

router.use('/api', api.routes(), api.allowedMethods())


module.exports = router