const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')

router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)
router.post('/signout', userController.signOut)
router.get('/user', userController.getUser)
router.post('/reset-password', userController.resetPassword)
router.post('/update-password', userController.updatePassword)

module.exports = router