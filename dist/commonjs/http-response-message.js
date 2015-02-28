"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Headers = require("./headers").Headers;

var HttpResponseMessage = exports.HttpResponseMessage = (function () {
  function HttpResponseMessage(requestMessage, xhr, responseType, reviver) {
    _classCallCheck(this, HttpResponseMessage);

    this.requestMessage = requestMessage;
    this.statusCode = xhr.status;
    this.response = xhr.response;
    this.isSuccess = xhr.status >= 200 && xhr.status < 400;
    this.statusText = xhr.statusText;
    this.responseType = responseType;
    this.reviver = reviver;

    if (xhr.getAllResponseHeaders) {
      this.headers = Headers.parse(xhr.getAllResponseHeaders());
    } else {
      this.headers = new Headers();
    }
  }

  _prototypeProperties(HttpResponseMessage, null, {
    content: {
      get: function () {
        try {
          if (this._content !== undefined) {
            return this._content;
          }

          if (this.response === undefined || this.response === null) {
            return this._content = this.response;
          }

          if (this.responseType === "json") {
            return this._content = JSON.parse(this.response, this.reviver);
          }

          if (this.reviver) {
            return this._content = this.reviver(this.response);
          }

          return this._content = this.response;
        } catch (e) {
          if (this.isSuccess) {
            throw e;
          }

          return this._content = null;
        }
      },
      configurable: true
    }
  });

  return HttpResponseMessage;
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});