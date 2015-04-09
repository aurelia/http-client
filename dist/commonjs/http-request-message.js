'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createHttpRequestMessageProcessor = createHttpRequestMessageProcessor;

var _Headers = require('./headers');

var _RequestMessageProcessor = require('./request-message-processor');

var _timeoutTransformer$credentialsTransformer$progressTransformer$responseTypeTransformer$headerTransformer$contentTransformer = require('./transformers');

var HttpRequestMessage = function HttpRequestMessage(method, uri, content, headers) {
  _classCallCheck(this, HttpRequestMessage);

  this.method = method;
  this.uri = uri;
  this.content = content;
  this.headers = headers || new _Headers.Headers();
  this.responseType = 'json';
};

exports.HttpRequestMessage = HttpRequestMessage;

function createHttpRequestMessageProcessor() {
  return new _RequestMessageProcessor.RequestMessageProcessor(XMLHttpRequest, [_timeoutTransformer$credentialsTransformer$progressTransformer$responseTypeTransformer$headerTransformer$contentTransformer.timeoutTransformer, _timeoutTransformer$credentialsTransformer$progressTransformer$responseTypeTransformer$headerTransformer$contentTransformer.credentialsTransformer, _timeoutTransformer$credentialsTransformer$progressTransformer$responseTypeTransformer$headerTransformer$contentTransformer.progressTransformer, _timeoutTransformer$credentialsTransformer$progressTransformer$responseTypeTransformer$headerTransformer$contentTransformer.responseTypeTransformer, _timeoutTransformer$credentialsTransformer$progressTransformer$responseTypeTransformer$headerTransformer$contentTransformer.headerTransformer, _timeoutTransformer$credentialsTransformer$progressTransformer$responseTypeTransformer$headerTransformer$contentTransformer.contentTransformer]);
}