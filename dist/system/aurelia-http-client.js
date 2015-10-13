System.register(['core-js', 'aurelia-path', 'aurelia-pal'], function (_export) {
  'use strict';

  var join, buildQueryString, PLATFORM, DOM, Headers, RequestMessage, HttpResponseMessage, mimeTypes, RequestMessageProcessor, JSONPRequestMessage, JSONPXHR, HttpRequestMessage, RequestBuilder, HttpClient;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  _export('timeoutTransformer', timeoutTransformer);

  _export('callbackParameterNameTransformer', callbackParameterNameTransformer);

  _export('credentialsTransformer', credentialsTransformer);

  _export('progressTransformer', progressTransformer);

  _export('responseTypeTransformer', responseTypeTransformer);

  _export('headerTransformer', headerTransformer);

  _export('contentTransformer', contentTransformer);

  _export('createJSONPRequestMessageProcessor', createJSONPRequestMessageProcessor);

  _export('createHttpRequestMessageProcessor', createHttpRequestMessageProcessor);

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function applyXhrTransformers(xhrTransformers, client, processor, message, xhr) {
    var i = undefined;
    var ii = undefined;

    for (i = 0, ii = xhrTransformers.length; i < ii; ++i) {
      xhrTransformers[i](client, processor, message, xhr);
    }
  }

  function timeoutTransformer(client, processor, message, xhr) {
    if (message.timeout !== undefined) {
      xhr.timeout = message.timeout;
    }
  }

  function callbackParameterNameTransformer(client, processor, message, xhr) {
    if (message.callbackParameterName !== undefined) {
      xhr.callbackParameterName = message.callbackParameterName;
    }
  }

  function credentialsTransformer(client, processor, message, xhr) {
    if (message.withCredentials !== undefined) {
      xhr.withCredentials = message.withCredentials;
    }
  }

  function progressTransformer(client, processor, message, xhr) {
    if (message.progressCallback) {
      xhr.upload.onprogress = message.progressCallback;
    }
  }

  function responseTypeTransformer(client, processor, message, xhr) {
    var responseType = message.responseType;

    if (responseType === 'json') {
      responseType = 'text';
    }

    xhr.responseType = responseType;
  }

  function headerTransformer(client, processor, message, xhr) {
    message.headers.configureXHR(xhr);
  }

  function contentTransformer(client, processor, message, xhr) {
    if (message.skipContentProcessing) {
      return;
    }

    if (PLATFORM.global.FormData && message.content instanceof FormData) {
      return;
    }

    if (PLATFORM.global.Blob && message.content instanceof Blob) {
      return;
    }

    if (PLATFORM.global.ArrayBufferView && message.content instanceof ArrayBufferView) {
      return;
    }

    if (message.content instanceof Document) {
      return;
    }

    if (typeof message.content === 'string') {
      return;
    }

    if (message.content === null || message.content === undefined) {
      return;
    }

    message.content = JSON.stringify(message.content, message.replacer);

    if (message.headers.get('Content-Type') === undefined) {
      message.headers.add('Content-Type', 'application/json');
    }
  }

  function createJSONPRequestMessageProcessor() {
    return new RequestMessageProcessor(JSONPXHR, [timeoutTransformer, callbackParameterNameTransformer]);
  }

  function createHttpRequestMessageProcessor() {
    return new RequestMessageProcessor(PLATFORM.XMLHttpRequest, [timeoutTransformer, credentialsTransformer, progressTransformer, responseTypeTransformer, contentTransformer, headerTransformer]);
  }

  function trackRequestStart(client, processor) {
    client.pendingRequests.push(processor);
    client.isRequesting = true;
  }

  function trackRequestEnd(client, processor) {
    var index = client.pendingRequests.indexOf(processor);

    client.pendingRequests.splice(index, 1);
    client.isRequesting = client.pendingRequests.length > 0;

    if (!client.isRequesting) {
      (function () {
        var evt = DOM.createCustomEvent('aurelia-http-client-requests-drained', { bubbles: true, cancelable: true });
        setTimeout(function () {
          return DOM.dispatchEvent(evt);
        }, 1);
      })();
    }
  }

  return {
    setters: [function (_coreJs) {}, function (_aureliaPath) {
      join = _aureliaPath.join;
      buildQueryString = _aureliaPath.buildQueryString;
    }, function (_aureliaPal) {
      PLATFORM = _aureliaPal.PLATFORM;
      DOM = _aureliaPal.DOM;
    }],
    execute: function () {
      Headers = (function () {
        function Headers() {
          var headers = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          _classCallCheck(this, Headers);

          this.headers = headers;
        }

        Headers.prototype.add = function add(key, value) {
          this.headers[key] = value;
        };

        Headers.prototype.get = function get(key) {
          return this.headers[key];
        };

        Headers.prototype.clear = function clear() {
          this.headers = {};
        };

        Headers.prototype.configureXHR = function configureXHR(xhr) {
          var headers = this.headers;

          for (var key in headers) {
            xhr.setRequestHeader(key, headers[key]);
          }
        };

        Headers.parse = function parse(headerStr) {
          var headers = new Headers();
          if (!headerStr) {
            return headers;
          }

          var headerPairs = headerStr.split('\r\n');
          for (var i = 0; i < headerPairs.length; i++) {
            var headerPair = headerPairs[i];

            var index = headerPair.indexOf(': ');
            if (index > 0) {
              var key = headerPair.substring(0, index);
              var val = headerPair.substring(index + 2);
              headers.add(key, val);
            }
          }

          return headers;
        };

        return Headers;
      })();

      _export('Headers', Headers);

      RequestMessage = (function () {
        function RequestMessage(method, url, content, headers) {
          _classCallCheck(this, RequestMessage);

          this.method = method;
          this.url = url;
          this.content = content;
          this.headers = headers || new Headers();
          this.baseUrl = '';
        }

        RequestMessage.prototype.buildFullUrl = function buildFullUrl() {
          var absoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;
          var url = absoluteUrl.test(this.url) ? this.url : join(this.baseUrl, this.url);

          if (this.params) {
            var qs = buildQueryString(this.params);
            url = qs ? url + '?' + qs : url;
          }

          return url;
        };

        return RequestMessage;
      })();

      _export('RequestMessage', RequestMessage);

      HttpResponseMessage = (function () {
        function HttpResponseMessage(requestMessage, xhr, responseType, reviver) {
          _classCallCheck(this, HttpResponseMessage);

          this.requestMessage = requestMessage;
          this.statusCode = xhr.status;
          this.response = xhr.response || xhr.responseText;
          this.isSuccess = xhr.status >= 200 && xhr.status < 400;
          this.statusText = xhr.statusText;
          this.reviver = reviver;
          this.mimeType = null;

          if (xhr.getAllResponseHeaders) {
            try {
              this.headers = Headers.parse(xhr.getAllResponseHeaders());
            } catch (err) {
              if (xhr.requestHeaders) this.headers = { headers: xhr.requestHeaders };
            }
          } else {
            this.headers = new Headers();
          }

          var contentType = undefined;
          if (this.headers && this.headers.headers) contentType = this.headers.headers['Content-Type'];
          if (contentType) {
            this.mimeType = responseType = contentType.split(';')[0].trim();
            if (mimeTypes.hasOwnProperty(this.mimeType)) responseType = mimeTypes[this.mimeType];
          }

          this.responseType = responseType;
        }

        _createClass(HttpResponseMessage, [{
          key: 'content',
          get: function get() {
            try {
              if (this._content !== undefined) {
                return this._content;
              }

              if (this.response === undefined || this.response === null) {
                this._content = this.response;
                return this._content;
              }

              if (this.responseType === 'json') {
                this._content = JSON.parse(this.response, this.reviver);
                return this._content;
              }

              if (this.reviver) {
                this._content = this.reviver(this.response);
                return this._content;
              }

              this._content = this.response;
              return this._content;
            } catch (e) {
              if (this.isSuccess) {
                throw e;
              }

              this._content = null;
              return this._content;
            }
          }
        }]);

        return HttpResponseMessage;
      })();

      _export('HttpResponseMessage', HttpResponseMessage);

      mimeTypes = {
        'text/html': 'html',
        'text/javascript': 'js',
        'application/javascript': 'js',
        'text/json': 'json',
        'application/json': 'json',
        'application/rss+xml': 'rss',
        'application/atom+xml': 'atom',
        'application/xhtml+xml': 'xhtml',
        'text/markdown': 'md',
        'text/xml': 'xml',
        'text/mathml': 'mml',
        'application/xml': 'xml',
        'text/yml': 'yml',
        'text/csv': 'csv',
        'text/css': 'css',
        'text/less': 'less',
        'text/stylus': 'styl',
        'text/scss': 'scss',
        'text/sass': 'sass',
        'text/plain': 'txt'
      };

      _export('mimeTypes', mimeTypes);

      RequestMessageProcessor = (function () {
        function RequestMessageProcessor(xhrType, xhrTransformers) {
          _classCallCheck(this, RequestMessageProcessor);

          this.XHRType = xhrType;
          this.xhrTransformers = xhrTransformers;
          this.isAborted = false;
        }

        RequestMessageProcessor.prototype.abort = function abort() {
          if (this.xhr && this.xhr.readyState !== PLATFORM.XMLHttpRequest.UNSENT) {
            this.xhr.abort();
          }

          this.isAborted = true;
        };

        RequestMessageProcessor.prototype.process = function process(client, requestMessage) {
          var _this = this;

          var promise = new Promise(function (resolve, reject) {
            var xhr = _this.xhr = new _this.XHRType();

            xhr.onload = function (e) {
              var response = new HttpResponseMessage(requestMessage, xhr, requestMessage.responseType, requestMessage.reviver);
              if (response.isSuccess) {
                resolve(response);
              } else {
                reject(response);
              }
            };

            xhr.ontimeout = function (e) {
              reject(new HttpResponseMessage(requestMessage, {
                response: e,
                status: xhr.status,
                statusText: xhr.statusText
              }, 'timeout'));
            };

            xhr.onerror = function (e) {
              reject(new HttpResponseMessage(requestMessage, {
                response: e,
                status: xhr.status,
                statusText: xhr.statusText
              }, 'error'));
            };

            xhr.onabort = function (e) {
              reject(new HttpResponseMessage(requestMessage, {
                response: e,
                status: xhr.status,
                statusText: xhr.statusText
              }, 'abort'));
            };
          });

          return Promise.resolve(requestMessage).then(function (message) {
            var processRequest = function processRequest() {
              if (_this.isAborted) {
                _this.xhr.abort();
              } else {
                _this.xhr.open(message.method, message.buildFullUrl(), true);
                applyXhrTransformers(_this.xhrTransformers, client, _this, message, _this.xhr);
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
              var _interceptorsPromise;

              interceptorsPromise = (_interceptorsPromise = interceptorsPromise).then.apply(_interceptorsPromise, chain.shift());
            }

            return interceptorsPromise;
          });
        };

        return RequestMessageProcessor;
      })();

      _export('RequestMessageProcessor', RequestMessageProcessor);

      JSONPRequestMessage = (function (_RequestMessage) {
        _inherits(JSONPRequestMessage, _RequestMessage);

        function JSONPRequestMessage(url, callbackParameterName) {
          _classCallCheck(this, JSONPRequestMessage);

          _RequestMessage.call(this, 'JSONP', url);
          this.responseType = 'jsonp';
          this.callbackParameterName = callbackParameterName;
        }

        return JSONPRequestMessage;
      })(RequestMessage);

      _export('JSONPRequestMessage', JSONPRequestMessage);

      JSONPXHR = (function () {
        function JSONPXHR() {
          _classCallCheck(this, JSONPXHR);
        }

        JSONPXHR.prototype.open = function open(method, url) {
          this.method = method;
          this.url = url;
          this.callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        };

        JSONPXHR.prototype.send = function send() {
          var _this2 = this;

          var url = this.url + (this.url.indexOf('?') >= 0 ? '&' : '?') + encodeURIComponent(this.callbackParameterName) + '=' + this.callbackName;
          var script = DOM.createElement('script');

          script.src = url;
          script.onerror = function (e) {
            cleanUp();

            _this2.status = 0;
            _this2.onerror(new Error('error'));
          };

          var cleanUp = function cleanUp() {
            delete PLATFORM.global[_this2.callbackName];
            DOM.removeNode(script);
          };

          PLATFORM.global[this.callbackName] = function (data) {
            cleanUp();

            if (_this2.status === undefined) {
              _this2.status = 200;
              _this2.statusText = 'OK';
              _this2.response = data;
              _this2.onload(_this2);
            }
          };

          DOM.appendNode(script);

          if (this.timeout !== undefined) {
            setTimeout(function () {
              if (_this2.status === undefined) {
                _this2.status = 0;
                _this2.ontimeout(new Error('timeout'));
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

      HttpRequestMessage = (function (_RequestMessage2) {
        _inherits(HttpRequestMessage, _RequestMessage2);

        function HttpRequestMessage(method, url, content, headers) {
          _classCallCheck(this, HttpRequestMessage);

          _RequestMessage2.call(this, method, url, content, headers);
          this.responseType = 'json';
        }

        return HttpRequestMessage;
      })(RequestMessage);

      _export('HttpRequestMessage', HttpRequestMessage);

      RequestBuilder = (function () {
        function RequestBuilder(client) {
          _classCallCheck(this, RequestBuilder);

          this.client = client;
          this.transformers = client.requestTransformers.slice(0);
          this.useJsonp = false;
        }

        RequestBuilder.addHelper = function addHelper(name, fn) {
          RequestBuilder.prototype[name] = function () {
            this.transformers.push(fn.apply(this, arguments));
            return this;
          };
        };

        RequestBuilder.prototype.send = function send() {
          var message = this.useJsonp ? new JSONPRequestMessage() : new HttpRequestMessage();
          return this.client.send(message, this.transformers);
        };

        return RequestBuilder;
      })();

      _export('RequestBuilder', RequestBuilder);

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

      RequestBuilder.addHelper('withUrl', function (url) {
        return function (client, processor, message) {
          message.url = url;
        };
      });

      RequestBuilder.addHelper('withContent', function (content) {
        return function (client, processor, message) {
          message.content = content;
        };
      });

      RequestBuilder.addHelper('withBaseUrl', function (baseUrl) {
        return function (client, processor, message) {
          message.baseUrl = baseUrl;
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

      RequestBuilder.addHelper('withInterceptor', function (interceptor) {
        return function (client, processor, message) {
          message.interceptors = message.interceptors || [];
          message.interceptors.unshift(interceptor);
        };
      });

      RequestBuilder.addHelper('skipContentProcessing', function () {
        return function (client, processor, message) {
          message.skipContentProcessing = true;
        };
      });

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

        HttpClient.prototype.configure = function configure(fn) {
          var builder = new RequestBuilder(this);
          fn(builder);
          this.requestTransformers = builder.transformers;
          return this;
        };

        HttpClient.prototype.createRequest = function createRequest(url) {
          var builder = new RequestBuilder(this);

          if (url) {
            builder.withUrl(url);
          }

          return builder;
        };

        HttpClient.prototype.send = function send(requestMessage, transformers) {
          var _this3 = this;

          var createProcessor = this.requestProcessorFactories.get(requestMessage.constructor);
          var processor = undefined;
          var promise = undefined;
          var i = undefined;
          var ii = undefined;

          if (!createProcessor) {
            throw new Error('No request message processor factory for ' + requestMessage.constructor + '.');
          }

          processor = createProcessor();
          trackRequestStart(this, processor);

          transformers = transformers || this.requestTransformers;

          promise = Promise.resolve(requestMessage).then(function (message) {
            for (i = 0, ii = transformers.length; i < ii; ++i) {
              transformers[i](_this3, processor, message);
            }

            return processor.process(_this3, message).then(function (response) {
              trackRequestEnd(_this3, processor);
              return response;
            })['catch'](function (response) {
              trackRequestEnd(_this3, processor);
              throw response;
            });
          });

          promise.abort = promise.cancel = function () {
            processor.abort();
          };

          return promise;
        };

        HttpClient.prototype['delete'] = function _delete(url) {
          return this.createRequest(url).asDelete().send();
        };

        HttpClient.prototype.get = function get(url) {
          return this.createRequest(url).asGet().send();
        };

        HttpClient.prototype.head = function head(url) {
          return this.createRequest(url).asHead().send();
        };

        HttpClient.prototype.jsonp = function jsonp(url) {
          var callbackParameterName = arguments.length <= 1 || arguments[1] === undefined ? 'jsoncallback' : arguments[1];

          return this.createRequest(url).asJsonp(callbackParameterName).send();
        };

        HttpClient.prototype.options = function options(url) {
          return this.createRequest(url).asOptions().send();
        };

        HttpClient.prototype.put = function put(url, content) {
          return this.createRequest(url).asPut().withContent(content).send();
        };

        HttpClient.prototype.patch = function patch(url, content) {
          return this.createRequest(url).asPatch().withContent(content).send();
        };

        HttpClient.prototype.post = function post(url, content) {
          return this.createRequest(url).asPost().withContent(content).send();
        };

        return HttpClient;
      })();

      _export('HttpClient', HttpClient);
    }
  };
});