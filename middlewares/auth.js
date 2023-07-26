const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/authorization-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthorizationError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-secret-secret');
  } catch (err) {
    next(new AuthorizationError('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};
