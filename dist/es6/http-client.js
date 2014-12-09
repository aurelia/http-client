import {normalize} from 'aurelia-path';
import {HttpRequestMessage} from './http-request-message';
import {HttpResponseMessage} from './http-response-message';
import {JSONPRequestMessage} from './json-request-message';
import {Headers} from './headers';

export class HttpClient {
  constructor(){
    this.baseAddress = '';
    this.defaultRequestHeaders = new Headers();
  }

  send(requestMessage, progressCallback){
    return requestMessage.send(this, progressCallback);
  }

  get(uri){
    return this.send(
      new HttpRequestMessage('GET',  normalize(uri, this.baseAddress))
        .withHeaders(this.defaultRequestHeaders)
      );
  }

  put(uri, content, replacer){
    return this.send(
      new HttpRequestMessage('PUT', normalize(uri, this.baseAddress), content, replacer || this.replacer)
        .withHeaders(this.defaultRequestHeaders)
      );
  }

  post(uri, content, replacer){
    return this.send(
      new HttpRequestMessage('POST', normalize(uri, this.baseAddress), content, replacer || this.replacer)
        .withHeaders(this.defaultRequestHeaders)
      );
  }

  delete(uri){
    return this.send(
      new HttpRequestMessage('DELETE', normalize(uri, this.baseAddress))
        .withHeaders(this.defaultRequestHeaders)
      );
  }

  jsonp(uri, callbackParameterName='jsoncallback'){
    return this.send(
      new JSONPRequestMessage(normalize(uri, this.baseAddress), callbackParameterName)
      );
  }
}