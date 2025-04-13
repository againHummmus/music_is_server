const Router = require('express')
const router = new Router()
const genreController = require('../controllers/genreController')
const AdminMiddleware = require('../middlewares/adminMiddleware');

router.post('/', AdminMiddleware, genreController.create)
router.get('/', genreController.searchGenres)


module.exports = router
