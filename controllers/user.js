const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const NotFoundError = require('../errors/not-found-err');
const BadRequestErr = require('../errors/bad-request-err');
const ConflictErr = require('../errors/conflict-err');


module.exports.createUser = (req, res, next) => {
  const {email, password, name, about, avatar} = req.body;

  bcrypt.hash(password, 10)
    .then(hash => User.create({email, password: hash, name, about, avatar}))

    .then((user) => res.send({data: user}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestErr('Некорректные данные ');
      } else if (err.name === "MongoError" && err.code === 11000) {
        throw new ConflictErr('Конфликтует, такой email уже существует.');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const {email, password} = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // вернём токен
      res.send({
        token: jwt.sign({_id: user._id}, 'super-strong-secret', {expiresIn: '7d'}),
      });
    })
    .catch((err) => {
      res.status(401).send({message: err.message});
    })
    .catch(next);
};

module.exports.getProfile = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      return res.send({data: user});
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestErr('Невалидный id');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({data: users}))
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about}, {new: true, runValidators: true})
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      return res.send({data: user});
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestErr('Невалидный id');
      } else if (err.name === 'ValidationError') {
        throw new BadRequestErr('Некорректные данные ');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const {avatar} = req.body;
  User.findByIdAndUpdate(req.user._id, {avatar}, {new: true, runValidators: true})
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      return res.send({data: user});
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestErr('Невалидный id');
      } else if (err.name === 'ValidationError') {
        throw new BadRequestErr('Некорректные данные ');
      } else {
        next(err);
      }
    })
    .catch(next);
};


