"use strict";

var join = require('aurelia-path').join;
var HttpRequestMessage = require('./http-request-message').HttpRequestMessage;
var HttpResponseMessage = require('./http-response-message').HttpResponseMessage;
var JSONPRequestMessage = require('./json-request-message').JSONPRequestMessage;
var Headers = require('./headers').Headers;
var HttpClient = (function () {
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

  HttpClient.prototype.jsonp = function (uri, callbackParameterName) {
    if (callbackParameterName === undefined) callbackParameterName = "jsoncallback";
    return this.send(new JSONPRequestMessage(join(this.baseUrl, uri), callbackParameterName));
  };

  return HttpClient;
})();

exports.HttpClient = HttpClient;