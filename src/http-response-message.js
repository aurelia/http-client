import {Headers} from './headers';
import {RequestMessage} from './request-message';

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
