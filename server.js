/*
Primary file for the API
*/

const server = require('./lib/server');
const workers = require('./lib/workers');

// Declare app
const app = {};

app.init = () => {
  // Start the server
  server.init();
  // Start the workers
  workers.init();

}

app.init();

module.exports = app;