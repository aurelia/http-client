define(['exports', './headers', './request-message-processor', './transformers'], function (exports, _headers, _requestMessageProcessor, _transformers) {
  'use strict';

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

  exports.__esModule = true;
  exports.createHttpRequestMessageProcessor = createHttpRequestMessageProcessor;

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
    return new _requestMessageProcessor.RequestMessageProcessor(XMLHttpRequest, [_transformers.timeoutTransformer, _transformers.credentialsTransformer, _transformers.progressTransformer, _transformers.responseTypeTransformer, _transformers.headerTransformer, _transformers.contentTransformer]);
  }
});