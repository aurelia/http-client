define(["exports", "aurelia-path", "./http-request-message", "./http-response-message", "./jsonp-request-message", "./headers"], function (exports, _aureliaPath, _httpRequestMessage, _httpResponseMessage, _jsonpRequestMessage, _headers) {
  "use strict";

  var join = _aureliaPath.join;
  var HttpRequestMessage = _httpRequestMessage.HttpRequestMessage;
  var HttpResponseMessage = _httpResponseMessage.HttpResponseMessage;
  var JSONPRequestMessage = _jsonpRequestMessage.JSONPRequestMessage;
  var Headers = _headers.Headers;
  var HttpClient = function HttpClient() {
    this.baseUrl = null;
    this.defaultRequestHeaders = new Headers();
  };

  HttpClient.prototype.send = function (requestMessage, progressCallback) {
    return requestMessage.send(this, progressCallback);
  };

  HttpClient.prototype.get = function (uri) {
    return this.send(new HttpRequestMessage("GET", join(this.baseUrl, uri)).withHeaders(this.defaultRequestHeaders));
  };

  HttpClient.prototype.put = function (uri, content, replacer) {
    return this.send(new HttpRequestMessage("PUT", join(this.baseUrl, uri), content, replacer || this.replacer).withHeaders(this.defaultRequestHeaders));
  };

  HttpClient.prototype.post = function (uri, content, replacer) {
    return this.send(new HttpRequestMessage("POST", join(this.baseUrl, uri), content, replacer || this.replacer).withHeaders(this.defaultRequestHeaders));
  };

  HttpClient.prototype["delete"] = function (uri) {
    return this.send(new HttpRequestMessage("DELETE", join(this.baseUrl, uri)).withHeaders(this.defaultRequestHeaders));
  };

  HttpClient.prototype.jsonp = function (uri) {
    var callbackParameterName = arguments[1] === undefined ? "jsoncallback" : arguments[1];
    return this.send(new JSONPRequestMessage(join(this.baseUrl, uri), callbackParameterName));
  };

  exports.HttpClient = HttpClient;
});