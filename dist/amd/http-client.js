define(["exports", "aurelia-path", "./http-request-message", "./http-response-message", "./json-request-message", "./headers"], function (exports, _aureliaPath, _httpRequestMessage, _httpResponseMessage, _jsonRequestMessage, _headers) {
  "use strict";

  var normalize = _aureliaPath.normalize;
  var HttpRequestMessage = _httpRequestMessage.HttpRequestMessage;
  var HttpResponseMessage = _httpResponseMessage.HttpResponseMessage;
  var JSONPRequestMessage = _jsonRequestMessage.JSONPRequestMessage;
  var Headers = _headers.Headers;
  var HttpClient = (function () {
    var HttpClient = function HttpClient() {
      this.baseAddress = "";
      this.defaultRequestHeaders = new Headers();
    };

    HttpClient.prototype.send = function (requestMessage, progressCallback) {
      return requestMessage.send(this, progressCallback);
    };

    HttpClient.prototype.get = function (uri) {
      return this.send(new HttpRequestMessage("GET", normalize(uri, this.baseAddress)).withHeaders(this.defaultRequestHeaders));
    };

    HttpClient.prototype.put = function (uri, content, replacer) {
      return this.send(new HttpRequestMessage("PUT", normalize(uri, this.baseAddress), content, replacer || this.replacer).withHeaders(this.defaultRequestHeaders));
    };

    HttpClient.prototype.post = function (uri, content, replacer) {
      return this.send(new HttpRequestMessage("POST", normalize(uri, this.baseAddress), content, replacer || this.replacer).withHeaders(this.defaultRequestHeaders));
    };

    HttpClient.prototype["delete"] = function (uri) {
      return this.send(new HttpRequestMessage("DELETE", normalize(uri, this.baseAddress)).withHeaders(this.defaultRequestHeaders));
    };

    HttpClient.prototype.jsonp = function (uri, callbackParameterName) {
      if (callbackParameterName === undefined) callbackParameterName = "jsoncallback";
      return this.send(new JSONPRequestMessage(normalize(uri, this.baseAddress), callbackParameterName));
    };

    return HttpClient;
  })();

  exports.HttpClient = HttpClient;
});