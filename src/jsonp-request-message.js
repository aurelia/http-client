import {RequestMessage} from './request-message';
import {RequestMessageProcessor} from './request-message-processor';
import {
  timeoutTransformer,
  callbackParameterNameTransformer
} from './xhr-transformers';

export class JSONPRequestMessage extends RequestMessage {
  constructor(url : string, callbackParameterName : string) {
    super('JSONP', url);
    this.responseType = 'jsonp';
    this.callbackParameterName = callbackParameterName;
  }
}

class JSONPXHR {
  open(method : string, url : string) : void {
    this.method = method;
    this.url = url;
    this.callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
  }

  send() : void {
    let url = this.url + (this.url.indexOf('?') >= 0 ? '&' : '?') + encodeURIComponent(this.callbackParameterName) + '=' + this.callbackName;
    let script = document.createElement('script');

    script.src = url;
    script.onerror = (e) => {
      cleanUp();

      this.status = 0;
      this.onerror(new Error('error'))
    };

    let cleanUp = () => {
      delete window[this.callbackName];
      document.body.removeChild(script);
    };

    window[this.callbackName] = (data) => {
      cleanUp();

      if (this.status === undefined) {
        this.status = 200;
        this.statusText = 'OK';
        this.response = data;
        this.onload(this);
      }
    };

    document.body.appendChild(script);

    if (this.timeout !== undefined) {
      setTimeout(() => {
        if(this.status === undefined) {
          this.status = 0;
          this.ontimeout(new Error('timeout'));
        }
      }, this.timeout);
    }
  }

  abort() : void {
    if(this.status === undefined) {
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
