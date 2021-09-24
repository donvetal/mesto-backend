const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  const {authorization} = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({message: 'Необходима авторизация'});
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try{
    payload = jwt.verify(token, 'super-strong-secret');
  } catch(err){
    return res.status(403).send({message:'Запрещено, нет прав доступа к содержимому!'})
  }
  req.user = payload;
  next();

};