// Helpers for various tasks

// Dependencies
const crypto = require('crypto');
const config = require('./config');
const querystring = require('querystring');
const https = require('https');
const path = require('path');
const fs = require('fs');

// Container for all the helpers
const helpers = {};

// Create a SHA256 hash
helpers.hash = (str) => {
  if (typeof (str) === 'string' && str.length > 0) {
    let hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  }
  return false;
};

helpers.parseJsonToObject = (str) => {
  try {
    let obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

// Create a random string of length strLength
helpers.createRandomString = (strLength) => {
  strLength = typeof (strLength) === 'number' && strLength > 0 ? strLength : false;
  if (strLength) {
    // Define possible characters
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (let i = 0; i < strLength; i++) {
      str += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
    }
    return str;
  } else {
    return false;
  }
}

// Send a SMS message via Twilio
helpers.sendTwilioSms = (phone, message, callback) => {
  // Validate params
  phone = typeof (phone) == 'string' && phone.trim().length == 12 ? phone.trim() : false;
  message = typeof (message) == 'string' && message.trim().length > 0 && message.trim().length <= 1600 ? message.trim() : false;

  if (phone && message) {
    // Configure the request payload
    let payload = {
      To: 'whatsapp:+'+phone,
      From: 'whatsapp:'+config.twilio.fromPhone,
      Body: message
    };
    // stringify payload
    let stringPayload = querystring.stringify(payload);
    // Config the request details
    let requestDetails = {
      protocol: 'https:',
      hostname: 'api.twilio.com',
      method: 'POST',
      path: '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
      auth: config.twilio.accountSid+':'+config.twilio.authToken,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload)
      },
    };

    // Instantiate request object
    let req = https.request(requestDetails, (res) => {
      let status = res.statusCode;
      if (status == 200 || status == 201) {
        callback(false);
      } else {
        callback('Status code returned was '+status);
      }
    });
    // bind to error event to avoid thrown
    req.on('error', (e) => {
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);
    // End the request
    req.end();

  } else {
    callback('Given params were invalid');
  }
}

// Get the string ocntent of a template
helpers.getTemplate = (templateName, data, callback) => {
  templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
  data = typeof(data) == 'object' && data != null ? data : {};

  if (templateName) {
    let templateDir = path.join(__dirname, '/../templates/');
    fs.readFile(`${templateDir}/${templateName}.html`, 'utf8', (err, str) => {
      if (!err && str && str.length > 0) {
        let finalString = helpers.interpolate(str, data);
        callback(false, finalString);
      } else {
        callback('No template could be found');
      }
    })
  } else {
    callback('A valid template name was not specified');
  }
}

helpers.addUniversalTemplates = (str, data, callback) => {
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data != null ? data : {};

  helpers.getTemplate('_header', data, (err, headerString) => {
    if (!err && headerString) {
      helpers.getTemplate('_footer', data, (err, footerString) => {
        if (!err && footerString) {
          let fullString = headerString+str+footerString;
          callback(false, fullString);
        } else {
          callback('Could not find footer template');
        }
      })
    } else {
      callback('Could not find header template');
    }
  })
};

helpers.interpolate = (str, data) => {
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data != null ? data : {};

  // Add the template globals to the data obj, prepending their key name with global
  for (let keyName in config.templateGlobals) {
    if (config.templateGlobals.hasOwnProperty(keyName)) {
      data['global.'+keyName] = config.templateGlobals[keyName];
    }
  }

  for (var key in data) {
    if (data.hasOwnProperty(key) && typeof(data[key]) == 'string') {
      var replace = data[key];
      var find = '{'+key+'}';
      str = str.replace(find, replace);
    }
  }
  return str;
}

helpers.getStaticAsset = (fileName, callback) => {
  fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : '';
  if (fileName) {
    let publicDir = path.join(__dirname, '/../public/');
    fs.readFile(`${publicDir}/${fileName}`,(err, data) => {
      if (!err && data) {
        callback(false, data);
      } else {
        callback('No file could be found');
      }
    })
  } else {
    callback('A valid file name was not found');
  }
}
// Export the module
module.exports = helpers;
