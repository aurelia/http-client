'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _core = require('core-js');

var _core2 = _interopRequireWildcard(_core);

var _Headers = require('./headers');

var _RequestBuilder = require('./request-builder');

var _HttpRequestMessage$createHttpRequestMessageProcessor = require('./http-request-message');

var _JSONPRequestMessage$createJSONPRequestMessageProcessor = require('./jsonp-request-message');

function trackRequestStart(client, processor) {
  client.pendingRequests.push(processor);
  client.isRequesting = true;
}

function trackRequestEnd(client, processor) {
  var index = client.pendingRequests.indexOf(processor);

  client.pendingRequests.splice(index, 1);
  client.isRequesting = client.pendingRequests.length > 0;

  if (!client.isRequesting) {
    var evt = new window.CustomEvent('aurelia-http-client-requests-drained', { bubbles: true, cancelable: true });
    setTimeout(function () {
      return document.dispatchEvent(evt);
    }, 1);
  }
}

var HttpClient = (function () {
  function HttpClient() {
    _classCallCheck(this, HttpClient);

    this.requestTransformers = [];
    this.requestProcessorFactories = new Map();
    this.requestProcessorFactories.set(_HttpRequestMessage$createHttpRequestMessageProcessor.HttpRequestMessage, _HttpRequestMessage$createHttpRequestMessageProcessor.createHttpRequestMessageProcessor);
    this.requestProcessorFactories.set(_JSONPRequestMessage$createJSONPRequestMessageProcessor.JSONPRequestMessage, _JSONPRequestMessage$createJSONPRequestMessageProcessor.createJSONPRequestMessageProcessor);
    this.pendingRequests = [];
    this.isRequesting = false;
  }

  _createClass(HttpClient, [{
    key: 'configure',
    value: function configure(fn) {
      var builder = new _RequestBuilder.RequestBuilder(this);
      fn(builder);
      this.requestTransformers = builder.transformers;
      return this;
    }
  }, {
    key: 'createRequest',
    value: function createRequest(uri) {
      var builder = new _RequestBuilder.RequestBuilder(this);

      if (uri) {
        builder.withUri(uri);
      }

      return builder;
    }
  }, {
    key: 'send',
    value: function send(message, transformers) {
      var _this = this;

      var createProcessor = this.requestProcessorFactories.get(message.constructor),
          processor,
          promise,
          i,
          ii;

      if (!createProcessor) {
        throw new Error('No request message processor factory for ' + message.constructor + '.');
      }

      processor = createProcessor();
      trackRequestStart(this, processor);

      transformers = transformers || this.requestTransformers;

      for (i = 0, ii = transformers.length; i < ii; ++i) {
        transformers[i](this, processor, message);
      }

      promise = processor.process(this, message).then(function (response) {
        trackRequestEnd(_this, processor);
        return response;
      })['catch'](function (response) {
        trackRequestEnd(_this, processor);
        throw response;
      });

      promise.abort = promise.cancel = function () {
        processor.abort();
      };

      return promise;
    }
  }, {
    key: 'delete',
    value: function _delete(uri) {
      return this.createRequest(uri).asDelete().send();
    }
  }, {
    key: 'get',
    value: function get(uri) {
      return this.createRequest(uri).asGet().send();
    }
  }, {
    key: 'head',
    value: function head(uri) {
      return this.createRequest(uri).asHead().send();
    }
  }, {
    key: 'jsonp',
    value: function jsonp(uri) {
      var callbackParameterName = arguments[1] === undefined ? 'jsoncallback' : arguments[1];

      return this.createRequest(uri).asJsonp(callbackParameterName).send();
    }
  }, {
    key: 'options',
    value: function options(uri) {
      return this.createRequest(uri).asOptions().send();
    }
  }, {
    key: 'put',
    value: function put(uri, content) {
      return this.createRequest(uri).asPut().withContent(content).send();
    }
  }, {
    key: 'patch',
    value: function patch(uri, content) {
      return this.createRequest(uri).asPatch().withContent(content).send();
    }
  }, {
    key: 'post',
    value: function post(uri, content) {
      return this.createRequest(uri).asPost().withContent(content).send();
    }
  }]);

  return HttpClient;
})();

exports.HttpClient = HttpClient;