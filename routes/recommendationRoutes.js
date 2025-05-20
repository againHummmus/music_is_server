const Router = require('express');
const recommendationController = require('../controllers/recommendationController');
const router = new Router();

router.get('/users',  recommendationController.users);
router.get('/tracks', recommendationController.tracks);

module.exports = router;
