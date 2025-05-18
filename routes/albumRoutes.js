const Router = require('express')
const router = new Router()
const albumController = require('../controllers/albumController')


router.post('/', albumController.create)
router.get('/', albumController.searchAlbums)

module.exports = router
