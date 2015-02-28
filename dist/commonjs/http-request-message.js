"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

exports.createHttpRequestMessageProcessor = createHttpRequestMessageProcessor;

var Headers = require("./headers").Headers;

var RequestMessageProcessor = require("./request-message-processor").RequestMessageProcessor;

var _transformers = require("./transformers");

var timeoutTransformer = _transformers.timeoutTransformer;
var credentialsTransformer = _transformers.credentialsTransformer;
var progressTransformer = _transformers.progressTransformer;
var responseTypeTransformer = _transformers.responseTypeTransformer;
var headerTransformer = _transformers.headerTransformer;
var contentTransformer = _transformers.contentTransformer;

var HttpRequestMessage = exports.HttpRequestMessage = function HttpRequestMessage(method, uri, content, headers) {
  _classCallCheck(this, HttpRequestMessage);

  this.method = method;
  this.uri = uri;
  this.content = content;
  this.headers = headers || new Headers();
  this.responseType = "json"; //text, arraybuffer, blob, document
};

function createHttpRequestMessageProcessor() {
  return new RequestMessageProcessor(XMLHttpRequest, [timeoutTransformer, credentialsTransformer, progressTransformer, responseTypeTransformer, headerTransformer, contentTransformer]);
}

Object.defineProperty(exports, "__esModule", {
  value: true
});