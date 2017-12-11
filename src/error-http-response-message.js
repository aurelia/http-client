import {HttpResponseMessage} from './http-response-message';

/**
* Represents an error like object response message from an HTTP or JSONP request.
*/
export class ErrorHttpResponseMessage extends HttpResponseMessage {

  /**
  * Error like name
  */
  name: string;

  /**
  * Error like message
  */
  message: string;

  /**
   * Instanciate a new error response message
   * ErrorHttpResponseMessage instanceof Error is false but with two members 'name' and 'message' we have an error like object
   * @param responseMessage response message
   */
  constructor(responseMessage: HttpResponseMessage) {
    super(responseMessage.requestMessage, {
      response: responseMessage.response,
      status: responseMessage.statusCode,
      statusText: responseMessage.statusText
    }, responseMessage.responseType);
    //error like properties : name and message
    this.name = responseMessage.responseType;
    this.message = `Error: ${responseMessage.statusCode} Status: ${responseMessage.statusText}`;
  }

}
