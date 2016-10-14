import {join,buildQueryString} from 'aurelia-path';
import {PLATFORM,DOM} from 'aurelia-pal';

/**
* Represents http request/response headers.
*/
export class Headers {
  /**
  * Creates an instance of the headers class.
  * @param headers A set of key/values to initialize the headers with.
  */
  constructor(headers?: Object = {}) {
    this.headers = {};
    // Convert object to set with case insensitive keys
    for (let key in headers) {
      this.headers[key.toLowerCase()] = {key, value: headers[key]};
    }
  }

  /**
  * Adds a header.
  * @param key The header key.
  * @param value The header value.
  */
  add(key: string, value: string): void {
    this.headers[key.toLowerCase()] = {key, value};
  }

  /**
  * Gets a header value.
  * @param key The header key.
  * @return The header value.
  */
  get(key: string): string {
    let header = this.headers[key.toLowerCase()];
    return header ? header.value : undefined;
  }

  /**
  * Clears the headers.
  */
  clear(): void {
    this.headers = {};
  }

  /**
  * Determines whether or not the indicated header exists in the collection.
  * @param header The header key to check.
  * @return True if it exists, false otherwise.
  */
  has(header: string): boolean {
    return this.headers.hasOwnProperty(header.toLowerCase());
  }

  /**
  * Configures an XMR object with the headers.
  * @param xhr The XHRT instance to configure.
  */
  configureXHR(xhr: XHR): void {
    for (let name in this.headers) {
      if (this.headers.hasOwnProperty(name)) {
        xhr.setRequestHeader(this.headers[name].key, this.headers[name].value);
      }
    }
  }

  /**
   * XmlHttpRequest's getAllResponseHeaders() method returns a string of response
   * headers according to the format described here:
   * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
   * This method parses that string into a user-friendly key/value pair object.
   * @param headerStr The string from the XHR.
   * @return A Headers instance containing the parsed headers.
   */
  static parse(headerStr: string): Headers {
    let headers = new Headers();
    if (!headerStr) {
      return headers;
    }

    let headerPairs = headerStr.split('\u000d\u000a');
    for (let i = 0; i < headerPairs.length; i++) {
      let headerPair = headerPairs[i];
      // Can't use split() here because it does the wrong thing
      // if the header value has the string ": " in it.
      let index = headerPair.indexOf('\u003a\u0020');
      if (index > 0) {
        let key = headerPair.substring(0, index);
        let val = headerPair.substring(index + 2);
        headers.add(key, val);
      }
    }

    return headers;
  }
}

/**
* Represents a request message.
*/
export class RequestMessage {
  /**
  * The HTTP method.
  */
  method: string;

  /**
  * The url to submit the request to.
  */
  url: string;

  /**
  * The content of the request.
  */
  content: any;

  /**
  * The headers to send along with the request.
  */
  headers: Headers;

  /**
  * The base url that the request url is joined with.
  */
  baseUrl: string;

  /**
  * Creates an instance of RequestMessage.
  * @param method The HTTP method.
  * @param url The url to submit the request to.
  * @param content The content of the request.
  * @param headers The headers to send along with the request.
  */
  constructor(method: string, url: string, content: any, headers?: Headers) {
    this.method = method;
    this.url = url;
    this.content = content;
    this.headers = headers || new Headers();
    this.baseUrl = '';
  }

  /**
  * Builds the url to make the request from.
  * @return The constructed url.
  */
  buildFullUrl(): string {
    let absoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;
    let url = absoluteUrl.test(this.url) ? this.url : join(this.baseUrl, this.url);

    if (this.params) {
      let qs = buildQueryString(this.params);
      url = qs ? url + (this.url.indexOf('?') < 0 ? '?' : '&') + qs : url;
    }

    return url;
  }
}

/**
* Represents a response message from an HTTP or JSONP request.
*/
export class HttpResponseMessage {
  /**
  * The request message that resulted in this response.
  */
  requestMessage: RequestMessage;

  /**
  * The status code of the response.
  */
  statusCode: number;

  /**
  * The raw response.
  */
  response: any;

  /**
  * The type of the response.
  */
  responseType: string;

  /**
  * The success status of the request based on status code.
  */
  isSuccess: boolean;

  /**
  * The status text.
  */
  statusText: string;

  /**
  * A reviver function to use in transforming the content.
  */
  reviver: (key: string, value: any) => any;

  /**
  * The mime type of the response.
  */
  mimeType: string;

  /**
  * The headers received with the response.
  */
  headers: Headers;

  /**
  * Creates an instance of HttpResponseMessage.
  * @param requestMessage The request message that resulted in this response.
  * @param xhr The XHR instance that made the request.
  * @param responseType The type of the response.
  * @param reviver A reviver function to use in transforming the content.
  */
  constructor(requestMessage: RequestMessage, xhr: XHR, responseType: string, reviver: (key: string, value: any) => any) {
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
        //if this fails it means the xhr was a mock object so the `requestHeaders` property should be used
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

  /**
  * Gets the content of the response.
  * @return the response content.
  */
  get content(): any {
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
}

/**
 * MimeTypes mapped to responseTypes
 *
 * @type {Object}
 */
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

/*eslint no-unused-vars:0*/
function applyXhrTransformers(xhrTransformers, client, processor, message, xhr) {
  let i;
  let ii;

  for (i = 0, ii = xhrTransformers.length; i < ii; ++i) {
    xhrTransformers[i](client, processor, message, xhr);
  }
}

/**
 * Creates an XHR implementation.
 */
interface XHRConstructor {
	//new():XHR;
}

/**
 * Represents an XHR.
 */
interface XHR {
  /**
  * The status code of the response.
  */
  status: number;
  /**
  * The status text.
  */
  statusText: string;
  /**
  * The raw response.
  */
  response: any;
  /**
  * The raw response text.
  */
  responseText: string;
  /**
  * The load callback.
  */
  onload: Function;
  /**
  * The timeout callback.
  */
  ontimeout: Function;
  /**
  * The error callback.
  */
  onerror: Function;
  /**
  * The abort callback.
  */
  onabort: Function;
  /**
  * Aborts the request.
  */
  abort(): void;
  /**
  * Opens the XHR channel.
  */
  open(method: string, url: string, isAsync: boolean, user?: string, password?: string): void;
  /**
  * Sends the request.
  */
  send(content? : any): void;
}

/**
 * Represents an XHR transformer.
 */
interface XHRTransformer {
  (client: HttpClient, processor: RequestMessageProcessor, message: RequestMessage, xhr: XHR): void;
}

/**
 * Processes request messages.
 */
export class RequestMessageProcessor {
  /**
   * Creates an instance of RequestMessageProcessor.
   */
  constructor(xhrType: XHRConstructor, xhrTransformers: XHRTransformer[]) {
    this.XHRType = xhrType;
    this.xhrTransformers = xhrTransformers;
    this.isAborted = false;
  }

  /**
   * Aborts the request.
   */
  abort(): void {
    // The logic here is if the xhr object is not set then there is nothing to abort so the intent was carried out
    // Also test if the XHR is UNSENT - if not, it will be aborted in the process() phase
    if (this.xhr && this.xhr.readyState !== PLATFORM.XMLHttpRequest.UNSENT) {
      this.xhr.abort();
    }

    this.isAborted = true;
  }

  /**
   * Processes the request.
   * @param client The HttpClient making the request.
   * @param requestMessage The message to process.
   * @return A promise for an HttpResponseMessage.
   */
  process(client: HttpClient, requestMessage: RequestMessage): Promise<HttpResponseMessage> {
    let promise = new Promise((resolve, reject) => {
      let xhr = this.xhr = new this.XHRType();

      xhr.onload = (e) => {
        let response = new HttpResponseMessage(requestMessage, xhr, requestMessage.responseType, requestMessage.reviver);
        if (response.isSuccess) {
          resolve(response);
        } else {
          reject(response);
        }
      };

      xhr.ontimeout = (e) => {
        reject(new HttpResponseMessage(requestMessage, {
          response: e,
          status: xhr.status,
          statusText: xhr.statusText
        }, 'timeout'));
      };

      xhr.onerror = (e) => {
        reject(new HttpResponseMessage(requestMessage, {
          response: e,
          status: xhr.status,
          statusText: xhr.statusText
        }, 'error'));
      };

      xhr.onabort = (e) => {
        reject(new HttpResponseMessage(requestMessage, {
          response: e,
          status: xhr.status,
          statusText: xhr.statusText
        }, 'abort'));
      };
    });

    return Promise.resolve(requestMessage)
      .then(message => {
        let processRequest = () => {
          if (this.isAborted) {
            // Some interceptors can delay sending of XHR, so when abort is called
            // before XHR is actually sent we abort() instead send()
            this.xhr.abort();
          } else {
            this.xhr.open(message.method, message.buildFullUrl(), true, message.user, message.password);
            applyXhrTransformers(this.xhrTransformers, client, this, message, this.xhr);
            if (typeof message.content === 'undefined') {
              // IE serializes undefined as "undefined"
              // some servers reject such requests because of unexpected payload, e.g. in case of DELETE requests
              this.xhr.send();
            } else {
              this.xhr.send(message.content);
            }
          }

          return promise;
        };

        // [ onFullfilled, onReject ] pairs
        let chain = [[processRequest, undefined]];
        // Apply interceptors chain from the message.interceptors
        let interceptors = message.interceptors || [];
        interceptors.forEach(function(interceptor) {
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

        let interceptorsPromise = Promise.resolve(message);

        while (chain.length) {
          interceptorsPromise = interceptorsPromise.then(...chain.shift());
        }

        return interceptorsPromise;
      });
  }
}

/**
* Adds a timeout to the request.
* @param client The http client.
* @param processor The request message processor.
* @param message The request message.
* @param xhr The xhr instance.
*/
export function timeoutTransformer(client: HttpClient, processor: RequestMessageProcessor, message: RequestMessage, xhr: XHR) {
  if (message.timeout !== undefined) {
    xhr.timeout = message.timeout;
  }
}

/**
* Adds a callback parameter name to the request.
* @param client The http client.
* @param processor The request message processor.
* @param message The request message.
* @param xhr The xhr instance.
*/
export function callbackParameterNameTransformer(client: HttpClient, processor: RequestMessageProcessor, message: RequestMessage, xhr: XHR) {
  if (message.callbackParameterName !== undefined) {
    xhr.callbackParameterName = message.callbackParameterName;
  }
}

/**
* Sets withCredentials on the request.
* @param client The http client.
* @param processor The request message processor.
* @param message The request message.
* @param xhr The xhr instance.
*/
export function credentialsTransformer(client: HttpClient, processor: RequestMessageProcessor, message: RequestMessage, xhr: XHR) {
  if (message.withCredentials !== undefined) {
    xhr.withCredentials = message.withCredentials;
  }
}

/**
* Adds an onprogress callback to the request.
* @param client The http client.
* @param processor The request message processor.
* @param message The request message.
* @param xhr The xhr instance.
*/
export function progressTransformer(client: HttpClient, processor: RequestMessageProcessor, message: RequestMessage, xhr: XHR) {
  if (message.progressCallback) {
    xhr.upload.onprogress = message.progressCallback;
  }
}

/**
* Adds a response type transformer to the request.
* @param client The http client.
* @param processor The request message processor.
* @param message The request message.
* @param xhr The xhr instance.
*/
export function responseTypeTransformer(client: HttpClient, processor: RequestMessageProcessor, message: RequestMessage, xhr: XHR) {
  let responseType = message.responseType;

  if (responseType === 'json') {
    responseType = 'text'; //IE does not support json
  }

  xhr.responseType = responseType;
}

/**
* Adds headers to the request.
* @param client The http client.
* @param processor The request message processor.
* @param message The request message.
* @param xhr The xhr instance.
*/
export function headerTransformer(client: HttpClient, processor: RequestMessageProcessor, message: RequestMessage, xhr: XHR) {
  message.headers.configureXHR(xhr);
}

/**
* Transforms the content of the request.
* @param client The http client.
* @param processor The request message processor.
* @param message The request message.
* @param xhr The xhr instance.
*/
export function contentTransformer(client: HttpClient, processor: RequestMessageProcessor, message: RequestMessage, xhr: XHR) {
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

/**
* Represents an JSONP request message.
*/
export class JSONPRequestMessage extends RequestMessage {
  /**
  * Creates an instance of JSONPRequestMessage.
  * @param url The url to submit the request to.
  * @param callbackParameterName The name of the callback parameter that the api expects.
  */
  constructor(url: string, callbackParameterName: string) {
    super('JSONP', url);
    this.responseType = 'jsonp';
    this.callbackParameterName = callbackParameterName;
  }
}

class JSONPXHR {
  open(method: string, url: string): void {
    this.method = method;
    this.url = url;
    this.callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
  }

  send(): void {
    let url = this.url + (this.url.indexOf('?') >= 0 ? '&' : '?') + encodeURIComponent(this.callbackParameterName) + '=' + this.callbackName;
    let script = DOM.createElement('script');

    script.src = url;
    script.onerror = (e) => {
      cleanUp();

      this.status = 0;
      this.onerror(new Error('error'));
    };

    let cleanUp = () => {
      delete PLATFORM.global[this.callbackName];
      DOM.removeNode(script);
    };

    PLATFORM.global[this.callbackName] = (data) => {
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

  abort() : void {
    if (this.status === undefined) {
      this.status = 0;
      this.onabort(new Error('abort'));
    }
  }

  setRequestHeader() {}
}

/**
* Creates a RequestMessageProcessor for handling JSONP request messages.
* @return A processor instance for JSONP request messages.
*/
export function createJSONPRequestMessageProcessor(): RequestMessageProcessor {
  return new RequestMessageProcessor(JSONPXHR, [
    timeoutTransformer,
    callbackParameterNameTransformer
  ]);
}

/**
* Represents an HTTP request message.
*/
export class HttpRequestMessage extends RequestMessage {

  /**
  * A replacer function to use in transforming the content.
  */
  replacer: (key: string, value: any) => any;

  /**
  * Creates an instance of HttpRequestMessage.
  * @param method The http method.
  * @param url The url to submit the request to.
  * @param content The content of the request.
  * @param headers The headers to send along with the request.
  */
  constructor(method: string, url: string, content: any, headers?: Headers) {
    super(method, url, content, headers);
    this.responseType = 'json'; //text, arraybuffer, blob, document
  }
}

/**
* Creates a RequestMessageProcessor for handling HTTP request messages.
* @return A processor instance for HTTP request messages.
*/
export function createHttpRequestMessageProcessor(): RequestMessageProcessor {
  return new RequestMessageProcessor(PLATFORM.XMLHttpRequest, [
    timeoutTransformer,
    credentialsTransformer,
    progressTransformer,
    responseTypeTransformer,
    contentTransformer,
    headerTransformer
  ]);
}

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

/*eslint no-unused-vars:0*/
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
