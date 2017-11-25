import {HttpResponseMessage} from './http-response-message';

/**
* Represents an error response message from an HTTP or JSONP request.
*/
export class ErrorHttpResponseMessage extends HttpResponseMessage{
    
    /**
     * Error like name
     */
    name : string;


    message : string;


    constructor(response: HttpResponseMessage ){
        this.name = response.responseType;
        this.message = response.content ; //TODO

    }

}