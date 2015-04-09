define(['exports', './http-client', './http-request-message', './http-response-message', './jsonp-request-message', './headers', './request-builder'], function (exports, _httpClient, _httpRequestMessage, _httpResponseMessage, _jsonpRequestMessage, _headers, _requestBuilder) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  Object.defineProperty(exports, 'HttpClient', {
    enumerable: true,
    get: function get() {
      return _httpClient.HttpClient;
    }
  });
  Object.defineProperty(exports, 'HttpRequestMessage', {
    enumerable: true,
    get: function get() {
      return _httpRequestMessage.HttpRequestMessage;
    }
  });
  Object.defineProperty(exports, 'HttpResponseMessage', {
    enumerable: true,
    get: function get() {
      return _httpResponseMessage.HttpResponseMessage;
    }
  });
  Object.defineProperty(exports, 'mimeTypes', {
    enumerable: true,
    get: function get() {
      return _httpResponseMessage.mimeTypes;
    }
  });
  Object.defineProperty(exports, 'JSONPRequestMessage', {
    enumerable: true,
    get: function get() {
      return _jsonpRequestMessage.JSONPRequestMessage;
    }
  });
  Object.defineProperty(exports, 'Headers', {
    enumerable: true,
    get: function get() {
      return _headers.Headers;
    }
  });
  Object.defineProperty(exports, 'RequestBuilder', {
    enumerable: true,
    get: function get() {
      return _requestBuilder.RequestBuilder;
    }
  });
});