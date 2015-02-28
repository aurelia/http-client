"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Headers = exports.Headers = (function () {
  function Headers() {
    var headers = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Headers);

    this.headers = headers;
  }

  _prototypeProperties(Headers, {
    parse: {

      /**
       * XmlHttpRequest's getAllResponseHeaders() method returns a string of response
       * headers according to the format described here:
       * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
       * This method parses that string into a user-friendly key/value pair object.
       */

      value: function parse(headerStr) {
        var headers = new Headers();
        if (!headerStr) {
          return headers;
        }

        var headerPairs = headerStr.split("\r\n");
        for (var i = 0; i < headerPairs.length; i++) {
          var headerPair = headerPairs[i];
          // Can't use split() here because it does the wrong thing
          // if the header value has the string ": " in it.
          var index = headerPair.indexOf(": ");
          if (index > 0) {
            var key = headerPair.substring(0, index);
            var val = headerPair.substring(index + 2);
            headers.add(key, val);
          }
        }

        return headers;
      },
      writable: true,
      configurable: true
    }
  }, {
    add: {
      value: function add(key, value) {
        this.headers[key] = value;
      },
      writable: true,
      configurable: true
    },
    get: {
      value: function get(key) {
        return this.headers[key];
      },
      writable: true,
      configurable: true
    },
    clear: {
      value: function clear() {
        this.headers = {};
      },
      writable: true,
      configurable: true
    },
    configureXHR: {
      value: function configureXHR(xhr) {
        var headers = this.headers,
            key;

        for (key in headers) {
          xhr.setRequestHeader(key, headers[key]);
        }
      },
      writable: true,
      configurable: true
    }
  });

  return Headers;
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});