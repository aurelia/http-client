var path = require('path');
var fs = require('fs');

// hide warning //
var emitter = require('events');
emitter.defaultMaxListeners = 20;

var appRoot = 'src/';
var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

var paths = {
  root: appRoot,
  source: appRoot + '**/*.js',
  html: appRoot + '**/*.html',
  style: 'styles/**/*.css',
  output: 'dist/',
  doc:'./doc',
  e2eSpecsSrc: 'test/e2e/src/*.js',
  e2eSpecsDist: 'test/e2e/dist/',
  packageName: pkg.name,
  ignore: [],
  useTypeScriptForDTS: false,
  importsToAdd: [],
  sort: false
};

paths.files = [
  'headers.js',
  'request-message.js',
  'http-response-message.js',
  'request-message-processor.js',
  'xhr-transformers.js',
  'jsonp-request-message.js',
  'http-request-message.js',
  'request-builder.js',
  'http-client.js'
].map(function(file){
  return paths.root + file;
});

module.exports = paths;
