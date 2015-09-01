import * as core from 'core-js';
import {RequestMessage} from './request-message';
import {HttpResponseMessage} from './http-response-message';
import {join, buildQueryString} from 'aurelia-path';

function applyXhrTransformers(xhrTransformers, client, processor, message, xhr) {
  for (let i = 0, ii = xhrTransformers.length; i < ii; ++i) {
    xhrTransformers[i](client, processor, message, xhr);
  }
}

interface XHRConstructor {
	//new():XHR;
}

interface XHR {
  status : number;
  statusText : string;
  response : any;
  responseText : string;
  onload : Function;
  ontimeout : Function;
  onerror : Function;
  onabort : Function;
  abort() : void;
  //open(method : string, url : string, isAsync : boolean) : void;
  send(content? : any) : void;
}

interface XHRTransformer {
  (client : HttpClient, processor : RequestMessageProcessor, message : RequestMessage, xhr : XHR) : void;
}

export class RequestMessageProcessor {
  constructor(xhrType : XHRConstructor, xhrTransformers : XHRTransformer[]) {
    this.XHRType = xhrType;
    this.xhrTransformers = xhrTransformers;
    this.isAborted = false;
  }

  abort() : void {
    // The logic here is if the xhr object is not set then there is nothing to abort so the intent was carried out
    // Also test if the XHR is UNSENT - if not, it will be aborted in the process() phase
    if (this.xhr && this.xhr.readyState !== XMLHttpRequest.UNSENT) {
      this.xhr.abort();
    }
    this.isAborted = true;
  }

  process(client, message : RequestMessage) : Promise<any> {
    let promise = new Promise((resolve, reject) => {
      let xhr = this.xhr = new this.XHRType();

      xhr.onload = (e) => {
        let response = new HttpResponseMessage(message, xhr, message.responseType, message.reviver);
        if (response.isSuccess) {
          resolve(response);
        } else {
          reject(response);
        }
      };

      xhr.ontimeout = (e) => {
        reject(new HttpResponseMessage(message, {
          response: e,
          status: xhr.status,
          statusText: xhr.statusText
        }, 'timeout'));

      xhr.onerror = (e) => {
        reject(new HttpResponseMessage(message, {
          response: e,
          status: xhr.status,
          statusText: xhr.statusText
        }, 'error'));
      };

      xhr.onabort = (e) => {
        reject(new HttpResponseMessage(message, {
          response: e,
          status: xhr.status,
          statusText: xhr.statusText
        }, 'abort'));
      };
      };
    });

    return Promise.resolve(message)
      .then((message) => {
        let processRequest = () => {
          if (this.isAborted) {
            // Some interceptors can delay sending of XHR, so when abort is called
            // before XHR is actually sent we abort() instead send()
            this.xhr.abort();
          } else {
            this.xhr.open(message.method, message.buildFullUrl(), true);
            applyXhrTransformers(this.xhrTransformers, client, this, message, this.xhr);
            this.xhr.send(message.content);
          }

          return promise;
        };

        // [ onFullfilled, onReject ] pairs
        let chain = [[processRequest, undefined]];
        // Apply interceptors chain from the message.interceptors
        let interceptors = message.interceptors || [];
        interceptors.forEach((interceptor) => {
          if (interceptor.request || interceptor.requestError) {
            chain.unshift([
              interceptor.request ? interceptor.request.bind(interceptor) : undefined,
              interceptor.requestError ? interceptor.requestError.bind(interceptor) : undefined
            ]);
          }

          if (interceptor.response || interceptor.responseError) {
            chain.push([
              interceptor.response ? interceptor.response.bind(interceptor) : undefined,
              interceptor.responseError ? interceptor.responseError.bind(interceptor) : undefined
            ]);
          }
        });

        let interceptorsPromise = Promise.resolve(message);

        while (chain.length) {
          interceptorsPromise = interceptorsPromise.then(...chain.shift());
        }

        return interceptorsPromise;
      });
  }
}
