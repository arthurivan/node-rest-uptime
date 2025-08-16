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
  hashingSecret: process.env.HASHING_SECRET || 'your-hashing-secret-here',
  maxChecks: 5,
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || 'your-twilio-account-sid',
    authToken: process.env.TWILIO_AUTH_TOKEN || 'your-twilio-auth-token',
    fromPhone: process.env.TWILIO_FROM_PHONE || '+your-twilio-whatsapp-number',
  },
  templateGlobals: {
    baseUrl: 'http://localhost:3000/',
    appName: 'UptimeChecker',
    yearCreated: '2019',
    companyName: 'Your Company Name',
  },
};

// Production environment
environments.production = {
  httpPort: process.env.PORT || 5000,
  httpsPort: process.env.PORT || 5001,
  envName: 'production',
  hashingSecret: process.env.HASHING_SECRET || 'your-hashing-secret-here',
  maxChecks: 5,
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || 'your-twilio-account-sid',
    authToken: process.env.TWILIO_AUTH_TOKEN || 'your-twilio-auth-token',
    fromPhone: process.env.TWILIO_FROM_PHONE || '+your-twilio-whatsapp-number',
  },
  templateGlobals: {
    baseUrl: process.env.BASE_URL || 'https://your-domain.com/',
    appName: 'UptimeChecker',
    yearCreated: '2019',
    companyName: 'Your Company Name',
  },
};

// Determine which environment was passed as a command-line arguement
const currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above
const environmentToExport = Object.keys(environments).includes(currentEnvironment)
  ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
