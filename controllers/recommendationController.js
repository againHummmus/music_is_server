const getRecommendationService = require('../services/recommendationService');
const ErrorMiddleware = require("../error/ErrorMiddleware");

class recommendationController {
  async runGenerateRecommendations(req, res, next) {
    try {
      const list = await getRecommendationService(req).regenerateForAllUsers();
      res.json(list);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }

  async getUserRecommendations(req, res, next) {
    try {
      const list = await getRecommendationService(req).getUserRecommendations(req.params.userId);
      res.json(list);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }

}

module.exports = new recommendationController();
