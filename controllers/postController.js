const Controller = require('./controller');
const ErrorMiddleware = require('../error/ErrorMiddleware');
const getPostService = require('../services/postService');

class PostController extends Controller {
  async create(req, res, next) {
    try {
      const { content, trackId, playlistId, userId } = req.body;
      const post = await getPostService(req).createPost({
        content,
        trackId,
        playlistId,
        userId,
      });
      return res.json(post);
    } catch (err) {
      return next(ErrorMiddleware.internal(err.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await getPostService(req).deletePost({ id });
      return res.json(result);
    } catch (err) {
      return next(ErrorMiddleware.internal(err.message));
    }
  }

  async search(req, res, next) {
    try {
      const {
        id,
        trackId,
        playlistId,
        userId,
        limit: limitRaw,
        offset: offsetRaw,
      } = req.query;
      const limit = limitRaw ? parseInt(limitRaw, 10) : undefined;
      const offset = offsetRaw ? parseInt(offsetRaw, 10) : undefined;

      const posts = await getPostService(req).searchPosts({
        id,
        trackId,
        playlistId,
        userId,
        limit,
        offset,
      });
      return res.json(posts);
    } catch (err) {
      return next(ErrorMiddleware.internal(err.message));
    }
  }
}

module.exports = new PostController();
