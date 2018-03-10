const router = require('koa-router')()

const home = require('./home')
const art = require('./art')


router.use('/', home.routes(), home.allowedMethods())

router.use('/a', art.routes(), art.allowedMethods())


module.exports = router