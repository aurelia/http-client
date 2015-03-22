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
   * @param uri The target URI.
   * @type RequestBuilder
   */
  createRequest(uri){
    let builder = new RequestBuilder(this);

    if(uri) {
      builder.withUri(uri);
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
        processor, promise, i, ii;

    if(!createProcessor){
        throw new Error(`No request message processor factory for ${message.constructor}.`);
    }

    processor = createProcessor();
    trackRequestStart(this, processor);

    transformers = transformers || this.requestTransformers;

    for(i = 0, ii = transformers.length; i < ii; ++i){
      transformers[i](this, processor, message);
    }

    promise = processor.process(this, message);

    promise.abort = promise.cancel = function() {
      processor.abort();
    };

    return promise.then(response => {
      trackRequestEnd(this, processor);
      return response;
    }).catch(response => {
      trackRequestEnd(this, processor);
      throw response;
    });
  }

  /**
   * Sends an HTTP DELETE request.
   *
   * @method delete
   * @param {String} uri The target URI.
   * @return {Promise} A cancellable promise object.
   */
  delete(uri){
    return this.createRequest(uri).asDelete().send();
  }

  /**
   * Sends an HTTP GET request.
   *
   * @method get
   * @param {String} uri The target URI.
   * @return {Promise} A cancellable promise object.
   */
  get(uri){
    return this.createRequest(uri).asGet().send();
  }

  /**
   * Sends an HTTP HEAD request.
   *
   * @method head
   * @param {String} uri The target URI.
   * @return {Promise} A cancellable promise object.
   */
  head(uri){
    return this.createRequest(uri).asHead().send();
  }

  /**
   * Sends a JSONP request.
   *
   * @method jsonp
   * @param {String} uri The target URI.
   * @return {Promise} A cancellable promise object.
   */
  jsonp(uri, callbackParameterName='jsoncallback'){
    return this.createRequest(uri).withJsonpParameter(callbackParameterName).send();
  }

  /**
   * Sends an HTTP OPTIONS request.
   *
   * @method options
   * @param {String} uri The target URI.
   * @return {Promise} A cancellable promise object.
   */
  options(uri){
    return this.createRequest(uri).asOptions().send();
  }

  /**
   * Sends an HTTP PUT request.
   *
   * @method put
   * @param {String} uri The target URI.
   * @param {Object} uri The request payload.
   * @return {Promise} A cancellable promise object.
   */
  put(uri, content){
    return this.createRequest(uri).asPut().withContent(content).send();
  }

  /**
   * Sends an HTTP PATCH request.
   *
   * @method patch
   * @param {String} uri The target URI.
   * @param {Object} uri The request payload.
   * @return {Promise} A cancellable promise object.
   */
  patch(uri, content){
    return this.createRequest(uri).asPatch().withContent(content).send();
  }

  /**
   * Sends an HTTP POST request.
   *
   * @method post
   * @param {String} uri The target URI.
   * @param {Object} uri The request payload.
   * @return {Promise} A cancellable promise object.
   */
  post(uri, content){
    return this.createRequest(uri).asPost().withContent(content).send();
  }
}
