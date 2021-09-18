const router = require('express').Router();
const {createUser, getUser, getUsers, updateProfile, updateAvatar} = require('../controllers/user');

router.post('/', createUser);

router.get('/:id', getUser);

router.get('/', getUsers);

router.patch('/me/:id', updateProfile);

router.patch('/me/avatar/:id', updateAvatar);

module.exports = router;