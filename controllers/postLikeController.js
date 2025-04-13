const ErrorMiddleware = require("../error/ErrorMiddleware");
const postLikeService = require("../services/postLikeService");
const Controller = require("./controller");

class PostLikeController extends Controller {

  async create(req, res, next) {
    try {
      const { userId, postId } = req.body;
      const postLike = await postLikeService.createPostLike({ userId, postId });
      return res.json(postLike);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }

  async search(req, res, next) {
    try {
      const { userId, postId, limit, offset } = req.query;
      const postLikes = await postLikeService.searchPostLikes({
        userId,
        postId,
        limit: limit ? parseInt(limit, 10) : 10,
        offset: offset ? parseInt(offset, 10) : 0,
      });
      return res.json(postLikes);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }
}

module.exports = new PostLikeController();
