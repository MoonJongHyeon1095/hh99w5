const http = require('./app');
const port = process.env.EXPRESS_PORT || 3000;

http.listen(port, () => {
    console.log(` I love you ${port}. ${port}만큼 사랑해. `);
  });