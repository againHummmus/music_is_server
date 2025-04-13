const Router = require('express');
const router = new Router();
const playlistLikeController = require('../controllers/playlistLikeController');

router.post('/', playlistLikeController.create);
router.get('/', playlistLikeController.search);

module.exports = router;
