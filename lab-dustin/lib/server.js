'use strict';
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

const app  = express();
let server;

// middleware

// routes
app.use(require('../route/hero-router.js'));
// error middleware
app.use(require('./error-middleware.js'));

// export server control
const serverControl = module.exports = {};

serverControl.start = () => {
  return new Promise((resolve) => {
    if(!server || !server.isOn) {
      server = app.listen(process.env.PORT, () => {
        console.log('servin tough on:', process.env.PORT);
        server.isOn = true;
        resolve();
      });
    }
  });
};

serverControl.stop = () => {
  return new Promise((resolve) => {
    if(server && server.isOn) {
      server.close(() => {
        console.log('Server Down');
        server.isOn = false;
        resolve();
      });
    }
  });
};
