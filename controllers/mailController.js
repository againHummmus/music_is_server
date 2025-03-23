const ErrorMiddleware = require("../error/ErrorMiddleware");
const mailService = require("../services/mailService");
const Controller = require("./controller");

class mailController extends Controller {
  async resetPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await mailService.resetPassword({ email });
      return res.json(result);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }
}

module.exports = new mailController()