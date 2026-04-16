const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await authService.register(email, password);

    res.json({
      data: user,
      meta: {},
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.json({
      data: result,
      meta: {},
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
};