const Router = require('express');
const recommendationController = require('../controllers/recommendationController');
const router = new Router();

router.post('/generate-recommendations',  recommendationController.runGenerateRecommendations);
router.get('/user-recommendations/:userId', recommendationController.getUserRecommendations);

module.exports = router;
