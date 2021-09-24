const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports.createUser = (req, res) => {
  const {email, password, name, about, avatar} = req.body;

  bcrypt.hash(password, 10)
    .then(hash => User.create({email, password: hash, name, about, avatar}))

    .then((user) => res.send({data: user}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Переданы некорректные данные при создании пользователя.'});
      } else {
        res.status(500).send({massage: 'Внутренняя ошибка сервера'});
      }
    });
};

module.exports.login = (req, res) => {
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
    });
};

// module.exports.getUser = (req, res) => {
//   User.findById(req.params.id)
//     .then((user) => {
//       if (!user) {
//         return res.status(404).send({message: 'Пользователь по указанному _id не найден.'});
//       }
//       return res.send({data: user});
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res.status(400).send({message: 'Невалидный id'});
//       } else {
//         res.status(500).send({massage: 'Внутренняя ошибка сервера'});
//       }
//     });
// };

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({data: users}))
    .catch(() => {
      res.status(500).send({massage: 'Внутренняя ошибка сервера'});
    });
};

module.exports.updateProfile = (req, res) => {
  const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about}, {new: true, runValidators: true})
    .then((user) => {
      if (!user) {
        return res.status(404).send({message: 'Нет пользователя по заданному id'});
      }
      return res.send({data: user});
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({message: 'Невалидный id.'});
      } else if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Некорректные данные '});
      } else {
        res.status(500).send({massage: 'Внутренняя ошибка сервера'});
      }
    });
};
module.exports.updateAvatar = (req, res) => {
  const {avatar} = req.body;
  User.findByIdAndUpdate(req.user._id, {avatar}, {new: true, runValidators: true})
    .then((user) => {
      if (!user) {
        return res.status(404).send({message: 'Нет пользователя по заданному id'});
      }
      return res.send({data: user});
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({message: 'Невалидный id.'});
      } else if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Некорректные данные '});
      } else {
        res.status(500).send({massage: 'Внутренняя ошибка сервера'});
      }
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({message: 'Пользователь по указанному _id не найден.'});
      }
      return res.send({data: user});
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({message: 'Невалидный id'});
      } else {
        res.status(500).send({massage: 'Внутренняя ошибка сервера'});
      }
    });
}
