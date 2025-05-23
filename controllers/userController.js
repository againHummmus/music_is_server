const ErrorMiddleware = require("../error/ErrorMiddleware");
const authService = require("../services/userService");
const { validationResult } = require("express-validator");

class userController {

  async signUp(req, res, next) {
    try {
      const is_prod = process.env.IS_PRODUCTION === 'true';
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ErrorMiddleware.badRequest('validation error', errors.array()));
      }
      const { email, password, username } = req.body;
      const userData = await authService(req).signUp({ email, password, username });
      res.cookie('refresh_token', userData.session.refresh_token, {  
        httpOnly: true,
        sameSite: is_prod ? 'none' : 'lax',
        secure: is_prod,
      });
      res.cookie('access_token', userData.session.access_token, { 
        maxAge: 60 * 60 * 1000, 
        httpOnly: true,
        sameSite: is_prod ? 'none' : 'lax',
        secure: is_prod,
      });
      return res.json(userData);
    } catch (error) {
      console.log(error)
      return next(ErrorMiddleware.internal(error));
    }
  }

  async signIn(req, res, next) {
    try {
      const is_prod = process.env.IS_PRODUCTION === 'true';
      const { email, password } = req.body;
      const userData = await authService(req).signIn({ res, email, password });
      res.cookie('refresh_token', userData.session.refresh_token, { 
        httpOnly: true,
        sameSite: is_prod ? 'none' : 'lax',
        secure: is_prod,
      });
      res.cookie('access_token', userData.session.access_token, { 
        maxAge: 60 * 60 * 1000, 
        httpOnly: true,
        sameSite: is_prod ? 'none' : 'lax',
        secure: is_prod,
      });
      return res.json(userData);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }

  async signOut(req, res, next) {
    try {
      res.clearCookie('refresh_token');
      res.clearCookie('access_token');
      return res.json({ message: 'success' });
    } catch (error) {
      return;
    }
  }

  async refresh(req, res, next) {
    try {
      const is_prod = process.env.IS_PRODUCTION === 'true';

      const { refresh_token } = req.cookies;
      if (!refresh_token) return next(ErrorMiddleware.forbidden('no token provided'));
      const userData = await authService(req).refresh(refresh_token);
      res.cookie('refresh_token', userData.session.refresh_token, { 
        httpOnly: true,
        sameSite: is_prod ? 'none' : 'lax',
        secure: is_prod,
      });
      res.cookie('access_token', userData.session.access_token, { 
        maxAge: 60 * 60 * 1000, 
        httpOnly: true,
        sameSite: is_prod ? 'none' : 'lax',
        secure: is_prod,
      });
      return res.json(userData.user);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }

  async getUser(req, res, next) {
    try {
      const id = req.params.id;
      const user = await authService(req).getUser(id);
      return res.json(user);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }

  async searchUsers(req, res, next) {
    try {
      const {
        username,
        app_role,
        artist_id: artistIdRaw,
        limit: limitRaw,
        offset: offsetRaw
      } = req.query;

      const artist_id = artistIdRaw ? parseInt(artistIdRaw, 10) : undefined;
      const limit = limitRaw ? parseInt(limitRaw, 10) : undefined;
      const offset = offsetRaw ? parseInt(offsetRaw, 10) : undefined;
      const users = await authService(req).searchUsers({
        username,
        app_role,
        artist_id,
        limit,
        offset
      });

      return res.json(users);
    } catch (err) {
      return next(ErrorMiddleware.internal(err.message));
    }
  }


  async me(req, res, next) {
    try {
      const { access_token } = req.cookies;
      if (!access_token) {
        return res.status(401).json({ error: "No access token provided" });
      }

      const data = await authService(req).getMe(access_token);
      return res.json({ data });
    } catch (error) {
      return next(ErrorMiddleware.unauthorized(error.message));
    }
  }

  async updatePassword(req, res, next) {
    try {
      const { password } = req.body;
      const result = await authService(req).updatePassword({ password });
      return res.json(result);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await authService(req).activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      return next(ErrorMiddleware.internal(error.message));
    }
  }

  async updateUser(req, res, next) {
    try {
      const service = authService(req);
      const { userId, newUsername } = req.body;
      const avatar = req.files?.avatar; 

      const updated = await service.updateUser({
        id: userId,
        newUsername,
        avatar,
      });

      return res.json(updated);
    } catch (err) {
      return next(ErrorMiddleware.internal(err.message));
    }
  }
}


module.exports = new userController();
