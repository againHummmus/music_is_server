const authService = require("../services/userService")
const ApiError = require("../error/ApiError");

class UserController {
  async signUp(req, res, next) {
    try {
      const { email, password, username } = req.body
      const userData = await authService.signUp({ email, password, username })
      return res.json(userData)
    }
    catch (error) {
      return next(ApiError.internal("Registration failed"))
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body
      const userData = await authService.signIn({ email, password })
      return res.json(userData)
    }
    catch (error) {
      return next(ApiError.internal("Login failed"))
    }
  }

  async signOut(req, res, next) {
    try {
      const result = await authService.signOut()
      return res.json(result)
    }
    catch (error) {
      return next(ApiError.internal("Logout failed"))
    }
  }

  async getUser(req, res, next) {
    try {
      const user = await authService.getUser()
      return res.json(user)
    }
    catch (error) {
      return next(ApiError.internal("Failed to get user data"))
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { email } = req.body
      const result = await authService.resetPassword({ email })
      return res.json(result)
    }
    catch (error) {
      return next(ApiError.internal("Password reset failed"))
    }
  }

  async updatePassword(req, res, next) {
    try {
      const { password } = req.body
      const result = await authService.updatePassword({ password })
      return res.json(result)
    }
    catch (error) {
      return next(ApiError.internal("Password update failed"))
    }
  }
}

module.exports = new UserController()