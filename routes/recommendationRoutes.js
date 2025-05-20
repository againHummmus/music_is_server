const Router = require('express');
const recommendationController = require('../controllers/recommendationController');
const router = new Router();

router.post('/users',  recommendationController.users);
router.post('/tracks', recommendationController.tracks);

module.exports = router;
