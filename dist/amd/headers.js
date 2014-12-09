define(["exports"], function (exports) {
  "use strict";

  var Headers = (function () {
    var Headers = function Headers(headers) {
      if (headers === undefined) headers = {};
      this.headers = headers;
    };

    Headers.prototype.add = function (key, value) {
      this.headers[key] = value;
    };

    Headers.prototype.get = function (key) {
      return this.headers[key];
    };

    Headers.prototype.clear = function () {
      this.headers = {};
    };

    Headers.prototype.configureXHR = function (xhr) {
      var headers = this.headers, key;

      for (key in headers) {
        xhr.setRequestHeader(key, headers[key]);
      }
    };

    return Headers;
  })();

  exports.Headers = Headers;
});