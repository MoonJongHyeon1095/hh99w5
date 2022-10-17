const express = require('express');
const Http = require('http');
require('dotenv').config();

const cookieParser = require('cookie-parser');

const app = express();
const http = Http.createServer(app);

app.use(cookieParser());
app.use(express.json());
app.use('/', require('./routes/users.routes'));
app.use('/posts', require('./routes/posts.routes'));
app.use('/comments', require('./routes/comments.routes'));

module.exports = http;