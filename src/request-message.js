import {join, buildQueryString} from 'aurelia-path';
import {Headers} from './headers';

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
