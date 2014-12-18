import {join} from 'aurelia-path';
import {HttpRequestMessage} from './http-request-message';
import {HttpResponseMessage} from './http-response-message';
import {JSONPRequestMessage} from './json-request-message';
import {Headers} from './headers';

export class HttpClient {
  constructor(){
    this.baseUrl = null;
    this.defaultRequestHeaders = new Headers();
  }

  send(requestMessage, progressCallback){
    return requestMessage.send(this, progressCallback);
  }

  get(uri){
    uri = this.baseUrl ? join(this.baseUrl, uri) : uri;
    return this.send(new HttpRequestMessage('GET', uri).withHeaders(this.defaultRequestHeaders));
  }

  put(uri, content, replacer){
    uri = this.baseUrl ? join(this.baseUrl, uri) : uri;
    return this.send(new HttpRequestMessage('PUT', uri, content, replacer || this.replacer).withHeaders(this.defaultRequestHeaders));
  }

  post(uri, content, replacer){
    uri = this.baseUrl ? join(this.baseUrl, uri) : uri;
    return this.send(new HttpRequestMessage('POST', uri, content, replacer || this.replacer).withHeaders(this.defaultRequestHeaders));
  }

  delete(uri){
    uri = this.baseUrl ? join(this.baseUrl, uri) : uri;
    return this.send(new HttpRequestMessage('DELETE', uri).withHeaders(this.defaultRequestHeaders));
  }

  jsonp(uri, callbackParameterName='jsoncallback'){
    uri = this.baseUrl ? join(this.baseUrl, uri) : uri;
    return this.send(new JSONPRequestMessage(uri, callbackParameterName));
  }
}