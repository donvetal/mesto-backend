const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  Card.create({name, link, owner: req.user._id})
    .then((card) => res.send({data: card}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Переданы некорректные данные при создании карточки.'});
      } else {
        res.status(500).send({massage: 'Внутренняя ошибка сервера'});
      }
    });
};
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({data: cards}))
    .catch(() => res.status(500).send({message: 'Внутренняя ошибка сервера'}));
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        return res.status(404).send({message: 'Нет карточки по заданному id'});
      }
      if (card.owner.toString() === req.user._id.toString()) {
        return Card.findByIdAndRemove(req.params.id)
          .then((card) => res.send({data: card}))
          .catch((err) => {
            if (err.name === 'CastError') {
              res.status(400).send({message: 'Невалидный id.'});
            } else if (err.statusCode === 404) {
              res.status(404).send({message: err.message});
            } else {
              res.status(500).send({message: 'Внутренняя ошибка сервера'});
            }
          });
      }
      return res.status(403).send({message: 'Запрещено. У клиента нет прав доступа к содержимому!'});
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id.' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

// module.exports.deleteCard = (req, res) => {
//   console.log(req.body.owner);
//   console.log(req.user._id);
//   console.log(req.body);
//   Card.findByIdAndRemove(req.params.id)
//     .orFail(() => {
//       const error = new Error('Нет карточки по заданному id');
//       error.statusCode = 404;
//       throw error;
//     })
//     .then((card) => res.send({ data: card }))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res.status(400).send({ message: 'Невалидный id.' });
//       } else if (err.statusCode === 404) {
//         res.status(404).send({ message: err.message });
//       } else {
//         res.status(500).send({ message: 'Внутренняя ошибка сервера' });
//       }
//     });
// };

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id,
    {$addToSet: {likes: req.user._id}},
    {new: true})
    .orFail(() => {
      const error = new Error('Нет карточки по заданному id');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send({data: card}))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({message: 'Невалидный id.'});
      } else if (err.statusCode === 404) {
        res.status(404).send({message: err.message});
      } else {
        res.status(500).send({massage: 'Внутренняя ошибка сервера'});
      }
    });
};
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id,
    {$pull: {likes: req.user._id}},
    {new: true})
    .orFail(() => {
      const error = new Error('Нет карточки по заданному id');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send({data: card}))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({message: 'Невалидный id.'});
      } else if (err.statusCode === 404) {
        res.status(404).send({message: err.message});
      } else {
        res.status(500).send({massage: 'Внутренняя ошибка сервера'});
      }
    });
};
