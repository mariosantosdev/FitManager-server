// Firstly we'll need to import the fs library
let fs = require('fs');
let moment = require('moment')
moment.locale('pt-br')

// next we'll want make our Logger object available
// to whatever file references it.
let Logger = (exports.Logger = {});

// Create 3 sets of write streams for the 3 levels of logging we wish to do
// every time we get an error we'll append to our error streams, any debug message
// to our debug stream etc...
let infoStream = fs.createWriteStream('logs/info.log');
// Notice we set the path of our log files in the first parameter of
// fs.createWriteStream. This could easily be pulled in from a config
// file if needed.
let errorStream = fs.createWriteStream('logs/error.log');
// createWriteStream takes in options as a second, optional parameter
// if you wanted to set the file encoding of your output file you could
// do so by setting it like so: ('logs/debug.log' , { encoding : 'utf-8' });
let debugStream = fs.createWriteStream('logs/debug.log');

let date = moment(new Date()).format('ddd, DD [de] MMMM [de] YYYY[,] HH:mm:ss')

// Finally we create 3 different functions
// each of which appends our given messages to
// their own log files along with the current date as an
// iso string and a \n newline character
Logger.info = function (msg, file = '') {
  let message = date + ' : ' + msg + ' [' + file + ']' + '\n';
  infoStream.write(message);
};

Logger.debug = function (msg, file = '') {
  let message = date + ' : ' + msg + ' [' + file + ']' + '\n';
  debugStream.write(message);
};

Logger.error = function (msg, file = '') {

  let message = date + ' : ' + msg + ' [' + file + ']' + '\n';
  errorStream.write(message);
};