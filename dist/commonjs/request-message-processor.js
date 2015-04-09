'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _core = require('core-js');

var _core2 = _interopRequireWildcard(_core);

var _HttpResponseMessage = require('./http-response-message');

var _join$buildQueryString = require('aurelia-path');

function buildFullUri(message) {
  var uri = _join$buildQueryString.join(message.baseUri, message.uri),
      qs;

  if (message.params) {
    qs = _join$buildQueryString.buildQueryString(message.params);
    uri = qs ? '' + uri + '?' + qs : uri;
  }

  message.fullUri = uri;
}

var RequestMessageProcessor = (function () {
  function RequestMessageProcessor(xhrType, transformers) {
    _classCallCheck(this, RequestMessageProcessor);

    this.XHRType = xhrType;
    this.transformers = transformers;
  }

  _createClass(RequestMessageProcessor, [{
    key: 'abort',
    value: function abort() {
      if (this.xhr) {
        this.xhr.abort();
      }
    }
  }, {
    key: 'process',
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
          var response = new _HttpResponseMessage.HttpResponseMessage(message, xhr, message.responseType, message.reviver);
          if (response.isSuccess) {
            resolve(response);
          } else {
            reject(response);
          }
        };

        xhr.ontimeout = function (e) {
          reject(new _HttpResponseMessage.HttpResponseMessage(message, {
            response: e,
            status: xhr.status,
            statusText: xhr.statusText
          }, 'timeout'));
        };

        xhr.onerror = function (e) {
          reject(new _HttpResponseMessage.HttpResponseMessage(message, {
            response: e,
            status: xhr.status,
            statusText: xhr.statusText
          }, 'error'));
        };

        xhr.onabort = function (e) {
          reject(new _HttpResponseMessage.HttpResponseMessage(message, {
            response: e,
            status: xhr.status,
            statusText: xhr.statusText
          }, 'abort'));
        };

        xhr.send(message.content);
      });
    }
  }]);

  return RequestMessageProcessor;
})();

exports.RequestMessageProcessor = RequestMessageProcessor;