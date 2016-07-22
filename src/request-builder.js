import {HttpRequestMessage} from './http-request-message';
import {JSONPRequestMessage} from './jsonp-request-message';
import {HttpResponseMessage} from './http-response-message';

/**
 * Intercepts requests, responses and errors.
 */
interface Interceptor {
	/**
	 * Intercepts the response.
	 */
	response?: (message: HttpResponseMessage) => HttpResponseMessage | Promise<HttpResponseMessage>;
	/**
	 * Intercepts a response error.
	 */
	responseError?: (error: HttpResponseMessage) => HttpResponseMessage | Promise<HttpResponseMessage>;
	/**
	 * Intercepts the request.
	 */
	request?: (message: RequestMessage) => RequestMessage | Promise<RequestMessage>;
	/**
	 * Intercepts a request error.
	 */
	requestError?: (error: Error) => RequestMessage | Promise<RequestMessage>;
}

/**
 * Transforms a request.
 */
interface RequestTransformer {
	(client: HttpClient, processor: RequestMessageProcessor, message: RequestMessage): void;
}

/**
 * A builder class allowing fluent composition of HTTP requests.
 */
export class RequestBuilder {
	/**
	 * Creates an instance of RequestBuilder
	 * @param client An instance of HttpClient
	 */
  constructor(client: HttpClient) {
    this.client = client;
    this.transformers = client.requestTransformers.slice(0);
    this.useJsonp = false;
  }

	/**
	 * Makes the request a DELETE request.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  asDelete(): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.method = 'DELETE';
    });
  }

	/**
	 * Makes the request a GET request.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  asGet(): RequestBuilder  {
    return this._addTransformer(function(client, processor, message) {
      message.method = 'GET';
    });
  }

	/**
	 * Makes the request a HEAD request.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  asHead(): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.method = 'HEAD';
    });
  }

	/**
	 * Makes the request a OPTIONS request.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  asOptions(): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.method = 'OPTIONS';
    });
  }

	/**
	 * Makes the request a PATCH request.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  asPatch(): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.method = 'PATCH';
    });
  }

	/**
	 * Makes the request a POST request.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  asPost(): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.method = 'POST';
    });
  }

	/**
	 * Makes the request a PUT request.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  asPut(): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.method = 'PUT';
    });
  }

	/**
	 * Makes the request a JSONP request.
	 * @param callbackParameterName The name of the callback to use.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  asJsonp(callbackParameterName: string): RequestBuilder {
    this.useJsonp = true;
    return this._addTransformer(function(client, processor, message) {
      message.callbackParameterName = callbackParameterName;
    });
  }

	/**
	 * Sets the request url.
	 * @param url The url to use.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  withUrl(url: string): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.url = url;
    });
  }

	/**
	 * Sets the request content.
	 * @param The content to send.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  withContent(content: any): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.content = content;
    });
  }

	/**
	 * Sets the base url that will be prepended to the url.
	 * @param baseUrl The base url to use.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  withBaseUrl(baseUrl: string): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.baseUrl = baseUrl;
    });
  }

	/**
	 * Sets params that will be added to the request url as a query string.
	 * @param params The key/value pairs to use to build the query string.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  withParams(params: Object): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.params = params;
    });
  }

	/**
	 * Sets the response type.
	 * @param responseType The response type to expect.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  withResponseType(responseType: string): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.responseType = responseType;
    });
  }

	/**
	 * Sets a timeout for the request.
	 * @param timeout The timeout for the request.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  withTimeout(timeout: number): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.timeout = timeout;
    });
  }

	/**
	 * Sets a header on the request.
	 * @param key The header key to add.
	 * @param value The header value to add.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  withHeader(key: string, value: string): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.headers.add(key, value);
    });
  }

	/**
	 * Sets the withCredentials flag on the request.
	 * @param value The value of the withCredentials flag to set.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  withCredentials(value: boolean): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.withCredentials = value;
    });
  }

	/**
	 * Sets the user and password to use in opening the request.
	 * @param user The username to send.
	 * @param password The password to send.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  withLogin(user: string, password: string): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.user = user; message.password = password;
    });
  }

	/**
	 * Sets a reviver to transform the response content.
	 * @param reviver The reviver to use in processing the response.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  withReviver(reviver: (key: string, value: any) => any): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.reviver = reviver;
    });
  }

	/**
	 * Sets a replacer to transform the request content.
	 * @param replacer The replacer to use in preparing the request.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  withReplacer(replacer: (key: string, value: any) => any): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.replacer = replacer;
    });
  }

	/**
	 * Sets an upload progress callback.
	 * @param progressCallback The progress callback function.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  withProgressCallback(progressCallback: Function): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.progressCallback = progressCallback;
    });
  }

	/**
	 * Sets a callback parameter name for JSONP.
	 * @param callbackParameterName The name of the callback parameter that the JSONP request requires.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  withCallbackParameterName(callbackParameterName: string): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.callbackParameterName = callbackParameterName;
    });
  }

	/**
	 * Adds an interceptor to the request.
	 * @param interceptor The interceptor to add.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  withInterceptor(interceptor: Interceptor): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      // NOTE: Interceptors are stored in reverse order. Inner interceptors before outer interceptors.
      // This reversal is needed so that we can build up the interception chain around the
      // server request.
      message.interceptors = message.interceptors || [];
      message.interceptors.unshift(interceptor);
    });
  }

	/**
	 * Skips the request content processing transform.
	 * @return The chainable RequestBuilder to use in further configuration of the request.
	 */
  skipContentProcessing(): RequestBuilder {
    return this._addTransformer(function(client, processor, message) {
      message.skipContentProcessing = true;
    });
  }

  _addTransformer(fn) {
    this.transformers.push(fn);
    return this;
  }

  /**
   * Adds a user-defined request transformer to the RequestBuilder.
   * @param name The name of the helper to add.
   * @param fn The helper function.
   */
  static addHelper(name: string, fn: () => RequestTransformer): void {
    RequestBuilder.prototype[name] = function() {
      return this._addTransformer(fn.apply(this, arguments));
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
