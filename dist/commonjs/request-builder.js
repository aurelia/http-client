'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _join = require('aurelia-path');

var _HttpRequestMessage = require('./http-request-message');

var _JSONPRequestMessage = require('./jsonp-request-message');

var RequestBuilder = (function () {
  function RequestBuilder(client) {
    _classCallCheck(this, RequestBuilder);

    this.client = client;
    this.transformers = client.requestTransformers.slice(0);
    this.useJsonp = false;
  }

  _createClass(RequestBuilder, [{
    key: 'send',
    value: function send() {
      var message = this.useJsonp ? new _JSONPRequestMessage.JSONPRequestMessage() : new _HttpRequestMessage.HttpRequestMessage();
      return this.client.send(message, this.transformers);
    }
  }], [{
    key: 'addHelper',
    value: function addHelper(name, fn) {
      RequestBuilder.prototype[name] = function () {
        this.transformers.push(fn.apply(this, arguments));
        return this;
      };
    }
  }]);

  return RequestBuilder;
})();

exports.RequestBuilder = RequestBuilder;

RequestBuilder.addHelper('asDelete', function () {
  return function (client, processor, message) {
    message.method = 'DELETE';
  };
});

RequestBuilder.addHelper('asGet', function () {
  return function (client, processor, message) {
    message.method = 'GET';
  };
});

RequestBuilder.addHelper('asHead', function () {
  return function (client, processor, message) {
    message.method = 'HEAD';
  };
});

RequestBuilder.addHelper('asOptions', function () {
  return function (client, processor, message) {
    message.method = 'OPTIONS';
  };
});

RequestBuilder.addHelper('asPatch', function () {
  return function (client, processor, message) {
    message.method = 'PATCH';
  };
});

RequestBuilder.addHelper('asPost', function () {
  return function (client, processor, message) {
    message.method = 'POST';
  };
});

RequestBuilder.addHelper('asPut', function () {
  return function (client, processor, message) {
    message.method = 'PUT';
  };
});

RequestBuilder.addHelper('asJsonp', function (callbackParameterName) {
  this.useJsonp = true;
  return function (client, processor, message) {
    message.callbackParameterName = callbackParameterName;
  };
});

RequestBuilder.addHelper('withUri', function (uri) {
  return function (client, processor, message) {
    message.uri = uri;
  };
});

RequestBuilder.addHelper('withContent', function (content) {
  return function (client, processor, message) {
    message.content = content;
  };
});

RequestBuilder.addHelper('withBaseUri', function (baseUri) {
  return function (client, processor, message) {
    message.baseUri = baseUri;
  };
});

RequestBuilder.addHelper('withParams', function (params) {
  return function (client, processor, message) {
    message.params = params;
  };
});

RequestBuilder.addHelper('withResponseType', function (responseType) {
  return function (client, processor, message) {
    message.responseType = responseType;
  };
});

RequestBuilder.addHelper('withTimeout', function (timeout) {
  return function (client, processor, message) {
    message.timeout = timeout;
  };
});

RequestBuilder.addHelper('withHeader', function (key, value) {
  return function (client, processor, message) {
    message.headers.add(key, value);
  };
});

RequestBuilder.addHelper('withCredentials', function (value) {
  return function (client, processor, message) {
    message.withCredentials = value;
  };
});

RequestBuilder.addHelper('withReviver', function (reviver) {
  return function (client, processor, message) {
    message.reviver = reviver;
  };
});

RequestBuilder.addHelper('withReplacer', function (replacer) {
  return function (client, processor, message) {
    message.replacer = replacer;
  };
});

RequestBuilder.addHelper('withProgressCallback', function (progressCallback) {
  return function (client, processor, message) {
    message.progressCallback = progressCallback;
  };
});

RequestBuilder.addHelper('withCallbackParameterName', function (callbackParameterName) {
  return function (client, processor, message) {
    message.callbackParameterName = callbackParameterName;
  };
});