const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleWare/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/:id', userController.getOne)
router.put('/:id', userController.updateOne)
router.delete('/:id', userController.delete)
router.get('/check/auth', authMiddleware, userController.check)

module.exports = router