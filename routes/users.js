const router = require('express').Router();
const {
  /*createUser, getUser,*/ getUsers, updateProfile, updateAvatar, getProfile
} = require('../controllers/user');

// router.post('/', createUser);

// router.get('/:id', getUser);

router.get('/', getUsers);

router.get('/me/:id', getProfile)

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
