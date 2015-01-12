define(["exports"], function (exports) {
  "use strict";

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Headers = (function () {
    var Headers = function Headers() {
      var headers = arguments[0] === undefined ? {} : arguments[0];
      this.headers = headers;
    };

    _prototypeProperties(Headers, null, {
      add: {
        value: function (key, value) {
          this.headers[key] = value;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      get: {
        value: function (key) {
          return this.headers[key];
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      clear: {
        value: function () {
          this.headers = {};
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      configureXHR: {
        value: function (xhr) {
          var headers = this.headers, key;

          for (key in headers) {
            xhr.setRequestHeader(key, headers[key]);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Headers;
  })();

  exports.Headers = Headers;
});