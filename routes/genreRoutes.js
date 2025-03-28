const Router = require('express')
const router = new Router()
const genreController = require('../controllers/genreController')
const AdminMiddleware = require('../middlewares/adminMiddleware');

router.post('/', AdminMiddleware, genreController.create)
router.get('/', genreController.getAll)
router.get('/:id', genreController.getOne)
router.get('/name/:name', genreController.getOneByName)


module.exports = router
