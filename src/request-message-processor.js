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
    this.isAborted = false;
  }

  abort(){
    // The logic here is if the xhr object is not set then there is nothing to abort so the intent was carried out
    // Also test if the XHR is UNSENT - if not, it will be aborted in the process() phase
    if(this.xhr && this.xhr.readyState !== XMLHttpRequest.UNSENT){
      this.xhr.abort();
    }
    this.isAborted = true;
  }

  process(client, message) {
    var promise = new Promise((resolve, reject) => {
      var xhr = this.xhr = new this.XHRType(),
        transformers = this.transformers,
        i, ii;

      buildFullUrl(message);
      xhr.open(message.method, message.fullUrl, true);

      for (i = 0, ii = transformers.length; i < ii; ++i) {
        transformers[i](client, this, message, xhr);
      }

      xhr.onload = (e) => {
        var response = new HttpResponseMessage(message, xhr, message.responseType, message.reviver);
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
      };

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
    });

    return Promise.resolve(message)
      .then((message) => {
        var processRequest = () => {
          if (this.isAborted) {
            // Some interceptors can delay sending of XHR, so when abort is called
            // before XHR is actually sent we abort() instead send()
            this.xhr.abort();
          } else {
            this.xhr.send(message.content);
          }

          return promise;
        };

        // [ onFullfilled, onReject ] pairs
        var chain = [[processRequest, undefined]];
        // Apply interceptors chain from the message.interceptors
        var interceptors = message.interceptors || [];
        interceptors.forEach(function (interceptor) {
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

        var interceptorsPromise = Promise.resolve(message);

        while (chain.length) {
          interceptorsPromise = interceptorsPromise.then(...chain.shift());
        }

        return interceptorsPromise;
      });
  }
}
