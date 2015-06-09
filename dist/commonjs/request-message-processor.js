'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _coreJs = require('core-js');

var _coreJs2 = _interopRequireDefault(_coreJs);

var _httpResponseMessage = require('./http-response-message');

var _aureliaPath = require('aurelia-path');

function buildFullUrl(message) {
  var url = (0, _aureliaPath.join)(message.baseUrl, message.url),
      qs;

  if (message.params) {
    qs = (0, _aureliaPath.buildQueryString)(message.params);
    url = qs ? '' + url + '?' + qs : url;
  }

  message.fullUrl = url;
}

var RequestMessageProcessor = (function () {
  function RequestMessageProcessor(xhrType, transformers) {
    _classCallCheck(this, RequestMessageProcessor);

    this.XHRType = xhrType;
    this.transformers = transformers;
    this.isAborted = false;
  }

  RequestMessageProcessor.prototype.abort = function abort() {
    if (this.xhr && this.xhr.readyState !== XMLHttpRequest.UNSENT) {
      this.xhr.abort();
    }
    this.isAborted = true;
  };

  RequestMessageProcessor.prototype.process = function process(client, message) {
    var _this = this;

    var promise = new Promise(function (resolve, reject) {
      var xhr = _this.xhr = new _this.XHRType(),
          transformers = _this.transformers,
          i,
          ii;

      buildFullUrl(message);
      xhr.open(message.method, message.fullUrl, true);

      for (i = 0, ii = transformers.length; i < ii; ++i) {
        transformers[i](client, _this, message, xhr);
      }

      xhr.onload = function (e) {
        var response = new _httpResponseMessage.HttpResponseMessage(message, xhr, message.responseType, message.reviver);
        if (response.isSuccess) {
          resolve(response);
        } else {
          reject(response);
        }
      };

      xhr.ontimeout = function (e) {
        reject(new _httpResponseMessage.HttpResponseMessage(message, {
          response: e,
          status: xhr.status,
          statusText: xhr.statusText
        }, 'timeout'));
      };

      xhr.onerror = function (e) {
        reject(new _httpResponseMessage.HttpResponseMessage(message, {
          response: e,
          status: xhr.status,
          statusText: xhr.statusText
        }, 'error'));
      };

      xhr.onabort = function (e) {
        reject(new _httpResponseMessage.HttpResponseMessage(message, {
          response: e,
          status: xhr.status,
          statusText: xhr.statusText
        }, 'abort'));
      };
    });

    return Promise.resolve(message).then(function (message) {
      var processRequest = function processRequest() {
        if (_this.isAborted) {
          _this.xhr.abort();
        } else {
          _this.xhr.send(message.content);
        }

        return promise;
      };

      var chain = [[processRequest, undefined]];

      var interceptors = message.interceptors || [];
      interceptors.forEach(function (interceptor) {
        if (interceptor.request || interceptor.requestError) {
          chain.unshift([interceptor.request ? interceptor.request.bind(interceptor) : undefined, interceptor.requestError ? interceptor.requestError.bind(interceptor) : undefined]);
        }

        if (interceptor.response || interceptor.responseError) {
          chain.push([interceptor.response ? interceptor.response.bind(interceptor) : undefined, interceptor.responseError ? interceptor.responseError.bind(interceptor) : undefined]);
        }
      });

      var interceptorsPromise = Promise.resolve(message);

      while (chain.length) {
        interceptorsPromise = interceptorsPromise.then.apply(interceptorsPromise, chain.shift());
      }

      return interceptorsPromise;
    });
  };

  return RequestMessageProcessor;
})();

exports.RequestMessageProcessor = RequestMessageProcessor;