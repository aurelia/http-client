import {HttpRequestMessage} from './http-request-message';
import {JSONPRequestMessage} from './jsonp-request-message';
import {HttpResponseMessage} from './http-response-message';

interface RequestTransformer {
	(client: HttpClient, processor: RequestMessageProcessor, message: RequestMessage): void;
}

/**
 * A builder class allowing fluent composition of HTTP requests.
 */
export class RequestBuilder {
  constructor(client: HttpClient) {
    this.client = client;
    this.transformers = client.requestTransformers.slice(0);
    this.useJsonp = false;
  }

  /**
   * Adds a user-defined request transformer to the RequestBuilder.
   * @param name The name of the helper to add.
   * @param fn The helper function.
   */
  static addHelper(name: string, fn: () => RequestTransformer): void {
    RequestBuilder.prototype[name] = function() {
      this.transformers.push(fn.apply(this, arguments));
      return this;
    };
  }

  /**
   * Sends the request.
   * @return {Promise} A cancellable promise object.
   */
  send(): Promise<HttpResponseMessage> {
    let message = this.useJsonp ? new JSONPRequestMessage() : new HttpRequestMessage();
    return this.client.send(message, this.transformers);
  }
}

RequestBuilder.addHelper('asDelete', function() {
  return function(client, processor, message) {
    message.method = 'DELETE';
  };
});

RequestBuilder.addHelper('asGet', function() {
  return function(client, processor, message) {
    message.method = 'GET';
  };
});

RequestBuilder.addHelper('asHead', function() {
  return function(client, processor, message) {
    message.method = 'HEAD';
  };
});

RequestBuilder.addHelper('asOptions', function() {
  return function(client, processor, message) {
    message.method = 'OPTIONS';
  };
});

RequestBuilder.addHelper('asPatch', function() {
  return function(client, processor, message) {
    message.method = 'PATCH';
  };
});

RequestBuilder.addHelper('asPost', function() {
  return function(client, processor, message) {
    message.method = 'POST';
  };
});

RequestBuilder.addHelper('asPut', function() {
  return function(client, processor, message) {
    message.method = 'PUT';
  };
});

RequestBuilder.addHelper('asJsonp', function(callbackParameterName) {
  this.useJsonp = true;
  return function(client, processor, message) {
    message.callbackParameterName = callbackParameterName;
  };
});

RequestBuilder.addHelper('withUrl', function(url) {
  return function(client, processor, message) {
    message.url = url;
  };
});

RequestBuilder.addHelper('withContent', function(content) {
  return function(client, processor, message) {
    message.content = content;
  };
});

RequestBuilder.addHelper('withBaseUrl', function(baseUrl) {
  return function(client, processor, message) {
    message.baseUrl = baseUrl;
  };
});

RequestBuilder.addHelper('withParams', function(params) {
  return function(client, processor, message) {
    message.params = params;
  };
});

RequestBuilder.addHelper('withResponseType', function(responseType) {
  return function(client, processor, message) {
    message.responseType = responseType;
  };
});

RequestBuilder.addHelper('withTimeout', function(timeout) {
  return function(client, processor, message) {
    message.timeout = timeout;
  };
});

RequestBuilder.addHelper('withHeader', function(key, value) {
  return function(client, processor, message) {
    message.headers.add(key, value);
  };
});

RequestBuilder.addHelper('withCredentials', function(value) {
  return function(client, processor, message) {
    message.withCredentials = value;
  };
});

RequestBuilder.addHelper('withLogin', function(user, password) {
  return function(client, processor, message) {
    message.user = user; message.password = password;
  };
});

RequestBuilder.addHelper('withReviver', function(reviver) {
  return function(client, processor, message) {
    message.reviver = reviver;
  };
});

RequestBuilder.addHelper('withReplacer', function(replacer) {
  return function(client, processor, message) {
    message.replacer = replacer;
  };
});

RequestBuilder.addHelper('withProgressCallback', function(progressCallback) {
  return function(client, processor, message) {
    message.progressCallback = progressCallback;
  };
});

RequestBuilder.addHelper('withCallbackParameterName', function(callbackParameterName) {
  return function(client, processor, message) {
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

RequestBuilder.addHelper('skipContentProcessing', function() {
  return function(client, processor, message) {
    message.skipContentProcessing = true;
  };
});
