System.register(['core-js', './headers', './request-builder', './http-request-message', './jsonp-request-message'], function (_export) {
  var core, Headers, RequestBuilder, HttpRequestMessage, createHttpRequestMessageProcessor, JSONPRequestMessage, createJSONPRequestMessageProcessor, _classCallCheck, _createClass, HttpClient;

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

  return {
    setters: [function (_coreJs) {
      core = _coreJs['default'];
    }, function (_headers) {
      Headers = _headers.Headers;
    }, function (_requestBuilder) {
      RequestBuilder = _requestBuilder.RequestBuilder;
    }, function (_httpRequestMessage) {
      HttpRequestMessage = _httpRequestMessage.HttpRequestMessage;
      createHttpRequestMessageProcessor = _httpRequestMessage.createHttpRequestMessageProcessor;
    }, function (_jsonpRequestMessage) {
      JSONPRequestMessage = _jsonpRequestMessage.JSONPRequestMessage;
      createJSONPRequestMessageProcessor = _jsonpRequestMessage.createJSONPRequestMessageProcessor;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      HttpClient = (function () {
        function HttpClient() {
          _classCallCheck(this, HttpClient);

          this.requestTransformers = [];
          this.requestProcessorFactories = new Map();
          this.requestProcessorFactories.set(HttpRequestMessage, createHttpRequestMessageProcessor);
          this.requestProcessorFactories.set(JSONPRequestMessage, createJSONPRequestMessageProcessor);
          this.pendingRequests = [];
          this.isRequesting = false;
        }

        _createClass(HttpClient, [{
          key: 'configure',
          value: function configure(fn) {
            var builder = new RequestBuilder(this);
            fn(builder);
            this.requestTransformers = builder.transformers;
            return this;
          }
        }, {
          key: 'createRequest',
          value: function createRequest(uri) {
            var builder = new RequestBuilder(this);

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

      _export('HttpClient', HttpClient);
    }
  };
});