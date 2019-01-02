const express = require('express');
const app = express();

require('./startup/db');
require('./startup/app')(app);

const port = process.env.PORT || 8001;
const server = app.listen(port, () => {
  console.log('listening on port: ', port);
});

module.exports = server
