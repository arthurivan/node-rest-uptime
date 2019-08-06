/*
* Create and export configuration variables
*
*/

// Container for all the environments
const environments = {};

// Staging environment
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: 'staging',
  hashingSecret: 'thisIsASecret',
  maxChecks: 5,
  twilio: {
    accountSid: 'ACe68c43020c282772c7e004f8c23f8063',
    authToken: 'ff1451d4bf142b116363c8436ba1aac4',
    fromPhone: '+14155238886',
  },
  templateGlobals: {
    baseUrl: 'http://localhost:3000/',
    appName: 'UptimeChecker',
    yearCreated: '2019',
    companyName: 'Arthur Cowdery',
  },
};

// Production environment
environments.production = {
  httpPort: process.env.PORT || 5000,
  httpsPort: process.env.PORT || 5001,
  envName: 'production',
  hashingSecret: 'thisIsASecret',
  maxChecks: 5,
  twilio: {
    accountSid: 'ACe68c43020c282772c7e004f8c23f8063',
    authToken: 'ff1451d4bf142b116363c8436ba1aac4',
    fromPhone: '+14155238886',
  },
  templateGlobals: {
    baseUrl: 'https://node-rest-uptime.herokuapp.com/',
    appName: 'UptimeChecker',
    yearCreated: '2019',
    companyName: 'NotARealCompany, Inc',
  },
};

// Determine which environment was passed as a command-line arguement
const currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above
const environmentToExport = Object.keys(environments).includes(currentEnvironment)
  ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
