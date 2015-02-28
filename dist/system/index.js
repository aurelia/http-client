System.register(["./http-client", "./http-request-message", "./http-response-message", "./jsonp-request-message", "./headers", "./request-builder"], function (_export) {
  return {
    setters: [function (_httpClient) {
      /**
       * An extensible HTTP client provided by Aurelia.
       *
       * @module HttpClient
       */

      _export("HttpClient", _httpClient.HttpClient);
    }, function (_httpRequestMessage) {
      _export("HttpRequestMessage", _httpRequestMessage.HttpRequestMessage);
    }, function (_httpResponseMessage) {
      _export("HttpResponseMessage", _httpResponseMessage.HttpResponseMessage);
    }, function (_jsonpRequestMessage) {
      _export("JSONPRequestMessage", _jsonpRequestMessage.JSONPRequestMessage);
    }, function (_headers) {
      _export("Headers", _headers.Headers);
    }, function (_requestBuilder) {
      _export("RequestBuilder", _requestBuilder.RequestBuilder);
    }],
    execute: function () {
      "use strict";
    }
  };
});