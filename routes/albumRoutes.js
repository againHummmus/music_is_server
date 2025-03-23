const Router = require('express')
const router = new Router()
const albumController = require('../controllers/albumController')
const authMiddleware = require('../middlewares/authMiddleware')


router.post('/', authMiddleware, albumController.create)
router.get('/', albumController.getAll)
router.get('/:id', albumController.getOne)
router.get('/name/:name', albumController.getAlbumByName)
router.get('/artist/:artistId', albumController.getAlbumsByArtistId);

module.exports = router
