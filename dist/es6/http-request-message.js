import {Headers} from './headers';
import {RequestMessageProcessor} from './request-message-processor';
import {
  timeoutTransformer,
  credentialsTransformer,
  progressTransformer,
  responseTypeTransformer,
  headerTransformer,
  contentTransformer
} from './transformers';

export class HttpRequestMessage {
  constructor(method, url, content, headers){
    this.method = method;
    this.url = url;
    this.content = content;
    this.headers = headers || new Headers();
    this.responseType = 'json'; //text, arraybuffer, blob, document
  }
}

export function createHttpRequestMessageProcessor(){
  return new RequestMessageProcessor(XMLHttpRequest, [
    timeoutTransformer,
    credentialsTransformer,
    progressTransformer,
    responseTypeTransformer,
    contentTransformer,
    headerTransformer
  ]);
}
