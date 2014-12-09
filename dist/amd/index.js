define(["exports", "./http-client", "./http-request-message", "./http-response-message", "./json-request-message", "./headers"], function (exports, _httpClient, _httpRequestMessage, _httpResponseMessage, _jsonRequestMessage, _headers) {
  "use strict";

  exports.HttpClient = _httpClient.HttpClient;
  exports.HttpRequestMessage = _httpRequestMessage.HttpRequestMessage;
  exports.HttpResponseMessage = _httpResponseMessage.HttpResponseMessage;
  exports.JSONPRequestMessage = _jsonRequestMessage.JSONPRequestMessage;
  exports.Headers = _headers.Headers;
});