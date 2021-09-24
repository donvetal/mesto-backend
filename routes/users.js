const router = require('express').Router();
const {
  /*createUser, getUser,*/ getUsers, updateProfile, updateAvatar, getCurrentUser
} = require('../controllers/user');

// router.post('/', createUser);

// router.get('/:id', getUser);

router.get('/', getUsers);

router.get('/me/:id', getCurrentUser)

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
