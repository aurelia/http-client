import core from 'core-js';
import {join,buildQueryString} from 'aurelia-path';

export class Headers {
  constructor(headers={}){
    this.headers = headers;
  }

  add(key, value){
    this.headers[key] = value;
  }

  get(key){
    return this.headers[key];
  }

  clear(){
    this.headers = {};
  }

  configureXHR(xhr){
    var headers = this.headers, key;

    for(key in headers){
      xhr.setRequestHeader(key, headers[key]);
    }
  }

  /**
   * XmlHttpRequest's getAllResponseHeaders() method returns a string of response
   * headers according to the format described here:
   * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
   * This method parses that string into a user-friendly key/value pair object.
   */
  static parse(headerStr){
    var headers = new Headers();
    if (!headerStr) {
      return headers;
    }

    var headerPairs = headerStr.split('\u000d\u000a');
    for (var i = 0; i < headerPairs.length; i++) {
      var headerPair = headerPairs[i];
      // Can't use split() here because it does the wrong thing
      // if the header value has the string ": " in it.
      var index = headerPair.indexOf('\u003a\u0020');
      if (index > 0) {
        var key = headerPair.substring(0, index);
        var val = headerPair.substring(index + 2);
        headers.add(key,val);
      }
    }

    return headers;
  }
}

/*jshint -W093 */
export class HttpResponseMessage {
  constructor(requestMessage, xhr, responseType, reviver){
    this.requestMessage = requestMessage;
    this.statusCode = xhr.status;
    this.response = xhr.response || xhr.responseText;
    this.isSuccess = xhr.status >= 200 && xhr.status < 400;
    this.statusText = xhr.statusText;
    this.reviver = reviver;
    this.mimeType = null;

    if(xhr.getAllResponseHeaders){
      try{
        this.headers = Headers.parse(xhr.getAllResponseHeaders());
      }catch(err){
        //if this fails it means the xhr was a mock object so the `requestHeaders` property should be used
        if(xhr.requestHeaders) this.headers = { headers:xhr.requestHeaders };
      }
    }else {
      this.headers = new Headers();
    }

    var contentType;
    if(this.headers && this.headers.headers) contentType = this.headers.headers["Content-Type"];
    if(contentType) {
      this.mimeType = responseType = contentType.split(";")[0].trim();
      if(mimeTypes.hasOwnProperty(this.mimeType)) responseType = mimeTypes[this.mimeType];
    }
    this.responseType = responseType;
  }

  get content(){
    try{
      if(this._content !== undefined){
        return this._content;
      }

      if(this.response === undefined || this.response === null){
        return this._content = this.response;
      }

      if(this.responseType === 'json'){
        return this._content = JSON.parse(this.response, this.reviver);
      }

      if(this.reviver){
        return this._content = this.reviver(this.response);
      }

      return this._content = this.response;
    }catch(e){
      if(this.isSuccess){
        throw e;
      }

      return this._content = null;
    }
  }
}

/**
 * MimeTypes mapped to responseTypes
 *
 * @type {Object}
 */
export var mimeTypes = {
  "text/html": "html",
  "text/javascript": "js",
  "application/javascript": "js",
  "text/json": "json",
  "application/json": "json",
  "application/rss+xml": "rss",
  "application/atom+xml": "atom",
  "application/xhtml+xml": "xhtml",
  "text/markdown": "md",
  "text/xml": "xml",
  "text/mathml": "mml",
  "application/xml": "xml",
  "text/yml": "yml",
  "text/csv": "csv",
  "text/css": "css",
  "text/less": "less",
  "text/stylus": "styl",
  "text/scss": "scss",
  "text/sass": "sass",
  "text/plain": "txt"
};

function applyXhrTransformers(xhrTransformers, client, processor, message, xhr) {
  var i, ii;
  for (i = 0, ii = xhrTransformers.length; i < ii; ++i) {
      xhrTransformers[i](client, processor, message, xhr);
  }
}

export class RequestMessageProcessor {
  constructor(xhrType, xhrTransformers){
    this.XHRType = xhrType;
    this.xhrTransformers = xhrTransformers;
    this.isAborted = false;
  }

  abort(){
    // The logic here is if the xhr object is not set then there is nothing to abort so the intent was carried out
    // Also test if the XHR is UNSENT - if not, it will be aborted in the process() phase
    if(this.xhr && this.xhr.readyState !== XMLHttpRequest.UNSENT){
      this.xhr.abort();
    }
    this.isAborted = true;
  }

  process(client, message) {
    var promise = new Promise((resolve, reject) => {
      var xhr = this.xhr = new this.XHRType();

      xhr.onload = (e) => {
        var response = new HttpResponseMessage(message, xhr, message.responseType, message.reviver);
        if (response.isSuccess) {
          resolve(response);
        } else {
          reject(response);
        }
      };

      xhr.ontimeout = (e) => {
        reject(new HttpResponseMessage(message, {
          response: e,
          status: xhr.status,
          statusText: xhr.statusText
        }, 'timeout'));
      };

      xhr.onerror = (e) => {
        reject(new HttpResponseMessage(message, {
          response: e,
          status: xhr.status,
          statusText: xhr.statusText
        }, 'error'));
      };

      xhr.onabort = (e) => {
        reject(new HttpResponseMessage(message, {
          response: e,
          status: xhr.status,
          statusText: xhr.statusText
        }, 'abort'));
      };
    });

    return Promise.resolve(message)
      .then((message) => {
        var processRequest = () => {
          if (this.isAborted) {
            // Some interceptors can delay sending of XHR, so when abort is called
            // before XHR is actually sent we abort() instead send()
            this.xhr.abort();
          } else {
            this.xhr.open(message.method, message.buildFullUrl(), true);
            applyXhrTransformers(this.xhrTransformers, client, this, message, this.xhr);
            this.xhr.send(message.content);
          }

          return promise;
        };

        // [ onFullfilled, onReject ] pairs
        var chain = [[processRequest, undefined]];
        // Apply interceptors chain from the message.interceptors
        var interceptors = message.interceptors || [];
        interceptors.forEach(function (interceptor) {
          if (interceptor.request || interceptor.requestError) {
            chain.unshift([
              interceptor.request ? interceptor.request.bind(interceptor) : undefined,
              interceptor.requestError ? interceptor.requestError.bind(interceptor) : undefined
            ]);
          }

          if (interceptor.response || interceptor.responseError) {
            chain.push([
              interceptor.response ? interceptor.response.bind(interceptor) : undefined,
              interceptor.responseError ? interceptor.responseError.bind(interceptor) : undefined
            ]);
          }
        });

        var interceptorsPromise = Promise.resolve(message);

        while (chain.length) {
          interceptorsPromise = interceptorsPromise.then(...chain.shift());
        }

        return interceptorsPromise;
      });
  }
}

export function timeoutTransformer(client, processor, message, xhr){
  if(message.timeout !== undefined){
    xhr.timeout = message.timeout;
  }
}

export function callbackParameterNameTransformer(client, processor, message, xhr){
  if(message.callbackParameterName !== undefined){
    xhr.callbackParameterName = message.callbackParameterName;
  }
}

export function credentialsTransformer(client, processor, message, xhr){
  if(message.withCredentials !== undefined){
    xhr.withCredentials = message.withCredentials;
  }
}

export function progressTransformer(client, processor, message, xhr){
  if(message.progressCallback){
    xhr.upload.onprogress = message.progressCallback;
  }
}

export function responseTypeTransformer(client, processor, message, xhr){
  var responseType = message.responseType;

  if(responseType === 'json'){
    responseType = 'text'; //IE does not support json
  }

  xhr.responseType = responseType;
}

export function headerTransformer(client, processor, message, xhr){
  message.headers.configureXHR(xhr);
}

export function contentTransformer(client, processor, message, xhr){
  if(window.FormData && message.content instanceof FormData){
    return;
  }

  if(window.Blob && message.content instanceof Blob){
    return;
  }

  if(window.ArrayBufferView && message.content instanceof ArrayBufferView){
    return;
  }

  if(message.content instanceof Document){
    return;
  }

  if(typeof message.content === 'string'){
    return;
  }

  if(message.content === null || message.content === undefined){
    return;
  }

  message.content = JSON.stringify(message.content, message.replacer);

  if (message.headers.get('Content-Type') === undefined) {
    message.headers.add('Content-Type', 'application/json');
  }
}

export class JSONPRequestMessage extends RequestMessage {
  constructor(url, callbackParameterName){
    super('JSONP', url);
    this.responseType = 'jsonp';
    this.callbackParameterName = callbackParameterName;
  }
}

class JSONPXHR {
  open(method, url){
    this.method = method;
    this.url = url;
    this.callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
  }

  send(){
    let url = this.url + (this.url.indexOf('?') >= 0 ? '&' : '?') + encodeURIComponent(this.callbackParameterName) + '=' + this.callbackName;
    let script = document.createElement('script');

    script.src = url;
    script.onerror = (e) => {
      cleanUp();

      this.status = 0;
      this.onerror(new Error('error'))
    };

    let cleanUp = () => {
      delete window[this.callbackName];
      document.body.removeChild(script);
    };

    window[this.callbackName] = (data) => {
      cleanUp();

      if(this.status === undefined){
        this.status = 200;
        this.statusText = 'OK';
        this.response = data;
        this.onload(this);
      }
    };

    document.body.appendChild(script);

    if(this.timeout !== undefined){
      setTimeout(() => {
        if(this.status === undefined){
          this.status = 0;
          this.ontimeout(new Error('timeout'));
        }
      }, this.timeout);
    }
  }

  abort(){
    if(this.status === undefined){
      this.status = 0;
      this.onabort(new Error('abort'));
    }
  }

  setRequestHeader(){}
}

export function createJSONPRequestMessageProcessor(){
  return new RequestMessageProcessor(JSONPXHR, [
    timeoutTransformer,
    callbackParameterNameTransformer
  ]);
}

export class HttpRequestMessage extends RequestMessage {
  constructor(method, url, content, headers){
    super(method, url, content, headers);
    this.responseType = 'json'; //text, arraybuffer, blob, document
  }
}

export function createHttpRequestMessageProcessor(){
  return new RequestMessageProcessor(XMLHttpRequest, [
    timeoutTransformer,
    credentialsTransformer,
    progressTransformer,
    responseTypeTransformer,
    contentTransformer,
    headerTransformer
  ]);
}

/**
 * A builder class allowing fluent composition of HTTP requests.
 *
 * @class RequestBuilder
 * @constructor
 */
export class RequestBuilder {
  constructor(client){
    this.client = client;
    this.transformers = client.requestTransformers.slice(0);
    this.useJsonp = false;
  }

  /**
   * Adds a user-defined request transformer to the RequestBuilder.
   *
   * @method addHelper
   * @param {String} name The name of the helper to add.
   * @param {Function} fn The helper function.
   * @chainable
   */
  static addHelper(name, fn){
    RequestBuilder.prototype[name] = function(){
      this.transformers.push(fn.apply(this, arguments));
      return this;
    };
  }

  /**
   * Sends the request.
   *
   * @method send
   * @return {Promise} A cancellable promise object.
   */
  send(){
    let message = this.useJsonp ? new JSONPRequestMessage() : new HttpRequestMessage();
    return this.client.send(message, this.transformers);
  }
}

RequestBuilder.addHelper('asDelete', function(){
  return function(client, processor, message){
    message.method = 'DELETE';
  };
});

RequestBuilder.addHelper('asGet', function(){
  return function(client, processor, message){
    message.method = 'GET';
  };
});

RequestBuilder.addHelper('asHead', function(){
  return function(client, processor, message){
    message.method = 'HEAD';
  };
});

RequestBuilder.addHelper('asOptions', function(){
  return function(client, processor, message){
    message.method = 'OPTIONS';
  };
});

RequestBuilder.addHelper('asPatch', function(){
  return function(client, processor, message){
    message.method = 'PATCH';
  };
});

RequestBuilder.addHelper('asPost', function(){
  return function(client, processor, message){
    message.method = 'POST';
  };
});

RequestBuilder.addHelper('asPut', function(){
  return function(client, processor, message){
    message.method = 'PUT';
  };
});

RequestBuilder.addHelper('asJsonp', function(callbackParameterName){
  this.useJsonp = true;
  return function(client, processor, message){
    message.callbackParameterName = callbackParameterName;
  };
});

RequestBuilder.addHelper('withUrl', function(url){
  return function(client, processor, message){
    message.url = url;
  };
});

RequestBuilder.addHelper('withContent', function(content){
  return function(client, processor, message){
    message.content = content;
  };
});

RequestBuilder.addHelper('withBaseUrl', function(baseUrl){
  return function(client, processor, message){
    message.baseUrl = baseUrl;
  };
});

RequestBuilder.addHelper('withParams', function(params){
  return function(client, processor, message){
    message.params = params;
  };
});

RequestBuilder.addHelper('withResponseType', function(responseType){
  return function(client, processor, message){
    message.responseType = responseType;
  };
});

RequestBuilder.addHelper('withTimeout', function(timeout){
  return function(client, processor, message){
    message.timeout = timeout;
  };
});

RequestBuilder.addHelper('withHeader', function(key, value){
  return function(client, processor, message){
    message.headers.add(key, value);
  };
});

RequestBuilder.addHelper('withCredentials', function(value){
  return function(client, processor, message){
    message.withCredentials = value;
  };
});

RequestBuilder.addHelper('withReviver', function(reviver){
  return function(client, processor, message){
    message.reviver = reviver;
  };
});

RequestBuilder.addHelper('withReplacer', function(replacer){
  return function(client, processor, message){
    message.replacer = replacer;
  };
});

RequestBuilder.addHelper('withProgressCallback', function(progressCallback){
  return function(client, processor, message){
    message.progressCallback = progressCallback;
  };
});

RequestBuilder.addHelper('withCallbackParameterName', function(callbackParameterName){
  return function(client, processor, message){
    message.callbackParameterName = callbackParameterName;
  };
});

RequestBuilder.addHelper('withInterceptor', function(interceptor) {
  return function(client, processor, message) {
    // NOTE: Interceptors are stored in reverse order. Inner interceptors before outer interceptors.
    // This reversal is needed so that we can build up the interception chain around the
    // server request.
    message.interceptors = message.interceptors || [];
    message.interceptors.unshift(interceptor);
  };
});

export class RequestMessage {
  constructor(method, url, content, headers) {
    this.method = method;
    this.url = url;
    this.content = content;
    this.headers = headers || new Headers();
    this.baseUrl = '';
  }

  buildFullUrl() {
    var url = join(this.baseUrl, this.url);

    if(this.params){
      var qs = buildQueryString(this.params);
      url = qs ? `${url}?${qs}` : url;
    }

    return url;
  }
}

function trackRequestStart(client, processor){
  client.pendingRequests.push(processor);
  client.isRequesting = true;
}

function trackRequestEnd(client, processor){
  var index = client.pendingRequests.indexOf(processor);

  client.pendingRequests.splice(index, 1);
  client.isRequesting = client.pendingRequests.length > 0;

  if(!client.isRequesting){
    var evt = new window.CustomEvent('aurelia-http-client-requests-drained', { bubbles: true, cancelable: true });
    setTimeout(() => document.dispatchEvent(evt), 1);
  }
}

/**
* The main HTTP client object.
*
* @class HttpClient
* @constructor
*/
export class HttpClient {
  constructor(){
    this.requestTransformers = [];
    this.requestProcessorFactories = new Map();
    this.requestProcessorFactories.set(HttpRequestMessage, createHttpRequestMessageProcessor);
    this.requestProcessorFactories.set(JSONPRequestMessage, createJSONPRequestMessageProcessor);
    this.pendingRequests = [];
    this.isRequesting = false;
  }

  /**
   * Configure this HttpClient with default settings to be used by all requests.
   *
   * @method configure
   * @param {Function} fn A function that takes a RequestBuilder as an argument.
   * @chainable
   */
  configure(fn){
    var builder = new RequestBuilder(this);
    fn(builder);
    this.requestTransformers = builder.transformers;
    return this;
  }

  /**
   * Returns a new RequestBuilder for this HttpClient instance that can be used to build and send HTTP requests.
   *
   * @method createRequest
   * @param url The target URL.
   * @type RequestBuilder
   */
  createRequest(url){
    let builder = new RequestBuilder(this);

    if(url) {
      builder.withUrl(url);
    }

    return builder;
  }

  /**
   * Sends a message using the underlying networking stack.
   *
   * @method send
   * @param message A configured HttpRequestMessage or JSONPRequestMessage.
   * @param {Array} transformers A collection of transformers to apply to the HTTP request.
   * @return {Promise} A cancellable promise object.
   */
  send(message, transformers){
    var createProcessor = this.requestProcessorFactories.get(message.constructor),
        processor, promise, i, ii, processRequest;

    if(!createProcessor){
      throw new Error(`No request message processor factory for ${message.constructor}.`);
    }

    processor = createProcessor();
    trackRequestStart(this, processor);

    transformers = transformers || this.requestTransformers;

    promise = Promise.resolve(message)
      .then((message) => {
        // First apply transformers passed to the client.send()
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

    promise.abort = promise.cancel = function() {
      processor.abort();
    };

    return promise;
  }

  /**
   * Sends an HTTP DELETE request.
   *
   * @method delete
   * @param {String} url The target URL.
   * @return {Promise} A cancellable promise object.
   */
  delete(url){
    return this.createRequest(url).asDelete().send();
  }

  /**
   * Sends an HTTP GET request.
   *
   * @method get
   * @param {String} url The target URL.
   * @return {Promise} A cancellable promise object.
   */
  get(url){
    return this.createRequest(url).asGet().send();
  }

  /**
   * Sends an HTTP HEAD request.
   *
   * @method head
   * @param {String} url The target URL.
   * @return {Promise} A cancellable promise object.
   */
  head(url){
    return this.createRequest(url).asHead().send();
  }

  /**
   * Sends a JSONP request.
   *
   * @method jsonp
   * @param {String} url The target URL.
   * @return {Promise} A cancellable promise object.
   */
  jsonp(url, callbackParameterName='jsoncallback'){
    return this.createRequest(url).asJsonp(callbackParameterName).send();
  }

  /**
   * Sends an HTTP OPTIONS request.
   *
   * @method options
   * @param {String} url The target URL.
   * @return {Promise} A cancellable promise object.
   */
  options(url){
    return this.createRequest(url).asOptions().send();
  }

  /**
   * Sends an HTTP PUT request.
   *
   * @method put
   * @param {String} url The target URL.
   * @param {Object} url The request payload.
   * @return {Promise} A cancellable promise object.
   */
  put(url, content){
    return this.createRequest(url).asPut().withContent(content).send();
  }

  /**
   * Sends an HTTP PATCH request.
   *
   * @method patch
   * @param {String} url The target URL.
   * @param {Object} url The request payload.
   * @return {Promise} A cancellable promise object.
   */
  patch(url, content){
    return this.createRequest(url).asPatch().withContent(content).send();
  }

  /**
   * Sends an HTTP POST request.
   *
   * @method post
   * @param {String} url The target URL.
   * @param {Object} url The request payload.
   * @return {Promise} A cancellable promise object.
   */
  post(url, content){
    return this.createRequest(url).asPost().withContent(content).send();
  }
}
