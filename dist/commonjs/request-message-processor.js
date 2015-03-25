"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var HttpResponseMessage = require("./http-response-message").HttpResponseMessage;

var _aureliaPath = require("aurelia-path");

var join = _aureliaPath.join;
var buildQueryString = _aureliaPath.buildQueryString;

function buildFullUri(message) {
  var uri = join(message.baseUri, message.uri),
      qs;

  if (message.params) {
    qs = buildQueryString(message.params);
    uri = qs ? "" + uri + "?" + qs : uri;
  }

  message.fullUri = uri;
}

var RequestMessageProcessor = exports.RequestMessageProcessor = (function () {
  function RequestMessageProcessor(xhrType, transformers) {
    _classCallCheck(this, RequestMessageProcessor);

    this.XHRType = xhrType;
    this.transformers = transformers;
  }

  _prototypeProperties(RequestMessageProcessor, null, {
    abort: {
      value: function abort() {
        //The logic here is if the xhr object is not set then there is nothing to abort so the intent was carried out
        if (this.xhr) {
          this.xhr.abort();
        }
      },
      writable: true,
      configurable: true
    },
    process: {
      value: function process(client, message) {
        var _this = this;

        return new Promise(function (resolve, reject) {
          var xhr = _this.xhr = new _this.XHRType(),
              transformers = _this.transformers,
              i,
              ii;

          buildFullUri(message);
          xhr.open(message.method, message.fullUri, true);

          for (i = 0, ii = transformers.length; i < ii; ++i) {
            transformers[i](client, _this, message, xhr);
          }

          xhr.onload = function (e) {
            var response = new HttpResponseMessage(message, xhr, message.responseType, message.reviver);
            if (response.isSuccess) {
              resolve(response);
            } else {
              reject(response);
            }
          };

          xhr.ontimeout = function (e) {
            reject(new HttpResponseMessage(message, {
              response: e,
              status: xhr.status,
              statusText: xhr.statusText
            }, "timeout"));
          };

          xhr.onerror = function (e) {
            reject(new HttpResponseMessage(message, {
              response: e,
              status: xhr.status,
              statusText: xhr.statusText
            }, "error"));
          };

          xhr.onabort = function (e) {
            reject(new HttpResponseMessage(message, {
              response: e,
              status: xhr.status,
              statusText: xhr.statusText
            }, "abort"));
          };

          xhr.send(message.content);
        });
      },
      writable: true,
      configurable: true
    }
  });

  return RequestMessageProcessor;
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});