'use strict';

exports.__esModule = true;
exports.createHttpRequestMessageProcessor = createHttpRequestMessageProcessor;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _headers = require('./headers');

var _requestMessageProcessor = require('./request-message-processor');

var _transformers = require('./transformers');

var HttpRequestMessage = function HttpRequestMessage(method, url, content, headers) {
  _classCallCheck(this, HttpRequestMessage);

  this.method = method;
  this.url = url;
  this.content = content;
  this.headers = headers || new _headers.Headers();
  this.responseType = 'json';
};

exports.HttpRequestMessage = HttpRequestMessage;

function createHttpRequestMessageProcessor() {
  return new _requestMessageProcessor.RequestMessageProcessor(XMLHttpRequest, [_transformers.timeoutTransformer, _transformers.credentialsTransformer, _transformers.progressTransformer, _transformers.responseTypeTransformer, _transformers.contentTransformer, _transformers.headerTransformer]);
}