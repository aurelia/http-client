import {Headers} from './headers';
import {HttpResponseMessage} from './http-response-message';
import {
  uriTransformer,
  timeoutTransformer,
  credentialsTransformer,
  progressTransformer,
  responseTypeTransformer,
  headerTransformer,
  contentTransformer
} from './transformers';

export class HttpRequestMessage {
  constructor(method, uri, content, headers){
    this.method = method;
    this.uri = uri;
    this.content = content;
    this.headers = headers || new Headers();
    this.responseType = 'json'; //text, arraybuffer, blob, document
  }
}

export class HttpRequestMessageProcessor {
  constructor(){
    this.transformers = [
      uriTransformer,
      timeoutTransformer,
      credentialsTransformer,
      progressTransformer,
      responseTypeTransformer,
      headerTransformer,
      contentTransformer
    ];
  }

  abort(){
    this.xhr.abort();
  }

  process(client, message){
    return new Promise((resolve, reject) => {
      var xhr = this.xhr = new XMLHttpRequest();

      this.transformers.forEach(x => x(client, this, message, xhr));
      xhr.open(message.method, message.fullUri || message.uri, true);

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
