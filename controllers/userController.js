const ErrorMiddleware = require("../error/ErrorMiddleware");
const authService = require("../services/userService")
const Controller = require("./controller");
const {validationResult} = require("express-validator")


class userController extends Controller {
  async signUp(req, res, next) {
    try {
      const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
        return next(ErrorMiddleware.badRequest('validation error', errors.array()))  
      }
      const { email, password, username } = req.body
      const {avatar} = req.files
      const userData = await authService.signUp({ res, email, password, username, avatar })
      return res.json(userData)
    }
    catch (error) {
      return next(ErrorMiddleware.internal(error.message))
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body
      const userData = await authService.signIn({ res, email, password })
      return res.json(userData)
    }
    catch (error) {
      return next(ErrorMiddleware.internal(error.message))   
    }
  }

  async signOut(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await authService.signOut(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    }
    catch (error) {
      return next(ErrorMiddleware.internal(error.message))
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await authService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      return res.json(userData);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message))
    }
  }

  async getUser(req, res, next) {
    try {
      const id = req.params.id;
      const user = await authService.getUser(id)
      return res.json(user)
    }
    catch (error) {
      return next(ErrorMiddleware.internal(error.message))
    }
  }

  async updatePassword(req, res, next) {
    try {
      const { password } = req.body
      const result = await authService.updatePassword({ password })
      return res.json(result)
    }
    catch (error) {
      return next(ErrorMiddleware.internal(error.message))
    }
  }

  async activate(req, res, next) {
    try {
        const activationLink = req.params.link;
        await authService.activate(activationLink);
        return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message))
    }
}
}

module.exports = new userController()