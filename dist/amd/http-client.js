define(["exports", "aurelia-path", "./http-request-message", "./http-response-message", "./jsonp-request-message", "./headers"], function (exports, _aureliaPath, _httpRequestMessage, _httpResponseMessage, _jsonpRequestMessage, _headers) {
  "use strict";

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var join = _aureliaPath.join;
  var HttpRequestMessage = _httpRequestMessage.HttpRequestMessage;
  var HttpResponseMessage = _httpResponseMessage.HttpResponseMessage;
  var JSONPRequestMessage = _jsonpRequestMessage.JSONPRequestMessage;
  var Headers = _headers.Headers;
  var HttpClient = (function () {
    var HttpClient = function HttpClient() {
      var _this = this;
      var baseUrl = arguments[0] === undefined ? null : arguments[0];
      var defaultRequestHeaders = arguments[1] === undefined ? new Headers() : arguments[1];
      return (function () {
        _this.baseUrl = baseUrl;
        _this.defaultRequestHeaders = defaultRequestHeaders;
      })();
    };

    _prototypeProperties(HttpClient, null, {
      send: {
        value: function (requestMessage, progressCallback) {
          return requestMessage.send(this, progressCallback);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      get: {
        value: function (uri) {
          return this.send(new HttpRequestMessage("GET", join(this.baseUrl, uri)).withHeaders(this.defaultRequestHeaders));
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      put: {
        value: function (uri, content, replacer) {
          return this.send(new HttpRequestMessage("PUT", join(this.baseUrl, uri), content, replacer || this.replacer).withHeaders(this.defaultRequestHeaders));
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      patch: {
        value: function (uri, content, replacer) {
          return this.send(new HttpRequestMessage("PATCH", join(this.baseUrl, uri), content, replacer || this.replacer).withHeaders(this.defaultRequestHeaders));
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      post: {
        value: function (uri, content, replacer) {
          return this.send(new HttpRequestMessage("POST", join(this.baseUrl, uri), content, replacer || this.replacer).withHeaders(this.defaultRequestHeaders));
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      "delete": {
        value: function (uri) {
          return this.send(new HttpRequestMessage("DELETE", join(this.baseUrl, uri)).withHeaders(this.defaultRequestHeaders));
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      jsonp: {
        value: function (uri) {
          var callbackParameterName = arguments[1] === undefined ? "jsoncallback" : arguments[1];
          return this.send(new JSONPRequestMessage(join(this.baseUrl, uri), callbackParameterName));
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return HttpClient;
  })();

  exports.HttpClient = HttpClient;
});