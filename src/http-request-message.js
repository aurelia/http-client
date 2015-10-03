import {PLATFORM} from 'aurelia-pal';
import {RequestMessage} from './request-message';
import {RequestMessageProcessor} from './request-message-processor';
import {
  timeoutTransformer,
  credentialsTransformer,
  progressTransformer,
  responseTypeTransformer,
  headerTransformer,
  contentTransformer
} from './xhr-transformers';

export class HttpRequestMessage extends RequestMessage {
  constructor(method: string, url: string, content: any, headers?: Headers) {
    super(method, url, content, headers);
    this.responseType = 'json'; //text, arraybuffer, blob, document
  }
}

export function createHttpRequestMessageProcessor(): RequestMessageProcessor {
  return new RequestMessageProcessor(PLATFORM.XMLHttpRequest, [
    timeoutTransformer,
    credentialsTransformer,
    progressTransformer,
    responseTypeTransformer,
    contentTransformer,
    headerTransformer
  ]);
}
