import core from 'core-js';
import {HttpResponseMessage} from './http-response-message';
import {join, buildQueryString} from 'aurelia-path';

function buildFullUrl(message){
  var url = join(message.baseUrl, message.url),
      qs;

  if(message.params){
    qs = buildQueryString(message.params);
    url = qs ? `${url}?${qs}` : url;
  }

  message.fullUrl = url;
}

export class RequestMessageProcessor {
  constructor(xhrType, transformers){
    this.XHRType = xhrType;
    this.transformers = transformers;
  }

  abort(){
    //The logic here is if the xhr object is not set then there is nothing to abort so the intent was carried out
    if(this.xhr){
      this.xhr.abort();
    }
  }

  process(client, message){
    return new Promise((resolve, reject) => {
      var xhr = this.xhr = new this.XHRType(),
          transformers = this.transformers,
          i, ii;

      buildFullUrl(message);
      xhr.open(message.method, message.fullUrl, true);

      for(i = 0, ii = transformers.length; i < ii; ++i){
        transformers[i](client, this, message, xhr);
      }

      xhr.onload = (e) => {
        var response = new HttpResponseMessage(message, xhr, message.responseType, message.reviver);
        if(response.isSuccess){
          resolve(response);
        }else{
          reject(response);
        }
      };

      xhr.ontimeout = (e) => {
        reject(new HttpResponseMessage(message, {
          response:e,
          status:xhr.status,
          statusText:xhr.statusText
        }, 'timeout'));
      };

      xhr.onerror = (e) => {
        reject(new HttpResponseMessage(message, {
          response:e,
          status:xhr.status,
          statusText:xhr.statusText
        }, 'error'));
      };

      xhr.onabort = (e) => {
        reject(new HttpResponseMessage(message, {
          response:e,
          status:xhr.status,
          statusText:xhr.statusText
        }, 'abort'));
      };

      xhr.send(message.content);
    });
  }
}
