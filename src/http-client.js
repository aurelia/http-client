import core from 'core-js';
import {Headers} from './headers';
import {RequestBuilder} from './request-builder';
import {HttpRequestMessage,createHttpRequestMessageProcessor} from './http-request-message';
import {JSONPRequestMessage,createJSONPRequestMessageProcessor} from './jsonp-request-message';

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
    this.interceptors = [];
    this.isRequesting = false;
  }

  /**
   * Add new interceptor
   *
   * NOTE: Interceptors are stored in reverse order. Inner interceptors before outer interceptors.
   * This reversal is needed so that we can build up the interception chain around the
   * server request.
   *
   * @method addInterceptor
   * @param interceptor A interceptor class with 4 possible methods: "request", "requestError", "response", "responseError"
   * @chainable
   */
  addInterceptor(interceptor) {
    this.interceptors.unshift(interceptor);
    return this;
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

    for(i = 0, ii = transformers.length; i < ii; ++i){
      transformers[i](this, processor, message);
    }

    processRequest = (message) => {
      return processor.process(this, message).then(response => {
        trackRequestEnd(this, processor);
        return response;
      }).catch(response => {
        trackRequestEnd(this, processor);
        throw response;
      });
    };

    var chain = [ processRequest, undefined ];
    // Apply interceptors
    for (let interceptor of this.interceptors) {
      if (interceptor.request || interceptor.requestError) {
        chain.unshift(interceptor.requestError ? interceptor.requestError.bind(interceptor) : undefined);
        chain.unshift(interceptor.request ? interceptor.request.bind(interceptor) : undefined);
      }

      if (interceptor.response || interceptor.responseError) {
        chain.push(interceptor.response ? interceptor.response.bind(interceptor) : undefined);
        chain.push(interceptor.responseError ? interceptor.responseError.bind(interceptor) : undefined);
      }
    }

    promise = Promise.resolve(message);
    while (chain.length) {
      let thenFn = chain.shift();
      let rejectFn = chain.shift();
      promise = promise.then(thenFn, rejectFn);
    }

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
