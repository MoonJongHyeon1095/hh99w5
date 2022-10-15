const express = require('express');
const Http = require('http');
const routes = require('./routes');
require('dotenv').config();

const cookieParser = require('cookie-parser');

const app = express();
const http = Http.createServer(app);
const port = process.env.EXPRESS_PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use('/', require('./routes/users'));
app.use('/posts', require('./routes/likes'));
app.use('/posts', require('./routes/posts'));
app.use('/comments', require('./routes/comments'));

http.listen(port, () => {
    console.log(`Start listen Server: ${port}`);
  });
  
  module.exports = http;