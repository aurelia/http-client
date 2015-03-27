define(["exports", "./headers", "./request-builder", "./http-request-message", "./jsonp-request-message"], function (exports, _headers, _requestBuilder, _httpRequestMessage, _jsonpRequestMessage) {
  "use strict";

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Headers = _headers.Headers;
  var RequestBuilder = _requestBuilder.RequestBuilder;
  var HttpRequestMessage = _httpRequestMessage.HttpRequestMessage;
  var createHttpRequestMessageProcessor = _httpRequestMessage.createHttpRequestMessageProcessor;
  var JSONPRequestMessage = _jsonpRequestMessage.JSONPRequestMessage;
  var createJSONPRequestMessageProcessor = _jsonpRequestMessage.createJSONPRequestMessageProcessor;

  function trackRequestStart(client, processor) {
    client.pendingRequests.push(processor);
    client.isRequesting = true;
  }

  function trackRequestEnd(client, processor) {
    var index = client.pendingRequests.indexOf(processor);

    client.pendingRequests.splice(index, 1);
    client.isRequesting = client.pendingRequests.length > 0;

    if (!client.isRequesting) {
      var evt = new window.CustomEvent("aurelia-http-client-requests-drained", { bubbles: true, cancelable: true });
      setTimeout(function () {
        return document.dispatchEvent(evt);
      }, 1);
    }
  }

  /**
  * The main HTTP client object.
  *
  * @class HttpClient
  * @constructor
  */

  var HttpClient = exports.HttpClient = (function () {
    function HttpClient() {
      _classCallCheck(this, HttpClient);

      this.requestTransformers = [];
      this.requestProcessorFactories = new Map();
      this.requestProcessorFactories.set(HttpRequestMessage, createHttpRequestMessageProcessor);
      this.requestProcessorFactories.set(JSONPRequestMessage, createJSONPRequestMessageProcessor);
      this.pendingRequests = [];
      this.isRequesting = false;
    }

    _prototypeProperties(HttpClient, null, {
      configure: {

        /**
         * Configure this HttpClient with default settings to be used by all requests.
         *
         * @method configure
         * @param {Function} fn A function that takes a RequestBuilder as an argument.
         * @chainable
         */

        value: function configure(fn) {
          var builder = new RequestBuilder(this);
          fn(builder);
          this.requestTransformers = builder.transformers;
          return this;
        },
        writable: true,
        configurable: true
      },
      createRequest: {

        /**
         * Returns a new RequestBuilder for this HttpClient instance that can be used to build and send HTTP requests.
         *
         * @method createRequest
         * @param uri The target URI.
         * @type RequestBuilder
         */

        value: function createRequest(uri) {
          var builder = new RequestBuilder(this);

          if (uri) {
            builder.withUri(uri);
          }

          return builder;
        },
        writable: true,
        configurable: true
      },
      send: {

        /**
         * Sends a message using the underlying networking stack.
         *
         * @method send
         * @param message A configured HttpRequestMessage or JSONPRequestMessage.
         * @param {Array} transformers A collection of transformers to apply to the HTTP request.
         * @return {Promise} A cancellable promise object.
         */

        value: function send(message, transformers) {
          var _this = this;

          var createProcessor = this.requestProcessorFactories.get(message.constructor),
              processor,
              promise,
              i,
              ii;

          if (!createProcessor) {
            throw new Error("No request message processor factory for " + message.constructor + ".");
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
          })["catch"](function (response) {
            trackRequestEnd(_this, processor);
            throw response;
          });

          promise.abort = promise.cancel = function () {
            processor.abort();
          };

          return promise;
        },
        writable: true,
        configurable: true
      },
      "delete": {

        /**
         * Sends an HTTP DELETE request.
         *
         * @method delete
         * @param {String} uri The target URI.
         * @return {Promise} A cancellable promise object.
         */

        value: function _delete(uri) {
          return this.createRequest(uri).asDelete().send();
        },
        writable: true,
        configurable: true
      },
      get: {

        /**
         * Sends an HTTP GET request.
         *
         * @method get
         * @param {String} uri The target URI.
         * @return {Promise} A cancellable promise object.
         */

        value: function get(uri) {
          return this.createRequest(uri).asGet().send();
        },
        writable: true,
        configurable: true
      },
      head: {

        /**
         * Sends an HTTP HEAD request.
         *
         * @method head
         * @param {String} uri The target URI.
         * @return {Promise} A cancellable promise object.
         */

        value: function head(uri) {
          return this.createRequest(uri).asHead().send();
        },
        writable: true,
        configurable: true
      },
      jsonp: {

        /**
         * Sends a JSONP request.
         *
         * @method jsonp
         * @param {String} uri The target URI.
         * @return {Promise} A cancellable promise object.
         */

        value: function jsonp(uri) {
          var callbackParameterName = arguments[1] === undefined ? "jsoncallback" : arguments[1];

          return this.createRequest(uri).asJsonp(callbackParameterName).send();
        },
        writable: true,
        configurable: true
      },
      options: {

        /**
         * Sends an HTTP OPTIONS request.
         *
         * @method options
         * @param {String} uri The target URI.
         * @return {Promise} A cancellable promise object.
         */

        value: function options(uri) {
          return this.createRequest(uri).asOptions().send();
        },
        writable: true,
        configurable: true
      },
      put: {

        /**
         * Sends an HTTP PUT request.
         *
         * @method put
         * @param {String} uri The target URI.
         * @param {Object} uri The request payload.
         * @return {Promise} A cancellable promise object.
         */

        value: function put(uri, content) {
          return this.createRequest(uri).asPut().withContent(content).send();
        },
        writable: true,
        configurable: true
      },
      patch: {

        /**
         * Sends an HTTP PATCH request.
         *
         * @method patch
         * @param {String} uri The target URI.
         * @param {Object} uri The request payload.
         * @return {Promise} A cancellable promise object.
         */

        value: function patch(uri, content) {
          return this.createRequest(uri).asPatch().withContent(content).send();
        },
        writable: true,
        configurable: true
      },
      post: {

        /**
         * Sends an HTTP POST request.
         *
         * @method post
         * @param {String} uri The target URI.
         * @param {Object} uri The request payload.
         * @return {Promise} A cancellable promise object.
         */

        value: function post(uri, content) {
          return this.createRequest(uri).asPost().withContent(content).send();
        },
        writable: true,
        configurable: true
      }
    });

    return HttpClient;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});