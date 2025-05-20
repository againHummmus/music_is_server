const ErrorMiddleware = require('../error/ErrorMiddleware');
const UserSubscriptionService = require('../services/userSubscriptionService');

class UserSubscriptionController {
  async create(req, res, next) {
    try {
      const { follower, followee } = req.body;
      const data = await UserSubscriptionService(req).createSubscription({ follower, followee });
      return res.json(data);
    } catch (err) {
      return next(ErrorMiddleware.internal(err.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const data = await UserSubscriptionService(req).deleteSubscription({ id });
      return res.json(data);
    } catch (err) {
      return next(ErrorMiddleware.internal(err.message));
    }
  }

  async search(req, res, next) {
    try {
      const { follower, followee, limit: lim, offset: off } = req.query;
      const limit = lim ? parseInt(lim, 10) : undefined;
      const offset = off ? parseInt(off, 10) : undefined;
      const data = await UserSubscriptionService(req).searchSubscriptions({
        follower,
        followee,
        limit,
        offset
      });
      return res.json(data);
    } catch (err) {
      return next(ErrorMiddleware.internal(err.message));
    }
  }
}

module.exports = new UserSubscriptionController();
