const Router = require('express')
const router = new Router()
const albumController = require('../controllers/albumController')


router.post('/', albumController.create)
router.get('/', albumController.getAll)
router.get('/:id', albumController.getOne)
router.get('/name/:name', albumController.getOneByName)

module.exports = router
