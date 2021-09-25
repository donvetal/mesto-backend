const jwt = require('jsonwebtoken');
const UnauthorizedErr = require('../errors/unauthorized-err');
const ForbiddenErr = require('../errors/forbidden-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedErr('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    throw new ForbiddenErr('Запрещено, нет прав доступа к содержимому!');
  }
  req.user = payload;
  next();
};
