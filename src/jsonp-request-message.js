import {Headers} from './headers';
import {RequestMessageProcessor} from './request-message-processor';
import {
  timeoutTransformer,
  callbackParameterNameTransformer
} from './transformers';

export class JSONPRequestMessage {
  constructor(url, callbackParameterName){
    this.method = 'JSONP';
    this.url = url;
    this.content = undefined;
    this.headers = new Headers();
    this.responseType = 'jsonp';
    this.callbackParameterName = callbackParameterName;
  }
}

class JSONPXHR {
  open(method, url){
    this.method = method;
    this.url = url;
    this.callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
  }

  send(){
    var url = this.url + (this.url.indexOf('?') >= 0 ? '&' : '?') + this.callbackParameterName + '=' + this.callbackName;

    window[this.callbackName] = (data) => {
      delete window[this.callbackName];
      document.body.removeChild(script);

      if(this.status === undefined){
        this.status = 200;
        this.statusText = 'OK';
        this.response = data;
        this.onload(this);
      }
    };

    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);

    if(this.timeout !== undefined){
      setTimeout(() => {
        if(this.status === undefined){
          this.status = 0;
          this.ontimeout(new Error('timeout'));
        }
      }, this.timeout);
    }
  }

  abort(){
    if(this.status === undefined){
      this.status = 0;
      this.onabort(new Error('abort'));
    }
  }

  setRequestHeader(){}
}

export function createJSONPRequestMessageProcessor(){
  return new RequestMessageProcessor(JSONPXHR, [
    timeoutTransformer,
    callbackParameterNameTransformer
  ]);
}
