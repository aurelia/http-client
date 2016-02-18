/*eslint no-unused-vars:0*/
import {DOM} from 'aurelia-pal';
import {RequestMessage} from './request-message';
import {RequestBuilder} from './request-builder';
import {HttpRequestMessage, createHttpRequestMessageProcessor} from './http-request-message';
import {HttpResponseMessage} from './http-response-message';
import {JSONPRequestMessage, createJSONPRequestMessageProcessor} from './jsonp-request-message';
import {RequestMessageProcessor} from './request-message-processor';

function trackRequestStart(client: HttpClient, processor: RequestMessageProcessor) {
  client.pendingRequests.push(processor);
  client.isRequesting = true;
}

function trackRequestEnd(client: HttpClient, processor: RequestMessageProcessor) {
  let index = client.pendingRequests.indexOf(processor);

  client.pendingRequests.splice(index, 1);
  client.isRequesting = client.pendingRequests.length > 0;

  if (!client.isRequesting) {
    let evt = DOM.createCustomEvent('aurelia-http-client-requests-drained', { bubbles: true, cancelable: true });
    setTimeout(() => DOM.dispatchEvent(evt), 1);
  }
}

/**
* The main HTTP client object.
*/
export class HttpClient {
  /**
  * Indicates whether or not the client is in the process of requesting resources.
  */
  isRequesting: boolean = false;

  /**
  * Creates an instance of HttpClient.
  */
  constructor() {
    this.requestTransformers = [];
    this.requestProcessorFactories = new Map();
    this.requestProcessorFactories.set(HttpRequestMessage, createHttpRequestMessageProcessor);
    this.requestProcessorFactories.set(JSONPRequestMessage, createJSONPRequestMessageProcessor);
    this.pendingRequests = [];
  }

  /**
   * Configure this HttpClient with default settings to be used by all requests.
   * @param fn A function that takes a RequestBuilder as an argument.
   */
  configure(fn: (builder: RequestBuilder) => void): HttpClient {
    let builder = new RequestBuilder(this);
    fn(builder);
    this.requestTransformers = builder.transformers;
    return this;
  }

  /**
   * Returns a new RequestBuilder for this HttpClient instance that can be used to build and send HTTP requests.
   * @param url The target URL.
   */
  createRequest(url: string): RequestBuilder {
    let builder = new RequestBuilder(this);

    if (url) {
      builder.withUrl(url);
    }

    return builder;
  }

  /**
   * Sends a message using the underlying networking stack.
   * @param message A configured HttpRequestMessage or JSONPRequestMessage.
   * @param transformers A collection of transformers to apply to the HTTP request.
   * @return A cancellable promise object.
   */
  send(requestMessage: RequestMessage, transformers: Array<RequestTransformer>): Promise<HttpResponseMessage> {
    let createProcessor = this.requestProcessorFactories.get(requestMessage.constructor);
    let processor;
    let promise;
    let i;
    let ii;

    if (!createProcessor) {
      throw new Error(`No request message processor factory for ${requestMessage.constructor}.`);
    }

    processor = createProcessor();
    trackRequestStart(this, processor);

    transformers = transformers || this.requestTransformers;

    promise = Promise.resolve(requestMessage)
      .then(message => {
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
   * @param url The target URL.
   * @return A cancellable promise object.
   */
  delete(url: string): Promise<HttpResponseMessage> {
    return this.createRequest(url).asDelete().send();
  }

  /**
   * Sends an HTTP GET request.
   * @param url The target URL.
   * @return {Promise} A cancellable promise object.
   */
  get(url: string): Promise<HttpResponseMessage> {
    return this.createRequest(url).asGet().send();
  }

  /**
   * Sends an HTTP HEAD request.
   * @param url The target URL.
   * @return A cancellable promise object.
   */
  head(url: string): Promise<HttpResponseMessage> {
    return this.createRequest(url).asHead().send();
  }

  /**
   * Sends a JSONP request.
   * @param url The target URL.
   * @return A cancellable promise object.
   */
  jsonp(url: string, callbackParameterName: string = 'jsoncallback'): Promise<HttpResponseMessage> {
    return this.createRequest(url).asJsonp(callbackParameterName).send();
  }

  /**
   * Sends an HTTP OPTIONS request.
   * @param url The target URL.
   * @return A cancellable promise object.
   */
  options(url: string): Promise<HttpResponseMessage> {
    return this.createRequest(url).asOptions().send();
  }

  /**
   * Sends an HTTP PUT request.
   * @param url The target URL.
   * @param content The request payload.
   * @return A cancellable promise object.
   */
  put(url: string, content: any): Promise<HttpResponseMessage> {
    return this.createRequest(url).asPut().withContent(content).send();
  }

  /**
   * Sends an HTTP PATCH request.
   * @param url The target URL.
   * @param content The request payload.
   * @return A cancellable promise object.
   */
  patch(url: string, content: any): Promise<HttpResponseMessage> {
    return this.createRequest(url).asPatch().withContent(content).send();
  }

  /**
   * Sends an HTTP POST request.
   * @param url The target URL.
   * @param content The request payload.
   * @return A cancellable promise object.
   */
  post(url: string, content: any): Promise<HttpResponseMessage> {
    return this.createRequest(url).asPost().withContent(content).send();
  }
}
