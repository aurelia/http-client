System.register(["aurelia-path", "./http-request-message", "./http-response-message", "./jsonp-request-message", "./headers"], function (_export) {
  "use strict";

  var join, HttpRequestMessage, HttpResponseMessage, JSONPRequestMessage, Headers, _prototypeProperties, HttpClient;
  return {
    setters: [function (_aureliaPath) {
      join = _aureliaPath.join;
    }, function (_httpRequestMessage) {
      HttpRequestMessage = _httpRequestMessage.HttpRequestMessage;
    }, function (_httpResponseMessage) {
      HttpResponseMessage = _httpResponseMessage.HttpResponseMessage;
    }, function (_jsonpRequestMessage) {
      JSONPRequestMessage = _jsonpRequestMessage.JSONPRequestMessage;
    }, function (_headers) {
      Headers = _headers.Headers;
    }],
    execute: function () {
      _prototypeProperties = function (child, staticProps, instanceProps) {
        if (staticProps) Object.defineProperties(child, staticProps);
        if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
      };

      HttpClient = (function () {
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
      _export("HttpClient", HttpClient);
    }
  };
});