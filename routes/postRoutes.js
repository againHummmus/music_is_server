const Router = require('express');
const router = new Router();
const postController = require('../controllers/postController');
const AuthMiddleware = require('../middlewares/authMiddleware');

router.post('/', AuthMiddleware, postController.create);
router.get('/', AuthMiddleware, postController.search);
router.delete('/:id', AuthMiddleware, postController.delete);

module.exports = router;
