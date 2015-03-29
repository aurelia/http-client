import {Headers} from './headers';

export class HttpResponseMessage {
  constructor(requestMessage, xhr, responseType, reviver){
    this.requestMessage = requestMessage;
    this.statusCode = xhr.status;
    this.response = xhr.response;
    this.isSuccess = xhr.status >= 200 && xhr.status < 400;
    this.statusText = xhr.statusText;
    this.reviver = reviver;
    this.mimeType = null;

    if(xhr.getAllResponseHeaders){
      try{
        this.headers = Headers.parse(xhr.getAllResponseHeaders());
      }catch(err){
        //if this fails it means the xhr was a mock object so the `requestHeaders` property should be used
        if(xhr.requestHeaders) this.headers = { headers:xhr.requestHeaders };
      }
    }else {
      this.headers = new Headers();
    }

    var contentType;
    if(this.headers && this.headers.headers) contentType = this.headers.headers["Content-Type"];
    if(contentType) {
      this.mimeType = responseType = contentType.split(";")[0];
      if(mimeTypes.hasOwnProperty(this.mimeType)) responseType = mimeTypes[this.mimeType];
    }
    this.responseType = responseType;
  }

  get content(){
    try{
      if(this._content !== undefined){
        return this._content;
      }

      if(this.response === undefined || this.response === null){
        return this._content = this.response; // jshint ignore:line
      }

      if(this.responseType === 'json'){
        return this._content = JSON.parse(this.response, this.reviver); // jshint ignore:line
      }

      if(this.reviver){
        return this._content = this.reviver(this.response); // jshint ignore:line
      }

      return this._content = this.response; // jshint ignore:line
    }catch(e){
      if(this.isSuccess){
        throw e;
      }

      return this._content = null; // jshint ignore:line
    }
  }
}

/**
 * MimeTypes mapped to responseTypes
 *
 * @type {Object}
 */
export var mimeTypes = {
  "text/html": "html",
  "text/javascript": "js",
  "application/javascript": "js",
  "text/json": "json",
  "application/json": "json",
  "application/rss+xml": "rss",
  "application/atom+xml": "atom",
  "application/xhtml+xml": "xhtml",
  "text/markdown": "md",
  "text/xml": "xml",
  "text/mathml": "mml",
  "application/xml": "xml",
  "text/yml": "yml",
  "text/csv": "csv",
  "text/css": "css",
  "text/less": "less",
  "text/stylus": "styl",
  "text/scss": "scss",
  "text/sass": "sass",
  "text/plain": "txt"
};
