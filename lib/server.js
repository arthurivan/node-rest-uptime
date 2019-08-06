// Server related tasks
// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const config = require('./config');
const fs = require('fs');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');
var util = require('util');
var debug = util.debuglog('server');

// Instantiate a server module object
const server = {};

// Instantiating the HTTP server
server.httpServer = http.createServer((req, res) => {
  server.unifiedServer(req, res);
});


// Instantiate the HTTPS server
server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '/../https/cert.pem')),
};
server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
  server.unifiedServer(req, res);
}); 

server.init = () => {
  // Start the HTTP server
  /* server.httpServer.listen(config.httpPort, () => {
    console.log('\x1b[32m%s\x1b[0m',`The server is listening on port ${config.httpPort}`);
  }); */

  // Start the HTTPS server
  server.httpsServer.listen(config.httpsPort, () => {
    console.log('\x1b[33m%s\x1b[0m',`The server is listening on port ${config.httpsPort}`);
  });
}


// Define a request router
server.router = {
  '': handlers.index,
  'account/create': handlers.accountCreate,   //to sign up
  'account/edit': handlers.accountEdit,       //to edit account 
  'account/deleted': handlers.accountDeleted, //to show account deleted
  'session/create': handlers.sessionCreate,   //to login
  'session/deleted': handlers.sessionDeleted, //to logout
  'checks/all': handlers.checksList,           //to see dashboard
  'checks/create': handlers.checksCreate,
  'checks/edit': handlers.checksEdit,
  'ping': handlers.ping,
  'api/users': handlers.users,
  'api/tokens': handlers.tokens,
  'api/checks': handlers.checks,
  'favicon.ico': handlers.favicon,
  'public': handlers.public
};

// Logic for both http and https server
server.unifiedServer = (req, res) => {
  // get url and parse it
  const parsedUrl = url.parse(req.url, true);

  // get path of url
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // get the query string as an object
  const queryStringObject = parsedUrl.query;

  // get the http method
  const method = req.method.toLowerCase();

  // get the headers out of the object
  const headers = req.headers;

  // get payload if any, stream
  const decoder = new StringDecoder('utf8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();

    // choose the handler this request should go to.
    // if one is not found, use the not found handler
    let chosenHandler = typeof server.router[trimmedPath] !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

    // If request is with the public dir use public handler instead
    chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;
    // construct data object to send to handler
    let data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    // route the request to the handler specified in the router
    chosenHandler(data, (statusCode = 200, payload = {}, contentType) => {

      contentType = typeof(contentType) == 'string' ? contentType : 'json';
      

      // Return the response parts that are content-specific
      let payloadString = '';
      if (contentType == 'json') {
        res.setHeader('Content-Type', 'application/json');
        payloadString = JSON.stringify(payload)
      }
      if (contentType == 'html') {
        res.setHeader('Content-Type', 'text/html');
        payloadString = typeof(payload) == 'string' ? payload : '';
      }
      if (contentType == 'css') {
        res.setHeader('Content-Type', 'text/css');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
      }
      if (contentType == 'png') {
        res.setHeader('Content-Type', 'image/png');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
      }
      if (contentType == 'jpg') {
        res.setHeader('Content-Type', 'image/jpeg');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
      }
      if (contentType == 'favicon') {
        res.setHeader('Content-Type', 'image/x-icon');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
      }
      if (contentType == 'js') {
        res.setHeader('Content-Type', 'text/javascript');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
      }
      // Return the response parts that are common to all content-types
      res.writeHead(statusCode);
      res.end(payloadString);

      // If the response is 200, print green otherwise print red
      if (statusCode == 200 || 201) {
        debug('\x1b[32m%s\x1b[0m', `returning this res: ${statusCode} ${payloadString}`);
      } else {
        debug('\x1b[31m%s\x1b[0m', `returning this res: ${statusCode} ${payloadString}`);
      }
    });
  });
};
// Export the module
module.exports = server;