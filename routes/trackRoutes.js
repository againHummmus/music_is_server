const Router = require('express');
const router = new Router();
const trackController = require('../controllers/trackController');
const AuthMiddleware = require('../middlewares/authMiddleware');

router.post('/', AuthMiddleware, trackController.create);
router.get('/', trackController.search);

module.exports = router;