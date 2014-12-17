define(["exports", "aurelia-path", "./http-request-message", "./http-response-message", "./json-request-message", "./headers"], function (exports, _aureliaPath, _httpRequestMessage, _httpResponseMessage, _jsonRequestMessage, _headers) {
  "use strict";

  var join = _aureliaPath.join;
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
      return this.send(new HttpRequestMessage("GET", join(this.baseAddress, uri)).withHeaders(this.defaultRequestHeaders));
    };

    HttpClient.prototype.put = function (uri, content, replacer) {
      return this.send(new HttpRequestMessage("PUT", join(this.baseAddress, uri), content, replacer || this.replacer).withHeaders(this.defaultRequestHeaders));
    };

    HttpClient.prototype.post = function (uri, content, replacer) {
      return this.send(new HttpRequestMessage("POST", join(this.baseAddress, uri), content, replacer || this.replacer).withHeaders(this.defaultRequestHeaders));
    };

    HttpClient.prototype["delete"] = function (uri) {
      return this.send(new HttpRequestMessage("DELETE", join(this.baseAddress, uri)).withHeaders(this.defaultRequestHeaders));
    };

    HttpClient.prototype.jsonp = function (uri, callbackParameterName) {
      if (callbackParameterName === undefined) callbackParameterName = "jsoncallback";
      return this.send(new JSONPRequestMessage(join(this.baseAddress, uri), callbackParameterName));
    };

    return HttpClient;
  })();

  exports.HttpClient = HttpClient;
});