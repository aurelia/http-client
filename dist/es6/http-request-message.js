import {join} from 'aurelia-path';
import {Headers} from './headers';
import {HttpResponseMessage} from './http-response-message';

export class HttpRequestMessage {
  constructor(method, uri, content, headers){
    this.method = method;
    this.uri = uri;
    this.content = content;
    this.headers = headers || new Headers();
    this.responseType = 'json'; //text, arraybuffer, blob, document
  }
}

function timeoutTransformer(client, processor, message, xhr){
  var timeout = message.timeout || client.timeout;
  if(timeout !== undefined){
    xhr.timeout = timeout;
  }
}

function credentialsTransformer(client, processor, message, xhr){
  var withCredentials = message.withCredentials || client.withCredentials;
  if(withCredentials !== undefined){
    xhr.withCredentials = withCredentials;
  }
}

function progressTransformer(client, processor, message, xhr){
  if(message.progressCallback){
    xhr.upload.onprogress = message.progressCallback;
  }
}

function responseTypeTransformer(client, processor, message, xhr){
  var responseType = message.responseType;

  if(responseType === 'json'){
    responseType = 'text'; //IE does not support json
  }

  xhr.responseType = responseType;
}

function headerTransformer(client, processor, message, xhr){
  message.headers.configureXHR(xhr);
}

export class HttpRequestMessageProcessor {
  constructor(){
    this.transformers = [
      timeoutTransformer,
      credentialsTransformer,
      progressTransformer,
      responseTypeTransformer,
      headerTransformer
    ];
  }

  abort(){
    this.xhr.abort();
  }

  process(client, message){
    return new Promise((resolve, reject) => {
      var xhr = this.xhr = new XMLHttpRequest(),
          uri = join(message.baseUrl || client.baseUrl, message.uri);

      this.transformers.forEach(x => x(client, this, message, xhr));
      xhr.open(message.method, uri, true);

      xhr.onload = (e) => {
        var response = new HttpResponseMessage(message, xhr, message.responseType, message.reviver || client.reviver);
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

      xhr.send(this.formatContent(message.content, message.replacer || client.replacer));
    });
  }

  formatContent(content, replacer){
    if(window.FormData && content instanceof FormData){
      return content;
    }

    if(window.Blob && content instanceof Blob){
      return content;
    }

    if(window.ArrayBufferView && content instanceof ArrayBufferView){
      return content;
    }

    if(content instanceof Document){
      return content;
    }

    if(typeof content === 'string'){
      return content;
    }

    return JSON.stringify(content, replacer);
  }
}
