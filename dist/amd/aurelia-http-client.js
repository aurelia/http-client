define(['exports', 'aurelia-path', 'aurelia-pal'], function (exports, _aureliaPath, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HttpClient = exports.RequestBuilder = exports.HttpRequestMessage = exports.JSONPRequestMessage = exports.RequestMessageProcessor = exports.mimeTypes = exports.HttpResponseMessage = exports.RequestMessage = exports.Headers = undefined;
  exports.timeoutTransformer = timeoutTransformer;
  exports.callbackParameterNameTransformer = callbackParameterNameTransformer;
  exports.credentialsTransformer = credentialsTransformer;
  exports.progressTransformer = progressTransformer;
  exports.downloadProgressTransformer = downloadProgressTransformer;
  exports.responseTypeTransformer = responseTypeTransformer;
  exports.headerTransformer = headerTransformer;
  exports.contentTransformer = contentTransformer;
  exports.createJSONPRequestMessageProcessor = createJSONPRequestMessageProcessor;
  exports.createHttpRequestMessageProcessor = createHttpRequestMessageProcessor;

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  

  var Headers = exports.Headers = function () {
    function Headers() {
      var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      

      this.headers = {};

      for (var _key in headers) {
        this.headers[_key.toLowerCase()] = { key: _key, value: headers[_key] };
      }
    }

    Headers.prototype.add = function add(key, value) {
      this.headers[key.toLowerCase()] = { key: key, value: value };
    };

    Headers.prototype.get = function get(key) {
      var header = this.headers[key.toLowerCase()];
      return header ? header.value : undefined;
    };

    Headers.prototype.clear = function clear() {
      this.headers = {};
    };

    Headers.prototype.has = function has(header) {
      return this.headers.hasOwnProperty(header.toLowerCase());
    };

    Headers.prototype.configureXHR = function configureXHR(xhr) {
      for (var name in this.headers) {
        if (this.headers.hasOwnProperty(name)) {
          xhr.setRequestHeader(this.headers[name].key, this.headers[name].value);
        }
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
          var _key2 = headerPair.substring(0, index);
          var val = headerPair.substring(index + 2);
          headers.add(_key2, val);
        }
      }

      return headers;
    };

    return Headers;
  }();

  var RequestMessage = exports.RequestMessage = function () {
    function RequestMessage(method, url, content, headers) {
      

      this.method = method;
      this.url = url;
      this.content = content;
      this.headers = headers || new Headers();
      this.baseUrl = '';
    }

    RequestMessage.prototype.buildFullUrl = function buildFullUrl() {
      var absoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;
      var url = absoluteUrl.test(this.url) ? this.url : (0, _aureliaPath.join)(this.baseUrl, this.url);

      if (this.params) {
        var qs = (0, _aureliaPath.buildQueryString)(this.params, this.traditional);
        url = qs ? url + (this.url.indexOf('?') < 0 ? '?' : '&') + qs : url;
      }

      return url;
    };

    return RequestMessage;
  }();

  var HttpResponseMessage = exports.HttpResponseMessage = function () {
    function HttpResponseMessage(requestMessage, xhr, responseType, reviver) {
      

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
          if (xhr.requestHeaders) this.headers = new Headers(xhr.requestHeaders);
        }
      } else {
        this.headers = new Headers();
      }

      var contentType = void 0;

      if (this.headers && this.headers.headers) {
        contentType = this.headers.get('Content-Type');
      }

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

          if (this.response === undefined || this.response === null || this.response === '') {
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
  }();

  var mimeTypes = exports.mimeTypes = {
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

  function applyXhrTransformers(xhrTransformers, client, processor, message, xhr) {
    var i = void 0;
    var ii = void 0;

    for (i = 0, ii = xhrTransformers.length; i < ii; ++i) {
      xhrTransformers[i](client, processor, message, xhr);
    }
  }

  var RequestMessageProcessor = exports.RequestMessageProcessor = function () {
    function RequestMessageProcessor(xhrType, xhrTransformers) {
      

      this.XHRType = xhrType;
      this.xhrTransformers = xhrTransformers;
      this.isAborted = false;
    }

    RequestMessageProcessor.prototype.abort = function abort() {
      if (this.xhr && this.xhr.readyState !== _aureliaPal.PLATFORM.XMLHttpRequest.UNSENT) {
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
            _this.xhr.open(message.method, message.buildFullUrl(), true, message.user, message.password);
            applyXhrTransformers(_this.xhrTransformers, client, _this, message, _this.xhr);
            if (typeof message.content === 'undefined') {
              _this.xhr.send();
            } else {
              _this.xhr.send(message.content);
            }
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
  }();

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

  function downloadProgressTransformer(client, processor, message, xhr) {
    if (message.downloadProgressCallback) {
      xhr.onprogress = message.downloadProgressCallback;
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

    if (_aureliaPal.PLATFORM.global.FormData && message.content instanceof FormData) {
      return;
    }

    if (_aureliaPal.PLATFORM.global.Blob && message.content instanceof Blob) {
      return;
    }

    if (_aureliaPal.PLATFORM.global.ArrayBuffer && message.content instanceof ArrayBuffer) {
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

    if (!message.headers.has('Content-Type')) {
      message.headers.add('Content-Type', 'application/json');
    }
  }

  var JSONPRequestMessage = exports.JSONPRequestMessage = function (_RequestMessage) {
    _inherits(JSONPRequestMessage, _RequestMessage);

    function JSONPRequestMessage(url, callbackParameterName) {
      

      var _this2 = _possibleConstructorReturn(this, _RequestMessage.call(this, 'JSONP', url));

      _this2.responseType = 'jsonp';
      _this2.callbackParameterName = callbackParameterName;
      return _this2;
    }

    return JSONPRequestMessage;
  }(RequestMessage);

  var JSONPXHR = function () {
    function JSONPXHR() {
      
    }

    JSONPXHR.prototype.open = function open(method, url) {
      this.method = method;
      this.url = url;
      this.callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    };

    JSONPXHR.prototype.send = function send() {
      var _this3 = this;

      var url = this.url + (this.url.indexOf('?') >= 0 ? '&' : '?') + encodeURIComponent(this.callbackParameterName) + '=' + this.callbackName;
      var script = _aureliaPal.DOM.createElement('script');

      script.src = url;
      script.onerror = function (e) {
        cleanUp();

        _this3.status = 0;
        _this3.onerror(new Error('error'));
      };

      var cleanUp = function cleanUp() {
        delete _aureliaPal.PLATFORM.global[_this3.callbackName];
        _aureliaPal.DOM.removeNode(script);
      };

      _aureliaPal.PLATFORM.global[this.callbackName] = function (data) {
        cleanUp();

        if (_this3.status === undefined) {
          _this3.status = 200;
          _this3.statusText = 'OK';
          _this3.response = data;
          _this3.onload(_this3);
        }
      };

      _aureliaPal.DOM.appendNode(script);

      if (this.timeout !== undefined) {
        setTimeout(function () {
          if (_this3.status === undefined) {
            _this3.status = 0;
            _this3.ontimeout(new Error('timeout'));
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
  }();

  function createJSONPRequestMessageProcessor() {
    return new RequestMessageProcessor(JSONPXHR, [timeoutTransformer, callbackParameterNameTransformer]);
  }

  var HttpRequestMessage = exports.HttpRequestMessage = function (_RequestMessage2) {
    _inherits(HttpRequestMessage, _RequestMessage2);

    function HttpRequestMessage(method, url, content, headers) {
      

      var _this4 = _possibleConstructorReturn(this, _RequestMessage2.call(this, method, url, content, headers));

      _this4.responseType = 'json';return _this4;
    }

    return HttpRequestMessage;
  }(RequestMessage);

  function createHttpRequestMessageProcessor() {
    return new RequestMessageProcessor(_aureliaPal.PLATFORM.XMLHttpRequest, [timeoutTransformer, credentialsTransformer, progressTransformer, downloadProgressTransformer, responseTypeTransformer, contentTransformer, headerTransformer]);
  }

  var RequestBuilder = exports.RequestBuilder = function () {
    function RequestBuilder(client) {
      

      this.client = client;
      this.transformers = client.requestTransformers.slice(0);
      this.useJsonp = false;
    }

    RequestBuilder.prototype.asDelete = function asDelete() {
      return this._addTransformer(function (client, processor, message) {
        message.method = 'DELETE';
      });
    };

    RequestBuilder.prototype.asGet = function asGet() {
      return this._addTransformer(function (client, processor, message) {
        message.method = 'GET';
      });
    };

    RequestBuilder.prototype.asHead = function asHead() {
      return this._addTransformer(function (client, processor, message) {
        message.method = 'HEAD';
      });
    };

    RequestBuilder.prototype.asOptions = function asOptions() {
      return this._addTransformer(function (client, processor, message) {
        message.method = 'OPTIONS';
      });
    };

    RequestBuilder.prototype.asPatch = function asPatch() {
      return this._addTransformer(function (client, processor, message) {
        message.method = 'PATCH';
      });
    };

    RequestBuilder.prototype.asPost = function asPost() {
      return this._addTransformer(function (client, processor, message) {
        message.method = 'POST';
      });
    };

    RequestBuilder.prototype.asPut = function asPut() {
      return this._addTransformer(function (client, processor, message) {
        message.method = 'PUT';
      });
    };

    RequestBuilder.prototype.asJsonp = function asJsonp(callbackParameterName) {
      this.useJsonp = true;
      return this._addTransformer(function (client, processor, message) {
        message.callbackParameterName = callbackParameterName;
      });
    };

    RequestBuilder.prototype.withUrl = function withUrl(url) {
      return this._addTransformer(function (client, processor, message) {
        message.url = url;
      });
    };

    RequestBuilder.prototype.withContent = function withContent(content) {
      return this._addTransformer(function (client, processor, message) {
        message.content = content;
      });
    };

    RequestBuilder.prototype.withBaseUrl = function withBaseUrl(baseUrl) {
      return this._addTransformer(function (client, processor, message) {
        message.baseUrl = baseUrl;
      });
    };

    RequestBuilder.prototype.withParams = function withParams(params, traditional) {
      return this._addTransformer(function (client, processor, message) {
        message.traditional = traditional;
        message.params = params;
      });
    };

    RequestBuilder.prototype.withResponseType = function withResponseType(responseType) {
      return this._addTransformer(function (client, processor, message) {
        message.responseType = responseType;
      });
    };

    RequestBuilder.prototype.withTimeout = function withTimeout(timeout) {
      return this._addTransformer(function (client, processor, message) {
        message.timeout = timeout;
      });
    };

    RequestBuilder.prototype.withHeader = function withHeader(key, value) {
      return this._addTransformer(function (client, processor, message) {
        message.headers.add(key, value);
      });
    };

    RequestBuilder.prototype.withCredentials = function withCredentials(value) {
      return this._addTransformer(function (client, processor, message) {
        message.withCredentials = value;
      });
    };

    RequestBuilder.prototype.withLogin = function withLogin(user, password) {
      return this._addTransformer(function (client, processor, message) {
        message.user = user;message.password = password;
      });
    };

    RequestBuilder.prototype.withReviver = function withReviver(reviver) {
      return this._addTransformer(function (client, processor, message) {
        message.reviver = reviver;
      });
    };

    RequestBuilder.prototype.withReplacer = function withReplacer(replacer) {
      return this._addTransformer(function (client, processor, message) {
        message.replacer = replacer;
      });
    };

    RequestBuilder.prototype.withProgressCallback = function withProgressCallback(progressCallback) {
      return this._addTransformer(function (client, processor, message) {
        message.progressCallback = progressCallback;
      });
    };

    RequestBuilder.prototype.withDownloadProgressCallback = function withDownloadProgressCallback(downloadProgressCallback) {
      return this._addTransformer(function (client, processor, message) {
        message.downloadProgressCallback = downloadProgressCallback;
      });
    };

    RequestBuilder.prototype.withCallbackParameterName = function withCallbackParameterName(callbackParameterName) {
      return this._addTransformer(function (client, processor, message) {
        message.callbackParameterName = callbackParameterName;
      });
    };

    RequestBuilder.prototype.withInterceptor = function withInterceptor(interceptor) {
      return this._addTransformer(function (client, processor, message) {
        message.interceptors = message.interceptors || [];
        message.interceptors.unshift(interceptor);
      });
    };

    RequestBuilder.prototype.skipContentProcessing = function skipContentProcessing() {
      return this._addTransformer(function (client, processor, message) {
        message.skipContentProcessing = true;
      });
    };

    RequestBuilder.prototype._addTransformer = function _addTransformer(fn) {
      this.transformers.push(fn);
      return this;
    };

    RequestBuilder.addHelper = function addHelper(name, fn) {
      RequestBuilder.prototype[name] = function () {
        return this._addTransformer(fn.apply(this, arguments));
      };
    };

    RequestBuilder.prototype.send = function send() {
      var message = this.useJsonp ? new JSONPRequestMessage() : new HttpRequestMessage();
      return this.client.send(message, this.transformers);
    };

    return RequestBuilder;
  }();

  function trackRequestStart(client, processor) {
    client.pendingRequests.push(processor);
    client.isRequesting = true;
  }

  function trackRequestEnd(client, processor) {
    var index = client.pendingRequests.indexOf(processor);

    client.pendingRequests.splice(index, 1);
    client.isRequesting = client.pendingRequests.length > 0;

    if (!client.isRequesting) {
      var evt = _aureliaPal.DOM.createCustomEvent('aurelia-http-client-requests-drained', { bubbles: true, cancelable: true });
      setTimeout(function () {
        return _aureliaPal.DOM.dispatchEvent(evt);
      }, 1);
    }
  }

  var HttpClient = exports.HttpClient = function () {
    function HttpClient() {
      

      this.isRequesting = false;

      this.requestTransformers = [];
      this.requestProcessorFactories = new Map();
      this.requestProcessorFactories.set(HttpRequestMessage, createHttpRequestMessageProcessor);
      this.requestProcessorFactories.set(JSONPRequestMessage, createJSONPRequestMessageProcessor);
      this.pendingRequests = [];
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
      var _this5 = this;

      var createProcessor = this.requestProcessorFactories.get(requestMessage.constructor);
      var processor = void 0;
      var promise = void 0;
      var i = void 0;
      var ii = void 0;

      if (!createProcessor) {
        throw new Error('No request message processor factory for ' + requestMessage.constructor + '.');
      }

      processor = createProcessor();
      trackRequestStart(this, processor);

      transformers = transformers || this.requestTransformers;

      promise = Promise.resolve(requestMessage).then(function (message) {
        for (i = 0, ii = transformers.length; i < ii; ++i) {
          transformers[i](_this5, processor, message);
        }

        return processor.process(_this5, message).then(function (response) {
          trackRequestEnd(_this5, processor);
          return response;
        }).catch(function (response) {
          trackRequestEnd(_this5, processor);
          throw response;
        });
      });

      promise.abort = promise.cancel = function () {
        processor.abort();
      };

      return promise;
    };

    HttpClient.prototype.delete = function _delete(url) {
      return this.createRequest(url).asDelete().send();
    };

    HttpClient.prototype.get = function get(url, params, traditional) {
      var req = this.createRequest(url).asGet();

      if (params) {
        return req.withParams(params, traditional).send();
      }

      return req.send();
    };

    HttpClient.prototype.head = function head(url) {
      return this.createRequest(url).asHead().send();
    };

    HttpClient.prototype.jsonp = function jsonp(url) {
      var callbackParameterName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jsoncallback';

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
  }();
});