/*jshint -W093 */
import {Headers} from './headers';
import {RequestMessage} from './request-message';

export class HttpResponseMessage {
  constructor(requestMessage : RequestMessage, xhr : XHR, responseType : string, reviver : Function){
    this.requestMessage = requestMessage;
    this.response = xhr.response || xhr.responseText;
    this.statusCode = xhr.status;
    this.statusText = xhr.statusText;
    this.reviver = reviver;
    
    this.isSuccess = this.statusCode >= 200 && this.statusCode < 400;

    if(xhr.getAllResponseHeaders) {
      this.headers = Headers.parse(xhr.getAllResponseHeaders());
    } else {
      // this is a hack designed to make mocking xhr objects easier
      // it should be removed as soon as possible
      this.headers = new Headers();
    }

    var contentType = this.headers.get("Content-Type");
    if(contentType) {
      this.mimeType = contentType.split(";")[0].trim();
      this.responseType = mimeTypes.hasOwnProperty(this.mimeType) ? mimeTypes[this.mimeType] : this.mimeType;
    } else {
      this.mimeType = null;
      this.responseType = responseType;
    }
  }

  get content() : any {
    try{
      if(this._content !== undefined){
        return this._content;
      }

      if(this.response === undefined || this.response === null){
        return this._content = this.response;
      }

      if(this.responseType === 'json'){
        return this._content = JSON.parse(this.response, this.reviver);
      }

      if(this.reviver){
        return this._content = this.reviver(this.response);
      }

      return this._content = this.response;
    }catch(e){
      if(this.isSuccess){
        throw e;
      } else {
        return this._content = null;
      }
    }
  }
}

/**
 * MimeTypes mapped to responseTypes
 *
 * @type {Object}
 */
export let mimeTypes = {
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
