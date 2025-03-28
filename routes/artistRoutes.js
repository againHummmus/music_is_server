const Router = require('express')
const router = new Router()
const artistController = require('../controllers/artistController')
const AdminMiddleware = require('../middlewares/adminMiddleware');

router.post('/', AdminMiddleware, artistController.create)
router.get('/', artistController.getAll)
router.get('/:id', artistController.getOne)
router.get('/name/:name', artistController.getOneByName)

module.exports = router
