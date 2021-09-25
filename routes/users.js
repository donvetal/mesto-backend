const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, updateProfile, updateAvatar, getProfile,
} = require('../controllers/user');

router.get('/', getUsers);

router.get('/me/:id', getProfile);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), updateAvatar);

module.exports = router;
