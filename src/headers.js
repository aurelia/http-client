/**
* Represents http request/response headers.
*/
export class Headers {
  /**
  * Creates an instance of the headers class.
  * @param headers A set of key/values to initialize the headers with.
  */
  constructor(headers?: Object = {}) {
    this.headers = headers;
  }

  /**
  * Adds a header.
  * @param key The header key.
  * @param value The header value.
  */
  add(key: string, value: string): void {
    this.headers[key] = value;
  }

  /**
  * Gets a header value.
  * @param key The header key.
  * @return The header value.
  */
  get(key: string): string {
    return this.headers[key];
  }

  /**
  * Clears the headers.
  */
  clear(): void {
    this.headers = {};
  }

  /**
  * Determines whether or not the indicated header exists in the collection.
  * @param key The header key to check.
  * @return True if it exists, false otherwise.
  */
  has(header: string): boolean {
    let lowered = header.toLowerCase();
    let headers = this.headers;

    for (let key in headers) {
      if (key.toLowerCase() === lowered) {
        return true;
      }
    }

    return false;
  }

  /**
  * Configures an XHR object with the headers.
  * @param xhr The XHR instance to configure.
  */
  configureXHR(xhr : XHR): void {
    let headers = this.headers;

    for (let key in headers) {
      xhr.setRequestHeader(key, headers[key]);
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
