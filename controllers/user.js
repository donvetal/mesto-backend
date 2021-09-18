const User = require('../models/user');

module.exports.createUser = (req, res) => {
    const {name, about, avatar} = req.body;

    User.create({name, about, avatar})
        .then(user => res.send({data: user}))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                res.status(400).send({message: 'Переданы некорректные данные при создании пользователя.'});
            } else {
                res.status(500).send({massage: 'Внутренняя ошибка сервера'});
            }

        });
};

module.exports.getUser = (req, res) => {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).send({message: 'Пользователь по указанному _id не найден.'});
    }
    User.findById(req.params.id)
        .then((user) => {
            if (!user) {
                return res.status(404).send({message: 'Пользователь по указанному _id не найден.'});
            }
            return res.send({data: user});
        })
        .catch(() => res.status(500).send({message: 'Внутренняя ошибка сервера'}));
};

module.exports.getUsers = (req, res) => {
    User.find({})
        .then(users => res.send({data: users}))
        .catch(() => {
            res.status(500).send({massage: 'Внутренняя ошибка сервера'});
        });
};
module.exports.updateProfile = (req, res) => {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).send({message: 'Пользователь по указанному _id не найден.'});
    }
    const {name, about} = req.body;
    User.findByIdAndUpdate(req.params.id, {name, about}, {new: true})
        .then(res.send({name, about}))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                res.status(400).send({message: 'Переданы некорректные данные при обновлении профиля.'});
            } else {
                res.status(500).send({massage: 'Внутренняя ошибка сервера'});
            }

        });
};
module.exports.updateAvatar = (req, res) => {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).send({message: 'Пользователь по указанному _id не найден.'});
    }
    const {avatar} = req.body;
    User.findByIdAndUpdate(req.params.id, {avatar}, {new: true})
        .then(res.send({avatar}))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                res.status(400).send({message: 'Переданы некорректные данные при обновлении аватара.'});
            } else {
                res.status(500).send({massage: 'Внутренняя ошибка сервера'});
            }

        });
};