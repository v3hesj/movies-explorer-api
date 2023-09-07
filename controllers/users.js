const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { ValidationError, CastError } = mongoose.Error;

const { CodeSuccess } = require('../utils/constants');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const userToken = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret-secret-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', userToken, {
        maxAge: 3600000,
        sameSite: true,
        httpOnly: true,
      })
        .send({ userToken });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => res.status(CodeSuccess.OK).send({
      name, email,
    }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError('Пользователь уже существует'));
        return;
      }
      next(err);
    });
};

module.exports.findUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById({ _id: _id })
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => res.status(CodeSuccess.OK).send(user))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => next(new NotFoundError('Нет пользователя с таким id')))
    .then((user) => res.status(CodeSuccess.OK).send({ user }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Ошибка валидации'));
        return;
      }
      next(err);
    });
};

module.exports.logoutUser = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход из системы выполнен' });
};
