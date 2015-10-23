import {PLATFORM} from 'aurelia-pal';

/**
* Adds a timeout to the request.
* @param client The http client.
* @param processor The request message processor.
* @param message The request message.
* @param xhr The xhr instance.
*/
export function timeoutTransformer(client: HttpClient, processor: RequestMessageProcessor, message: RequestMessage, xhr: XHR) {
  if (message.timeout !== undefined) {
    xhr.timeout = message.timeout;
  }
}

/**
* Adds a callback parameter name to the request.
* @param client The http client.
* @param processor The request message processor.
* @param message The request message.
* @param xhr The xhr instance.
*/
export function callbackParameterNameTransformer(client: HttpClient, processor: RequestMessageProcessor, message: RequestMessage, xhr: XHR) {
  if (message.callbackParameterName !== undefined) {
    xhr.callbackParameterName = message.callbackParameterName;
  }
}

/**
* Sets withCredentials on the request.
* @param client The http client.
* @param processor The request message processor.
* @param message The request message.
* @param xhr The xhr instance.
*/
export function credentialsTransformer(client: HttpClient, processor: RequestMessageProcessor, message: RequestMessage, xhr: XHR) {
  if (message.withCredentials !== undefined) {
    xhr.withCredentials = message.withCredentials;
  }
}

/**
* Adds an onprogress callback to the request.
* @param client The http client.
* @param processor The request message processor.
* @param message The request message.
* @param xhr The xhr instance.
*/
export function progressTransformer(client: HttpClient, processor: RequestMessageProcessor, message: RequestMessage, xhr: XHR) {
  if (message.progressCallback) {
    xhr.upload.onprogress = message.progressCallback;
  }
}

/**
* Adds a response type transformer to the request.
* @param client The http client.
* @param processor The request message processor.
* @param message The request message.
* @param xhr The xhr instance.
*/
export function responseTypeTransformer(client: HttpClient, processor: RequestMessageProcessor, message: RequestMessage, xhr: XHR) {
  let responseType = message.responseType;

  if (responseType === 'json') {
    responseType = 'text'; //IE does not support json
  }

  xhr.responseType = responseType;
}

/**
* Adds headers to the request.
* @param client The http client.
* @param processor The request message processor.
* @param message The request message.
* @param xhr The xhr instance.
*/
export function headerTransformer(client: HttpClient, processor: RequestMessageProcessor, message: RequestMessage, xhr: XHR) {
  message.headers.configureXHR(xhr);
}

/**
* Transforms the content of the request.
* @param client The http client.
* @param processor The request message processor.
* @param message The request message.
* @param xhr The xhr instance.
*/
export function contentTransformer(client: HttpClient, processor: RequestMessageProcessor, message: RequestMessage, xhr: XHR) {
  if (message.skipContentProcessing) {
    return;
  }

  if (PLATFORM.global.FormData && message.content instanceof FormData) {
    return;
  }

  if (PLATFORM.global.Blob && message.content instanceof Blob) {
    return;
  }

  if (PLATFORM.global.ArrayBufferView && message.content instanceof ArrayBufferView) {
    return;
  }

  if (message.content instanceof Document) {
    return;
  }

  if (typeof message.content === 'string') {
    return;
  }

  if (message.content === null || message.content === undefined) {
    return;
  }

  message.content = JSON.stringify(message.content, message.replacer);

  if (!message.headers.has('Content-Type')) {
    message.headers.add('Content-Type', 'application/json');
  }
}
