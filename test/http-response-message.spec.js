import './setup';
import {HttpResponseMessage, mimeTypes} from '../src/http-response-message';
import {Headers} from '../src/headers';

describe("HttpResponseMessage", () => {
  describe("constructor", () => {
    it("should have a isSuccess defined by the xhr.status", () => {
      //1xx informal
      expect(new HttpResponseMessage({}, {status: 100}).isSuccess).toBeFalsy();
      expect(new HttpResponseMessage({}, {status: 199}).isSuccess).toBeFalsy();

      //2xx success
      expect(new HttpResponseMessage({}, {status: 200}).isSuccess).toBeTruthy();
      expect(new HttpResponseMessage({}, {status: 299}).isSuccess).toBeTruthy();

      //3xx redirection
      expect(new HttpResponseMessage({}, {status: 300}).isSuccess).toBeTruthy();
      expect(new HttpResponseMessage({}, {status: 399}).isSuccess).toBeTruthy();

      //4xx client error
      expect(new HttpResponseMessage({}, {status: 400}).isSuccess).toBeFalsy();
      expect(new HttpResponseMessage({}, {status: 499}).isSuccess).toBeFalsy();

      //5xx server error
      expect(new HttpResponseMessage({}, {status: 400}).isSuccess).toBeFalsy();
      expect(new HttpResponseMessage({}, {status: 499}).isSuccess).toBeFalsy();
    });

    //This may seem superfluous but it's surprising how many bugs stem from constructors no longer working as expected
    it("have the xhr.status, xhr.response, xhr.statusText, responseType, reviver and headers as fields", () => {
      //Everything that can be an object is set to one for reference checking
      let xhr = {status: 200, response: {}, statusText: {}};
      let responseType = {}, reviver = {}, requestMessage = {};
      let httpResponse = new HttpResponseMessage(requestMessage, xhr, responseType, reviver);

      expect(httpResponse.requestMessage).toBe(requestMessage);
      expect(httpResponse.statusCode).toBe(xhr.status);
      expect(httpResponse.response).toBe(xhr.response);
      expect(httpResponse.statusText).toBe(xhr.statusText);
      expect(httpResponse.responseType).toBe(responseType);
      expect(httpResponse.reviver).toBe(reviver);
      expect(httpResponse.headers).toEqual(jasmine.any(Headers));
    });

    it("will call the Headers.parse() if xhr.getAllResponseHeaders() is defined", () => {
      let parseSpy = spyOn(Headers, 'parse');
      let xhrMock = jasmine.createSpyObj("xhr", ["getAllResponseHeaders"]);
      xhrMock.getAllResponseHeaders.and.returnValue("");

      new HttpResponseMessage({}, xhrMock);
      expect(xhrMock.getAllResponseHeaders).toHaveBeenCalled();
      expect(parseSpy).toHaveBeenCalledWith("");
    });

    it("will set responseType to an aliased version of the mimetype detected in the Content-Type header, will also store the original mimetype as mimeType", () => {
      runContentTypeExpectations([
        {contentType:"text/yml",mimeType:"text/yml",type:"yml"},
        {contentType:"text/xml",mimeType:"text/xml",type:"xml"},
        {contentType:"text/markdown",mimeType:"text/markdown",type:"md"}
      ]);
    });

    it("will split the Content-Type using the ; delimeter and use the first part as the mimeType", () => {
      runContentTypeExpectations([
        {contentType:"text/html; charset=utf-8",mimeType:"text/html",type:"html"},
        {contentType:"application/atom+xml; type=feed",mimeType:"application/atom+xml",type:"atom"},
        {contentType:"application/json;   odata=verbose",mimeType:"application/json",type:"json"}
      ]);
    });

    it("will use the mimeType as the responseType if there is no alias for it in the mimeTypes map", () => {
      runContentTypeExpectations([
        {contentType:"text/foo",mimeType:"text/foo",type:"text/foo"},
        {contentType:"text/foo; charset=utf-8",mimeType:"text/foo",type:"text/foo"}
      ]);
    });

    it("will set responseType to the responseType specified in the request if no Content-Type header was found, mimeType will be null", () => {
      runContentTypeExpectations([
        {contentType:undefined,mimeType:null,type:"json",requestType:"json"},
        {contentType:undefined,mimeType:null,type:"html",requestType:"html"},
        {contentType:undefined,mimeType:null,type:"text/html",requestType:"text/html"},
        {contentType:undefined,mimeType:null,type:"something",requestType:"something"}
      ]);
    });

    it("will use json if no responseType for the request was null", () => {
      runContentTypeExpectations([
        {contentType:undefined,mimeType:null,type:null,requestType:"json"}
      ]);
    });
  });

  describe("content", () => {
    it("will return _content if defined", () => {
      let httpResponse = new HttpResponseMessage(null,{});
      let _content = httpResponse._content = {};

      expect(httpResponse.content).toBe(_content);
    });

    it("will return undefined if response is undefined", () => {
      let httpResponse = new HttpResponseMessage(null, {});
      expect(httpResponse.content).toBeUndefined();
    });

    it("will return null if response is null", () => {
      let httpResponse = new HttpResponseMessage(null, {response: null,responseText:null});
      expect(httpResponse.content).toBeNull();
    });

    it("will JSON.parse if the response type is 'json'", () => {
      let response = {}, reviver = {}, content = {};
      let parseSpy = spyOn(JSON, 'parse').and.returnValue(content);
      let httpResponse = new HttpResponseMessage(null, {response: response}, 'json', reviver);

      expect(httpResponse.content).toBe(content);
      expect(parseSpy).toHaveBeenCalledWith(response, reviver);
    });

    it("will call the reviver if the response type is not 'json' and the reviver is defined", () => {
      let response = {};
      let reviverSpy = jasmine.createSpy("reviver").and.returnValue(response);
      let httpResponse = new HttpResponseMessage(null, {response: response}, 'notJson', reviverSpy);

      expect(httpResponse.content).toBe(response);
      expect(reviverSpy).toHaveBeenCalledWith(response);
    });

    it("will return the response if the reviver is not set and the response type is not json", () => {
      let response = {};
      let httpResponse = new HttpResponseMessage(null, {response: response}, 'notJson');

      expect(httpResponse.content).toBe(response);
    });

    it("will catch expections on content if the response was not successful", () => {
      let reviverSpy = jasmine.createSpy("reviver").and.throwError();
      let httpResponse = new HttpResponseMessage(null, {status : 404, response : {}}, 'notJson', reviverSpy);

      expect(httpResponse.content).toBeNull();
      expect(reviverSpy).toHaveBeenCalled();
    });

    it("will throw on content if the response was successful", () => {
      let reviverSpy = jasmine.createSpy("reviver").and.throwError();
      let httpResponse = new HttpResponseMessage(null, {status : 200, response : {}}, 'notJson', reviverSpy);

      expect(() => httpResponse.content).toThrow();
      expect(reviverSpy).toHaveBeenCalled();
    });
  });
});

/**
 * Run an array of expectations for testing content-type headers and responseTypes
 *
 * Sets up a request to have a response with a certain Content-Type and checks if the
 * response has the correct `responseType` set.
 * Will check if the `responseType` has been aliased according to the `mimeTypes` map.
 * Will check if the response has the original mimetype stored in the `mimeType` property.
 *
 * an expectation object should be the following format:
 * {
 *  contentType:"text/html; charset=utf-8",
 *  mimeType:"text/html",
 *  type:"html",
 *  requestType:"json"
 * },
 *
 *
 * With these settings it will set the Content-Type header to "text/html; charset=utf-8" in the mock response,
 * and expect it to be resolved to a `mimeType` of "text/html" and aliased with the responseType "html"
 *
 * The requestType property is optional and will be set as the `responseType` in the request message.
 */
function runContentTypeExpectations(expectations){
  let reviver = {};
  expectations.map((expectation)=>{
    var headers = new Headers();
    //use json as the default `responseType` in the request message
    expectation.requestType = expectation.requestType||"json";
    //set a content-type in the response header
    if(expectation.contentType) headers.add('Content-Type', expectation.contentType);

    jasmine.Ajax.withMock(() => {
      var xhr = new XMLHttpRequest();
      headers.configureXHR(xhr);
      //check if content-type was correctly set in the xhr headers
      expect(xhr.requestHeaders['Content-Type']).toBe(expectation.contentType);

      let httpResponse = new HttpResponseMessage(null, xhr, expectation.requestType, reviver);

      //expect mimetype to be converted to it's alias if it is defined in the `mimeTypes` list
      if(mimeTypes[expectation.mimeType]) expect(httpResponse.responseType).toBe(expectation.type);
      //expect original mimetype to be stored in `mimeType`
      expect(httpResponse.mimeType).toBe(expectation.mimeType);
    });
  });
}
