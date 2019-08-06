/*
Primary file for the API
*/

const server = require('./lib/server.js');
const workers = require('./lib/workers.js');

// Declare app
const app = {};

app.init = () => {
  // Start the server
  server.init();
  // Start the workers
  workers.init();
};

app.init();

module.exports = app;
