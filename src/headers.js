export class Headers {
  constructor(headers?:Object={}){
    this.headers = headers;
  }

  add(key : string, value : string) : void {
    this.headers[key] = value;
  }

  get(key : string) : string {
    return this.headers[key];
  }

  clear() : void {
    this.headers = {};
  }

  configureXHR(xhr) : void {
    var headers = this.headers, key;

    for(key in headers){
      xhr.setRequestHeader(key, headers[key]);
    }
  }

  /**
   * XmlHttpRequest's getAllResponseHeaders() method returns a string of response
   * headers according to the format described here:
   * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
   * This method parses that string into a user-friendly key/value pair object.
   */
  static parse(headerStr : string) : Headers {
    var headers = new Headers();
    if (!headerStr) {
      return headers;
    }

    var headerPairs = headerStr.split('\u000d\u000a');
    for (var i = 0; i < headerPairs.length; i++) {
      var headerPair = headerPairs[i];
      // Can't use split() here because it does the wrong thing
      // if the header value has the string ": " in it.
      var index = headerPair.indexOf('\u003a\u0020');
      if (index > 0) {
        var key = headerPair.substring(0, index);
        var val = headerPair.substring(index + 2);
        headers.add(key,val);
      }
    }

    return headers;
  }
}
