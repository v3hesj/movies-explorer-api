const usersRouter = require('express').Router();
const {
  validateUpdate,
} = require('../utils/validation');

const {
  findUser, updateUser,
} = require('../controllers/users');

usersRouter.get('/me', findUser);
usersRouter.patch('/me', validateUpdate, updateUser);

module.exports = usersRouter;
