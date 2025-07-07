const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const { body } = require('express-validator')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/signup', body('email').isEmail(), userController.signUp)
router.post('/signin', userController.signIn)
router.post('/signout', userController.signOut)
router.get('/', userController.searchUsers);
router.get('/:id(\\d+)', userController.getUser);
router.post('/update-password', userController.updatePassword)
router.get('/activate/:link', userController.activate)
router.post('/me', userController.me)
router.post('/refresh', userController.refresh);
router.patch(
  "/",
  authMiddleware,
  body("username").optional().isLength({ min: 3 }).withMessage("Username too short"),
  userController.updateUser
);


module.exports = router