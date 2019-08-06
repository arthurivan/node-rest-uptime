// Library for storing and editing data

// Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

// Container for the module to be exported
const lib = {};

// Base dir of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = (dir, fileName, data, callback) => {
  // Open the fileName for writing
  fs.open(`${lib.baseDir}${dir}/${fileName}.json`, 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Convert data to string
      const stringData = JSON.stringify(data);
      // Write to file and close it
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback('Error closing new file');
            }
          });
        } else {
          callback('Error writing to new file');
        }
      });
    } else {
      callback('Could not create new file, it may already exist');
    }
  });
};

// Read data from a file
lib.read = (dir, fileName, callback) => {
  fs.readFile(`${lib.baseDir}${dir}/${fileName}.json`, 'utf8', (err, data) => {
    if (!err && data) {
      let parsedData = helpers.parseJsonToObject(data);
      callback(false, parsedData);
    } else {
      callback(err, data);
    }
  });
};

//  Update data inside a fileName
lib.update = (dir, fileName, data, callback) => {
  // Open the fileName for writing
  fs.open(`${lib.baseDir}${dir}/${fileName}.json`, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);

      // Truncate the fileDescriptor
      fs.truncate(fileDescriptor, (err) => {
        if (!err) {
          // Write to the file and close it
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback('Error closing file');
                }
              });
            } else {
              callback('Error writing to file');
            }
          });
        } else {
          callback('Error truncating file');
        }
      });
    } else {
      callback('Could not open the file for updating, it may not exist');
    }
  });
};

// Delete file
lib.delete = (dir, fileName, callback) => {
  // Unlink the fileName
  fs.unlink(`${lib.baseDir}${dir}/${fileName}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback(err);
    }
  });
};

// List files in dir
lib.list = (dir, callback) => {
  fs.readdir(`${lib.baseDir}${dir}/`, (err, data) => {
    if (!err && data && data.length > 0) {
      let trimmedFileNames = [];
      data.forEach((fileName) => {
        trimmedFileNames.push(fileName.replace('.json',''));
      });
      callback(false, trimmedFileNames);
    } else {
      callback(err, data);
    }
  })
}
// Export the module
module.exports = lib;
