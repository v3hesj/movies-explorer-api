const router = require('express').Router();
const auth = require('../middlewares/auth');
const { loginUser, createUser, logoutUser } = require('../controllers/users');
const { validateAuth, validateRegister } = require('../utils/validation');
const NotFoundError = require('../errors/not-found-err');

const users = require('./users');
const movies = require('./movies');

router.post(
  '/signin',
  validateAuth,
  loginUser,
);

router.post(
  '/signup',
  validateRegister,
  createUser,
);

router.use('/users', auth, users);
router.use('/movies', auth, movies);

router.post(
  '/signout',
  logoutUser,
);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
