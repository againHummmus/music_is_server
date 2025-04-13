const Router = require('express')
const router = new Router()
const albumController = require('../controllers/albumController')
const authMiddleware = require('../middlewares/authMiddleware')


router.post('/', authMiddleware, albumController.create)
router.get('/', albumController.searchAlbums)

module.exports = router
