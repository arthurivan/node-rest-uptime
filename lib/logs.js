/*
 * Library for storing and rotation logs
 *
 */
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

// Container for the module to be exported
var lib = {};

// Base dir of the .logs folder
lib.baseDir = path.join(__dirname, '/../.logs/');


lib.append = (logFileName, logString, callback) => {
  fs.open(`${lib.baseDir}${logFileName}.log`, 'a', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Append to file and close it
      fs.appendFile(fileDescriptor, `${logString}\n`, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback('Error closing file')
            }
          })
        } else {
          callback('Error appending to file')
        }
      });
    } else {
      callback('Could not open file for appending');
    }
  })
}

// List all the logs, and optionally include compressed files
lib.list = (includeCompressedFiles, callback) => {
  fs.readdir(`${lib.baseDir}`, (err, data) => {
    if (!err && data && data.length > 0) {
      let trimmedFileNames = [];
      data.forEach( (fileName) => {
        if (fileName.indexOf('.log') > -1) {
          trimmedFileNames.push(fileName.replace('.log', ''));
        }
        if (fileName.indexOf('.gz.b64') > -1 && includeCompressedFiles) {
          trimmedFileNames.push(fileName.replace('.gz.b64', ''));
        }
      });
      callback(false, trimmedFileNames);
    } else {
      callback(err);
    }
  })
};

// compress a log
lib.compress = (fileName, newFileName, callback) => {

  // Read the source file
  fs.readFile(`${lib.baseDir}${fileName}.log`, 'utf8',(err, data) => {
    if (!err && data) {
      // Compress the data using gzip
      zlib.gzip(data, (err, buffer) => {
        if (!err && buffer) {
          // Send the data to the destination file
          fs.open(`${lib.baseDir}${newFileName}.gz.b64`, 'wx', (err, fileDescriptor) => {
            if (!err && fileDescriptor) {
              // Write to the destination file
              fs.writeFile(fileDescriptor, buffer.toString('base64'), (err) => {
                if (!err) {
                  fs.close(fileDescriptor, (err) => {
                    if (!err) {
                      callback(false);
                    } else {
                      callback(err);
                    }
                  })
                } else {
                  callback(err);
                }
              })
            } else {
              callback(err);
            }
          })
        } else {
          callback(err)
        }
      })
    } else {
      callback(err);
    }
  });

  // Close the destination file

  /* using streams
  const gzip = zlib.createGzip();
  const inp = fs.createReadStream(lib.baseDir+fileName+'.log');
  const out = fs.createWriteStream(lib.baseDir+newFileName+'.gz.b64');
  inp.pipe(gzip).pipe(out);
  */
}

// Decompress the contents of a .gz file into a string variable
lib.decompress = (fileId, callback) => {
  const fileName = fileId+'.gz.b64';
  fs.readFile(lib.baseDir+fileName, 'utf8', (err, str) => {
    if (!err && str) {
      // Inflate the data
      let inputBuffer = Buffer.from(str, 'base64');
      zlib.unzip(inputBuffer, (err, outputBuffer) => {
        if (!err && outputBuffer) {
          let str = outputBuffer.toString();
          callback(false, str);
        } else {
          callback(err);
        }
      })
    } else {
      callback(err);
    }
  })
}

lib.truncate = (logId, callback) => {
  fs.truncate(lib.baseDir+logId+'.log', 0, (err) => {
    if (!err) {
      callback(false)
    } else {
      callback(err)
    }
  })
}

module.exports = lib;