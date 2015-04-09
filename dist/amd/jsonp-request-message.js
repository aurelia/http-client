define(['exports', './headers', './request-message-processor', './transformers'], function (exports, _headers, _requestMessageProcessor, _transformers) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.createJSONPRequestMessageProcessor = createJSONPRequestMessageProcessor;

  var JSONPRequestMessage = function JSONPRequestMessage(uri, callbackParameterName) {
    _classCallCheck(this, JSONPRequestMessage);

    this.method = 'JSONP';
    this.uri = uri;
    this.content = undefined;
    this.headers = new _headers.Headers();
    this.responseType = 'jsonp';
    this.callbackParameterName = callbackParameterName;
  };

  exports.JSONPRequestMessage = JSONPRequestMessage;

  var JSONPXHR = (function () {
    function JSONPXHR() {
      _classCallCheck(this, JSONPXHR);
    }

    _createClass(JSONPXHR, [{
      key: 'open',
      value: function open(method, uri) {
        this.method = method;
        this.uri = uri;
        this.callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
      }
    }, {
      key: 'send',
      value: function send() {
        var _this = this;

        var uri = this.uri + (this.uri.indexOf('?') >= 0 ? '&' : '?') + this.callbackParameterName + '=' + this.callbackName;

        window[this.callbackName] = function (data) {
          delete window[_this.callbackName];
          document.body.removeChild(script);

          if (_this.status === undefined) {
            _this.status = 200;
            _this.statusText = 'OK';
            _this.response = data;
            _this.onload(_this);
          }
        };

        var script = document.createElement('script');
        script.src = uri;
        document.body.appendChild(script);

        if (this.timeout !== undefined) {
          setTimeout(function () {
            if (_this.status === undefined) {
              _this.status = 0;
              _this.ontimeout(new Error('timeout'));
            }
          }, this.timeout);
        }
      }
    }, {
      key: 'abort',
      value: function abort() {
        if (this.status === undefined) {
          this.status = 0;
          this.onabort(new Error('abort'));
        }
      }
    }, {
      key: 'setRequestHeader',
      value: function setRequestHeader() {}
    }]);

    return JSONPXHR;
  })();

  function createJSONPRequestMessageProcessor() {
    return new _requestMessageProcessor.RequestMessageProcessor(JSONPXHR, [_transformers.timeoutTransformer, _transformers.callbackParameterNameTransformer]);
  }
});