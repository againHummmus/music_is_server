const getRecommendationService = require('../services/recommendationService');

class recommendationController {
  async users(req, res, next) {
    try {
      const list = await getRecommendationService(req).regenerateForAllUsers();
      res.json(list);
    } catch (e) { next(e); }
  }

  async tracks(req, res, next) {
    try {
      const list = await getRecommendationService(req).getRecommendedTracks(req.body.id);
      res.json(list);
    } catch (e) { next(e); }
  }
}

module.exports = new recommendationController();
