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

  async searchMutualFriends(req, res, next) {
    try {
      const userId = req.query.userId || req.user?.id;

      if (!userId) {
        return next(ErrorMiddleware.badRequest('User ID is required to search mutual friends.'));
      }

      const { limit: lim, offset: off } = req.query;
      const limit = lim ? parseInt(lim, 10) : undefined;
      const offset = off ? parseInt(off, 10) : undefined;
      const getPosts = req.query.getPosts === 'true';
      const getPlaylists = req.query.getPlaylists === 'true';

      const data = await UserSubscriptionService(req).searchMutualFriends({
        userId,
        limit,
        offset,
        getPosts,
        getPlaylists
      });
      return res.json(data);
    } catch (err) {
      console.error('Error in UserSubscriptionController.searchMutualFriends:', err.message);
      return next(ErrorMiddleware.internal(err.message));
    }
  }
}

module.exports = new UserSubscriptionController();
