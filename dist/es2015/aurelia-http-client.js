import { join, buildQueryString } from 'aurelia-path';
import { PLATFORM, DOM } from 'aurelia-pal';

export let Headers = class Headers {
  constructor(headers = {}) {
    this.headers = {};

    for (let key in headers) {
      this.headers[key.toLowerCase()] = { key, value: headers[key] };
    }
  }

  add(key, value) {
    this.headers[key.toLowerCase()] = { key, value };
  }

  get(key) {
    let header = this.headers[key.toLowerCase()];
    return header ? header.value : undefined;
  }

  clear() {
    this.headers = {};
  }

  has(header) {
    return this.headers.hasOwnProperty(header.toLowerCase());
  }

  configureXHR(xhr) {
    for (let name in this.headers) {
      if (this.headers.hasOwnProperty(name)) {
        xhr.setRequestHeader(this.headers[name].key, this.headers[name].value);
      }
    }
  }

  static parse(headerStr) {
    let headers = new Headers();
    if (!headerStr) {
      return headers;
    }

    let headerPairs = headerStr.split('\u000d\u000a');
    for (let i = 0; i < headerPairs.length; i++) {
      let headerPair = headerPairs[i];

      let index = headerPair.indexOf('\u003a\u0020');
      if (index > 0) {
        let key = headerPair.substring(0, index);
        let val = headerPair.substring(index + 2);
        headers.add(key, val);
      }
    }

    return headers;
  }
};

export let RequestMessage = class RequestMessage {
  constructor(method, url, content, headers) {
    this.method = method;
    this.url = url;
    this.content = content;
    this.headers = headers || new Headers();
    this.baseUrl = '';
  }

  buildFullUrl() {
    let absoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;
    let url = absoluteUrl.test(this.url) ? this.url : join(this.baseUrl, this.url);

    if (this.params) {
      let qs = buildQueryString(this.params);
      url = qs ? url + (this.url.indexOf('?') < 0 ? '?' : '&') + qs : url;
    }

    return url;
  }
};

export let HttpResponseMessage = class HttpResponseMessage {
  constructor(requestMessage, xhr, responseType, reviver) {
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

    let contentType;

    if (this.headers && this.headers.headers) {
      contentType = this.headers.get('Content-Type');
    }

    if (contentType) {
      this.mimeType = responseType = contentType.split(';')[0].trim();
      if (mimeTypes.hasOwnProperty(this.mimeType)) responseType = mimeTypes[this.mimeType];
    }

    this.responseType = responseType;
  }

  get content() {
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
};

export let mimeTypes = {
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
  let i;
  let ii;

  for (i = 0, ii = xhrTransformers.length; i < ii; ++i) {
    xhrTransformers[i](client, processor, message, xhr);
  }
}

export let RequestMessageProcessor = class RequestMessageProcessor {
  constructor(xhrType, xhrTransformers) {
    this.XHRType = xhrType;
    this.xhrTransformers = xhrTransformers;
    this.isAborted = false;
  }

  abort() {
    if (this.xhr && this.xhr.readyState !== PLATFORM.XMLHttpRequest.UNSENT) {
      this.xhr.abort();
    }

    this.isAborted = true;
  }

  process(client, requestMessage) {
    let promise = new Promise((resolve, reject) => {
      let xhr = this.xhr = new this.XHRType();

      xhr.onload = e => {
        let response = new HttpResponseMessage(requestMessage, xhr, requestMessage.responseType, requestMessage.reviver);
        if (response.isSuccess) {
          resolve(response);
        } else {
          reject(response);
        }
      };

      xhr.ontimeout = e => {
        reject(new HttpResponseMessage(requestMessage, {
          response: e,
          status: xhr.status,
          statusText: xhr.statusText
        }, 'timeout'));
      };

      xhr.onerror = e => {
        reject(new HttpResponseMessage(requestMessage, {
          response: e,
          status: xhr.status,
          statusText: xhr.statusText
        }, 'error'));
      };

      xhr.onabort = e => {
        reject(new HttpResponseMessage(requestMessage, {
          response: e,
          status: xhr.status,
          statusText: xhr.statusText
        }, 'abort'));
      };
    });

    return Promise.resolve(requestMessage).then(message => {
      let processRequest = () => {
        if (this.isAborted) {
          this.xhr.abort();
        } else {
          this.xhr.open(message.method, message.buildFullUrl(), true, message.user, message.password);
          applyXhrTransformers(this.xhrTransformers, client, this, message, this.xhr);
          if (typeof message.content === 'undefined') {
            this.xhr.send();
          } else {
            this.xhr.send(message.content);
          }
        }

        return promise;
      };

      let chain = [[processRequest, undefined]];

      let interceptors = message.interceptors || [];
      interceptors.forEach(function (interceptor) {
        if (interceptor.request || interceptor.requestError) {
          chain.unshift([interceptor.request ? interceptor.request.bind(interceptor) : undefined, interceptor.requestError ? interceptor.requestError.bind(interceptor) : undefined]);
        }

        if (interceptor.response || interceptor.responseError) {
          chain.push([interceptor.response ? interceptor.response.bind(interceptor) : undefined, interceptor.responseError ? interceptor.responseError.bind(interceptor) : undefined]);
        }
      });

      let interceptorsPromise = Promise.resolve(message);

      while (chain.length) {
        interceptorsPromise = interceptorsPromise.then(...chain.shift());
      }

      return interceptorsPromise;
    });
  }
};

export function timeoutTransformer(client, processor, message, xhr) {
  if (message.timeout !== undefined) {
    xhr.timeout = message.timeout;
  }
}

export function callbackParameterNameTransformer(client, processor, message, xhr) {
  if (message.callbackParameterName !== undefined) {
    xhr.callbackParameterName = message.callbackParameterName;
  }
}

export function credentialsTransformer(client, processor, message, xhr) {
  if (message.withCredentials !== undefined) {
    xhr.withCredentials = message.withCredentials;
  }
}

export function progressTransformer(client, processor, message, xhr) {
  if (message.progressCallback) {
    xhr.upload.onprogress = message.progressCallback;
  }
}

export function responseTypeTransformer(client, processor, message, xhr) {
  let responseType = message.responseType;

  if (responseType === 'json') {
    responseType = 'text';
  }

  xhr.responseType = responseType;
}

export function headerTransformer(client, processor, message, xhr) {
  message.headers.configureXHR(xhr);
}

export function contentTransformer(client, processor, message, xhr) {
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

  if (!message.headers.has('Content-Type')) {
    message.headers.add('Content-Type', 'application/json');
  }
}

export let JSONPRequestMessage = class JSONPRequestMessage extends RequestMessage {
  constructor(url, callbackParameterName) {
    super('JSONP', url);
    this.responseType = 'jsonp';
    this.callbackParameterName = callbackParameterName;
  }
};

let JSONPXHR = class JSONPXHR {
  open(method, url) {
    this.method = method;
    this.url = url;
    this.callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
  }

  send() {
    let url = this.url + (this.url.indexOf('?') >= 0 ? '&' : '?') + encodeURIComponent(this.callbackParameterName) + '=' + this.callbackName;
    let script = DOM.createElement('script');

    script.src = url;
    script.onerror = e => {
      cleanUp();

      this.status = 0;
      this.onerror(new Error('error'));
    };

    let cleanUp = () => {
      delete PLATFORM.global[this.callbackName];
      DOM.removeNode(script);
    };

    PLATFORM.global[this.callbackName] = data => {
      cleanUp();

      if (this.status === undefined) {
        this.status = 200;
        this.statusText = 'OK';
        this.response = data;
        this.onload(this);
      }
    };

    DOM.appendNode(script);

    if (this.timeout !== undefined) {
      setTimeout(() => {
        if (this.status === undefined) {
          this.status = 0;
          this.ontimeout(new Error('timeout'));
        }
      }, this.timeout);
    }
  }

  abort() {
    if (this.status === undefined) {
      this.status = 0;
      this.onabort(new Error('abort'));
    }
  }

  setRequestHeader() {}
};

export function createJSONPRequestMessageProcessor() {
  return new RequestMessageProcessor(JSONPXHR, [timeoutTransformer, callbackParameterNameTransformer]);
}

export let HttpRequestMessage = class HttpRequestMessage extends RequestMessage {
  constructor(method, url, content, headers) {
    super(method, url, content, headers);
    this.responseType = 'json';
  }
};

export function createHttpRequestMessageProcessor() {
  return new RequestMessageProcessor(PLATFORM.XMLHttpRequest, [timeoutTransformer, credentialsTransformer, progressTransformer, responseTypeTransformer, contentTransformer, headerTransformer]);
}

export let RequestBuilder = class RequestBuilder {
  constructor(client) {
    this.client = client;
    this.transformers = client.requestTransformers.slice(0);
    this.useJsonp = false;
  }

  asDelete() {
    return this._addTransformer(function (client, processor, message) {
      message.method = 'DELETE';
    });
  }

  asGet() {
    return this._addTransformer(function (client, processor, message) {
      message.method = 'GET';
    });
  }

  asHead() {
    return this._addTransformer(function (client, processor, message) {
      message.method = 'HEAD';
    });
  }

  asOptions() {
    return this._addTransformer(function (client, processor, message) {
      message.method = 'OPTIONS';
    });
  }

  asPatch() {
    return this._addTransformer(function (client, processor, message) {
      message.method = 'PATCH';
    });
  }

  asPost() {
    return this._addTransformer(function (client, processor, message) {
      message.method = 'POST';
    });
  }

  asPut() {
    return this._addTransformer(function (client, processor, message) {
      message.method = 'PUT';
    });
  }

  asJsonp(callbackParameterName) {
    this.useJsonp = true;
    return this._addTransformer(function (client, processor, message) {
      message.callbackParameterName = callbackParameterName;
    });
  }

  withUrl(url) {
    return this._addTransformer(function (client, processor, message) {
      message.url = url;
    });
  }

  withContent(content) {
    return this._addTransformer(function (client, processor, message) {
      message.content = content;
    });
  }

  withBaseUrl(baseUrl) {
    return this._addTransformer(function (client, processor, message) {
      message.baseUrl = baseUrl;
    });
  }

  withParams(params) {
    return this._addTransformer(function (client, processor, message) {
      message.params = params;
    });
  }

  withResponseType(responseType) {
    return this._addTransformer(function (client, processor, message) {
      message.responseType = responseType;
    });
  }

  withTimeout(timeout) {
    return this._addTransformer(function (client, processor, message) {
      message.timeout = timeout;
    });
  }

  withHeader(key, value) {
    return this._addTransformer(function (client, processor, message) {
      message.headers.add(key, value);
    });
  }

  withCredentials(value) {
    return this._addTransformer(function (client, processor, message) {
      message.withCredentials = value;
    });
  }

  withLogin(user, password) {
    return this._addTransformer(function (client, processor, message) {
      message.user = user;message.password = password;
    });
  }

  withReviver(reviver) {
    return this._addTransformer(function (client, processor, message) {
      message.reviver = reviver;
    });
  }

  withReplacer(replacer) {
    return this._addTransformer(function (client, processor, message) {
      message.replacer = replacer;
    });
  }

  withProgressCallback(progressCallback) {
    return this._addTransformer(function (client, processor, message) {
      message.progressCallback = progressCallback;
    });
  }

  withCallbackParameterName(callbackParameterName) {
    return this._addTransformer(function (client, processor, message) {
      message.callbackParameterName = callbackParameterName;
    });
  }

  withInterceptor(interceptor) {
    return this._addTransformer(function (client, processor, message) {
      message.interceptors = message.interceptors || [];
      message.interceptors.unshift(interceptor);
    });
  }

  skipContentProcessing() {
    return this._addTransformer(function (client, processor, message) {
      message.skipContentProcessing = true;
    });
  }

  _addTransformer(fn) {
    this.transformers.push(fn);
    return this;
  }

  static addHelper(name, fn) {
    RequestBuilder.prototype[name] = function () {
      return this._addTransformer(fn.apply(this, arguments));
    };
  }

  send() {
    let message = this.useJsonp ? new JSONPRequestMessage() : new HttpRequestMessage();
    return this.client.send(message, this.transformers);
  }
};

function trackRequestStart(client, processor) {
  client.pendingRequests.push(processor);
  client.isRequesting = true;
}

function trackRequestEnd(client, processor) {
  let index = client.pendingRequests.indexOf(processor);

  client.pendingRequests.splice(index, 1);
  client.isRequesting = client.pendingRequests.length > 0;

  if (!client.isRequesting) {
    let evt = DOM.createCustomEvent('aurelia-http-client-requests-drained', { bubbles: true, cancelable: true });
    setTimeout(() => DOM.dispatchEvent(evt), 1);
  }
}

export let HttpClient = class HttpClient {
  constructor() {
    this.isRequesting = false;

    this.requestTransformers = [];
    this.requestProcessorFactories = new Map();
    this.requestProcessorFactories.set(HttpRequestMessage, createHttpRequestMessageProcessor);
    this.requestProcessorFactories.set(JSONPRequestMessage, createJSONPRequestMessageProcessor);
    this.pendingRequests = [];
  }

  configure(fn) {
    let builder = new RequestBuilder(this);
    fn(builder);
    this.requestTransformers = builder.transformers;
    return this;
  }

  createRequest(url) {
    let builder = new RequestBuilder(this);

    if (url) {
      builder.withUrl(url);
    }

    return builder;
  }

  send(requestMessage, transformers) {
    let createProcessor = this.requestProcessorFactories.get(requestMessage.constructor);
    let processor;
    let promise;
    let i;
    let ii;

    if (!createProcessor) {
      throw new Error(`No request message processor factory for ${ requestMessage.constructor }.`);
    }

    processor = createProcessor();
    trackRequestStart(this, processor);

    transformers = transformers || this.requestTransformers;

    promise = Promise.resolve(requestMessage).then(message => {
      for (i = 0, ii = transformers.length; i < ii; ++i) {
        transformers[i](this, processor, message);
      }

      return processor.process(this, message).then(response => {
        trackRequestEnd(this, processor);
        return response;
      }).catch(response => {
        trackRequestEnd(this, processor);
        throw response;
      });
    });

    promise.abort = promise.cancel = function () {
      processor.abort();
    };

    return promise;
  }

  delete(url) {
    return this.createRequest(url).asDelete().send();
  }

  get(url) {
    return this.createRequest(url).asGet().send();
  }

  head(url) {
    return this.createRequest(url).asHead().send();
  }

  jsonp(url, callbackParameterName = 'jsoncallback') {
    return this.createRequest(url).asJsonp(callbackParameterName).send();
  }

  options(url) {
    return this.createRequest(url).asOptions().send();
  }

  put(url, content) {
    return this.createRequest(url).asPut().withContent(content).send();
  }

  patch(url, content) {
    return this.createRequest(url).asPatch().withContent(content).send();
  }

  post(url, content) {
    return this.createRequest(url).asPost().withContent(content).send();
  }
};