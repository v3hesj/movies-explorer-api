const movieRouter = require('express').Router();

const { getMovie, addMovie, deleteMovie } = require('../controllers/movies');
const { validateMovie, validateMovieId } = require('../utils/validation');

movieRouter.get('/', getMovie);
movieRouter.post('/', validateMovie, addMovie);
movieRouter.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = movieRouter;
