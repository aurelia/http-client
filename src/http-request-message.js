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

/**
* Represents an HTTP request message.
*/
export class HttpRequestMessage extends RequestMessage {

  /**
  * A replacer function to use in transforming the content.
  */
  replacer: (key: string, value: any) => any;

  /**
  * Creates an instance of HttpRequestMessage.
  * @param method The http method.
  * @param url The url to submit the request to.
  * @param content The content of the request.
  * @param headers The headers to send along with the request.
  */
  constructor(method: string, url: string, content: any, headers?: Headers) {
    super(method, url, content, headers);
    this.responseType = 'json'; //text, arraybuffer, blob, document
  }
}

/**
* Creates a RequestMessageProcessor for handling HTTP request messages.
* @return A processor instance for HTTP request messages.
*/
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
