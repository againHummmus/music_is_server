const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const { body } = require('express-validator')

router.post('/signup', body('email').isEmail(), body('password').isLength({min: 4}), userController.signUp)
router.post('/signin', userController.signIn)
router.post('/signout', userController.signOut)
router.get('/:id', userController.getUser)
router.post('/update-password', userController.updatePassword)
router.get('/activate/:link', userController.activate)
router.post('/refresh', userController.refresh);

module.exports = router