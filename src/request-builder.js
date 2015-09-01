import {join} from 'aurelia-path';
import {HttpRequestMessage} from './http-request-message';
import {JSONPRequestMessage} from './jsonp-request-message';

interface RequestTransformer {
	(client : HttpClient, processor : RequestMessageProcessor, message : RequestMessage) : void;
}

/**
 * A builder class allowing fluent composition of HTTP requests.
 *
 * @class RequestBuilder
 * @constructor
 */
export class RequestBuilder {
  constructor(client : HttpClient) {
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
  static addHelper(name : string, fn : () => RequestTransformer) : void {
    RequestBuilder.prototype[name] = function() {
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
  send() : Promise<any> {
    let message = this.useJsonp ? new JSONPRequestMessage() : new HttpRequestMessage();
    return this.client.send(message, this.transformers);
  }
}

RequestBuilder.addHelper('asDelete', () => {
  return function(client, processor, message) {
    message.method = 'DELETE';
  };
});

RequestBuilder.addHelper('asGet', () => {
  return function(client, processor, message) {
    message.method = 'GET';
  };
});

RequestBuilder.addHelper('asHead', () => {
  return function(client, processor, message) {
    message.method = 'HEAD';
  };
});

RequestBuilder.addHelper('asOptions', () => {
  return function(client, processor, message) {
    message.method = 'OPTIONS';
  };
});

RequestBuilder.addHelper('asPatch', () => {
  return function(client, processor, message) {
    message.method = 'PATCH';
  };
});

RequestBuilder.addHelper('asPost', () => {
  return function(client, processor, message) {
    message.method = 'POST';
  };
});

RequestBuilder.addHelper('asPut', () => {
  return function(client, processor, message) {
    message.method = 'PUT';
  };
});

RequestBuilder.addHelper('asJsonp', (callbackParameterName) => {
  this.useJsonp = true;
  return function(client, processor, message) {
    message.callbackParameterName = callbackParameterName;
  };
});

RequestBuilder.addHelper('withUrl', (url) => {
  return function(client, processor, message) {
    message.url = url;
  };
});

RequestBuilder.addHelper('withContent', (content) => {
  return function(client, processor, message) {
    message.content = content;
  };
});

RequestBuilder.addHelper('withBaseUrl', (baseUrl) => {
  return function(client, processor, message) {
    message.baseUrl = baseUrl;
  };
});

RequestBuilder.addHelper('withParams', (params) => {
  return function(client, processor, message) {
    message.params = params;
  };
});

RequestBuilder.addHelper('withResponseType', (responseType) => {
  return function(client, processor, message) {
    message.responseType = responseType;
  };
});

RequestBuilder.addHelper('withTimeout', (timeout) => {
  return function(client, processor, message) {
    message.timeout = timeout;
  };
});

RequestBuilder.addHelper('withHeader', (key, value) => {
  return function(client, processor, message) {
    message.headers.add(key, value);
  };
});

RequestBuilder.addHelper('withCredentials', (value) => {
  return function(client, processor, message) {
    message.withCredentials = value;
  };
});

RequestBuilder.addHelper('withReviver', (reviver) => {
  return function(client, processor, message) {
    message.reviver = reviver;
  };
});

RequestBuilder.addHelper('withReplacer', (replacer) => {
  return function(client, processor, message) {
    message.replacer = replacer;
  };
});

RequestBuilder.addHelper('withProgressCallback', (progressCallback) => {
  return function(client, processor, message) {
    message.progressCallback = progressCallback;
  };
});

RequestBuilder.addHelper('withCallbackParameterName', (callbackParameterName) => {
  return function(client, processor, message) {
    message.callbackParameterName = callbackParameterName;
  };
});

RequestBuilder.addHelper('withInterceptor', (interceptor) => {
  return function(client, processor, message) {
    // NOTE: Interceptors are stored in reverse order. Inner interceptors before outer interceptors.
    // This reversal is needed so that we can build up the interception chain around the
    // server request.
    message.interceptors = message.interceptors || [];
    message.interceptors.unshift(interceptor);
  };
});

RequestBuilder.addHelper('skipContentProcessing', () => {
  return function(client, processor, message) {
    message.skipContentProcessing = true;
  }
});
