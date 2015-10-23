import {DOM, PLATFORM} from 'aurelia-pal';
import {RequestMessage} from './request-message';
import {RequestMessageProcessor} from './request-message-processor';
import {
  timeoutTransformer,
  callbackParameterNameTransformer
} from './xhr-transformers';

/**
* Represents an JSONP request message.
*/
export class JSONPRequestMessage extends RequestMessage {
  /**
  * Creates an instance of JSONPRequestMessage.
  * @param url The url to submit the request to.
  * @param callbackParameterName The name of the callback parameter that the api expects.
  */
  constructor(url: string, callbackParameterName: string) {
    super('JSONP', url);
    this.responseType = 'jsonp';
    this.callbackParameterName = callbackParameterName;
  }
}

class JSONPXHR {
  open(method: string, url: string): void {
    this.method = method;
    this.url = url;
    this.callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
  }

  send(): void {
    let url = this.url + (this.url.indexOf('?') >= 0 ? '&' : '?') + encodeURIComponent(this.callbackParameterName) + '=' + this.callbackName;
    let script = DOM.createElement('script');

    script.src = url;
    script.onerror = (e) => {
      cleanUp();

      this.status = 0;
      this.onerror(new Error('error'));
    };

    let cleanUp = () => {
      delete PLATFORM.global[this.callbackName];
      DOM.removeNode(script);
    };

    PLATFORM.global[this.callbackName] = (data) => {
      cleanUp();

      if (this.status === undefined) {
        this.status = 200;
        this.statusText = 'OK';
        this.response = data;
        this.onload(this);
      }
    };

    DOM.appendNode(script);

    if (this.timeout !== undefined) {
      setTimeout(() => {
        if (this.status === undefined) {
          this.status = 0;
          this.ontimeout(new Error('timeout'));
        }
      }, this.timeout);
    }
  }

  abort() : void {
    if (this.status === undefined) {
      this.status = 0;
      this.onabort(new Error('abort'));
    }
  }

  setRequestHeader() {}
}

/**
* Creates a RequestMessageProcessor for handling JSONP request messages.
* @return A processor instance for JSONP request messages.
*/
export function createJSONPRequestMessageProcessor(): RequestMessageProcessor {
  return new RequestMessageProcessor(JSONPXHR, [
    timeoutTransformer,
    callbackParameterNameTransformer
  ]);
}
