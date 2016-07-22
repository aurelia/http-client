/*eslint no-unused-vars:0*/
import {PLATFORM} from 'aurelia-pal';
import {RequestMessage} from './request-message';
import {HttpResponseMessage} from './http-response-message';

function applyXhrTransformers(xhrTransformers, client, processor, message, xhr) {
  let i;
  let ii;

  for (i = 0, ii = xhrTransformers.length; i < ii; ++i) {
    xhrTransformers[i](client, processor, message, xhr);
  }
}

/**
 * Creates an XHR implementation.
 */
interface XHRConstructor {
	//new():XHR;
}

/**
 * Represents an XHR.
 */
interface XHR {
  /**
  * The status code of the response.
  */
  status: number;
  /**
  * The status text.
  */
  statusText: string;
  /**
  * The raw response.
  */
  response: any;
  /**
  * The raw response text.
  */
  responseText: string;
  /**
  * The load callback.
  */
  onload: Function;
  /**
  * The timeout callback.
  */
  ontimeout: Function;
  /**
  * The error callback.
  */
  onerror: Function;
  /**
  * The abort callback.
  */
  onabort: Function;
  /**
  * Aborts the request.
  */
  abort(): void;
  /**
  * Opens the XHR channel.
  */
  open(method: string, url: string, isAsync: boolean, user?: string, password?: string): void;
  /**
  * Sends the request.
  */
  send(content? : any): void;
}

/**
 * Represents an XHR transformer.
 */
interface XHRTransformer {
  (client: HttpClient, processor: RequestMessageProcessor, message: RequestMessage, xhr: XHR): void;
}

/**
 * Processes request messages.
 */
export class RequestMessageProcessor {
  /**
   * Creates an instance of RequestMessageProcessor.
   */
  constructor(xhrType: XHRConstructor, xhrTransformers: XHRTransformer[]) {
    this.XHRType = xhrType;
    this.xhrTransformers = xhrTransformers;
    this.isAborted = false;
  }

  /**
   * Aborts the request.
   */
  abort(): void {
    // The logic here is if the xhr object is not set then there is nothing to abort so the intent was carried out
    // Also test if the XHR is UNSENT - if not, it will be aborted in the process() phase
    if (this.xhr && this.xhr.readyState !== PLATFORM.XMLHttpRequest.UNSENT) {
      this.xhr.abort();
    }

    this.isAborted = true;
  }

  /**
   * Processes the request.
   * @param client The HttpClient making the request.
   * @param requestMessage The message to process.
   * @return A promise for an HttpResponseMessage.
   */
  process(client: HttpClient, requestMessage: RequestMessage): Promise<HttpResponseMessage> {
    let promise = new Promise((resolve, reject) => {
      let xhr = this.xhr = new this.XHRType();

      xhr.onload = (e) => {
        let response = new HttpResponseMessage(requestMessage, xhr, requestMessage.responseType, requestMessage.reviver);
        if (response.isSuccess) {
          resolve(response);
        } else {
          reject(response);
        }
      };

      xhr.ontimeout = (e) => {
        reject(new HttpResponseMessage(requestMessage, {
          response: e,
          status: xhr.status,
          statusText: xhr.statusText
        }, 'timeout'));
      };

      xhr.onerror = (e) => {
        reject(new HttpResponseMessage(requestMessage, {
          response: e,
          status: xhr.status,
          statusText: xhr.statusText
        }, 'error'));
      };

      xhr.onabort = (e) => {
        reject(new HttpResponseMessage(requestMessage, {
          response: e,
          status: xhr.status,
          statusText: xhr.statusText
        }, 'abort'));
      };
    });

    return Promise.resolve(requestMessage)
      .then(message => {
        let processRequest = () => {
          if (this.isAborted) {
            // Some interceptors can delay sending of XHR, so when abort is called
            // before XHR is actually sent we abort() instead send()
            this.xhr.abort();
          } else {
            this.xhr.open(message.method, message.buildFullUrl(), true, message.user, message.password);
            applyXhrTransformers(this.xhrTransformers, client, this, message, this.xhr);
            if (typeof message.content === 'undefined') {
              // IE serializes undefined as "undefined"
              // some servers reject such requests because of unexpected payload, e.g. in case of DELETE requests
              this.xhr.send();
            } else {
              this.xhr.send(message.content);
            }
          }

          return promise;
        };

        // [ onFullfilled, onReject ] pairs
        let chain = [[processRequest, undefined]];
        // Apply interceptors chain from the message.interceptors
        let interceptors = message.interceptors || [];
        interceptors.forEach(function(interceptor) {
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
