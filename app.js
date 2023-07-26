require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const routes = require('./routes');
const serverError = require('./errors/server-err');

const { PORT = 3000 } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect('mongodb://0.0.0.0:27017/bitfilmsdb', {
  useNewUrlParser: true,
});
app.use(cors());
app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(serverError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
