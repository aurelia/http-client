'use strict';

exports.__esModule = true;
exports.createJSONPRequestMessageProcessor = createJSONPRequestMessageProcessor;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _headers = require('./headers');

var _requestMessageProcessor = require('./request-message-processor');

var _transformers = require('./transformers');

var JSONPRequestMessage = function JSONPRequestMessage(url, callbackParameterName) {
  _classCallCheck(this, JSONPRequestMessage);

  this.method = 'JSONP';
  this.url = url;
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

  JSONPXHR.prototype.open = function open(method, url) {
    this.method = method;
    this.url = url;
    this.callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
  };

  JSONPXHR.prototype.send = function send() {
    var _this = this;

    var url = this.url + (this.url.indexOf('?') >= 0 ? '&' : '?') + encodeURIComponent(this.callbackParameterName) + '=' + this.callbackName;
    var script = document.createElement('script');

    script.src = url;
    script.onerror = function (e) {
      cleanUp();

      _this.status = 0;
      _this.onerror(new Error('error'));
    };

    var cleanUp = function cleanUp() {
      delete window[_this.callbackName];
      document.body.removeChild(script);
    };

    window[this.callbackName] = function (data) {
      cleanUp();

      if (_this.status === undefined) {
        _this.status = 200;
        _this.statusText = 'OK';
        _this.response = data;
        _this.onload(_this);
      }
    };

    document.body.appendChild(script);

    if (this.timeout !== undefined) {
      setTimeout(function () {
        if (_this.status === undefined) {
          _this.status = 0;
          _this.ontimeout(new Error('timeout'));
        }
      }, this.timeout);
    }
  };

  JSONPXHR.prototype.abort = function abort() {
    if (this.status === undefined) {
      this.status = 0;
      this.onabort(new Error('abort'));
    }
  };

  JSONPXHR.prototype.setRequestHeader = function setRequestHeader() {};

  return JSONPXHR;
})();

function createJSONPRequestMessageProcessor() {
  return new _requestMessageProcessor.RequestMessageProcessor(JSONPXHR, [_transformers.timeoutTransformer, _transformers.callbackParameterNameTransformer]);
}