const express = require('express');
const Http = require('http');
require('dotenv').config();

const cookieParser = require('cookie-parser');
const { errorLogger, errorHandler } = require('./middlewares/error-handler.middleware');

const app = express();
const http = Http.createServer(app);

app.use(cookieParser());
app.use(express.json());
app.use('/', require('./routes/users.routes'));
app.use('/posts', require('./routes/posts.routes'));
app.use('/likes', require('./routes/likes.routes'));
app.use('/comments', require('./routes/comments.routes'));
app.use(errorLogger); // Error Logger
app.use(errorHandler); // Error Handler

module.exports = http;