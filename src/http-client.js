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
   * @param {object|undefined} params Optional request params
   * @return {Promise} A cancellable promise object.
   */
  delete(url, params){
    return this.createRequest(url).asDelete().withParams(params).send();
  }

  /**
   * Sends an HTTP GET request.
   *
   * @method get
   * @param {String} url The target URL.
   * @param {object|undefined} params Optional request params
   * @return {Promise} A cancellable promise object.
   */
  get(url, params){
    return this.createRequest(url).asGet().withParams(params).send();
  }

  /**
   * Sends an HTTP HEAD request.
   *
   * @method head
   * @param {String} url The target URL.
   * @param {object|undefined} params Optional request params
   * @return {Promise} A cancellable promise object.
   */
  head(url, params){
    return this.createRequest(url).asHead().withParams(params).send();
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
   * @param {object|undefined} params Optional request params
   * @return {Promise} A cancellable promise object.
   */
  options(url, params){
    return this.createRequest(url).asOptions().withParams(params).send();
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
