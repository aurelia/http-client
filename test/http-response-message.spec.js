import {HttpResponseMessage, mimeTypes} from '../src/http-response-message';
import {Headers} from '../src/headers';

function mockXhr(options) {
  var xhr = {
    getAllResponseHeaders() { },
    status: undefined
  };

  for (var key in options) {
    xhr[key] = options[key];
  }

  return xhr;
}

describe('http response message', () => {
  describe('constructor', () => {
    //This may seem superfluous but it's surprising how many bugs stem from constructors no longer working as expected
    it('sets requestMessage, response, statusCode, statusText, reviver and headers', () => {
      var xhr = {status: 200, response: {}, statusText: {}, getAllResponseHeaders: () => {}};
      var responseType = {}, reviver = {}, requestMessage = {};
      var httpResponse = new HttpResponseMessage(requestMessage, xhr, responseType, reviver);

      expect(httpResponse.requestMessage).toBe(requestMessage);
      expect(httpResponse.response).toBe(xhr.response);
      expect(httpResponse.statusCode).toBe(xhr.status);
      expect(httpResponse.statusText).toBe(xhr.statusText);
      expect(httpResponse.reviver).toBe(reviver);
      expect(httpResponse.headers).toEqual(jasmine.any(Headers));
    });

    it('parses headers', () => {
      var parseSpy = spyOn(Headers, 'parse').and.callThrough();
      new HttpResponseMessage({}, mockXhr());
      expect(parseSpy).toHaveBeenCalled();
    });

    it('sets responseType to an aliased version of the mimetype in the Content-Type header and the mimeType to the original mimetype', () => {
      runContentTypeExpectations([
        { contentType: 'text/yml',      mimeType: 'text/yml',      type: 'yml' },
        { contentType: 'text/xml',      mimeType: 'text/xml',      type: 'xml' },
        { contentType: 'text/markdown', mimeType: 'text/markdown', type: 'md'  }
      ]);
    });

    it('splits the Content-Type header using the ; delimeter and sets mimeType to the first part', () => {
      runContentTypeExpectations([
        { contentType:'text/html; charset=utf-8',          mimeType:'text/html',            type:'html' },
        { contentType:'application/atom+xml; type=feed',   mimeType:'application/atom+xml', type:'atom' },
        { contentType:'application/json;   odata=verbose', mimeType:'application/json',     type:'json' }
      ]);
    });

    describe('when there is no alias for the mimetype the mimeTypes map', () => {
      it('sets responseType to the mimetype', () => {
        runContentTypeExpectations([
          { contentType: 'text/foo',                mimeType: 'text/foo', type: 'text/foo' },
          { contentType: 'text/foo; charset=utf-8', mimeType: 'text/foo', type: 'text/foo' }
        ]);
      });
    });

    describe('when Content-Type header is not set', () => {
      it('sets responseType to the given responseType', () => {
        runContentTypeExpectations([
          { contentType: undefined, mimeType: null, type: 'json',      responseType:'json'      },
          { contentType: undefined, mimeType: null, type: 'html',      responseType:'html'      },
          { contentType: undefined, mimeType: null, type: 'text/html', responseType:'text/html' },
          { contentType: undefined, mimeType: null, type: 'something', responseType:'something' }
        ]);
      });
    });

    describe('when given responseType is empty', () => {
      it('sets responseType to json', () => {
        runContentTypeExpectations([
          { contentType: undefined, mimeType: null, type: 'json', responseType: '' }
        ]);
      });
    })

    it('sets isSuccess based on xhr status', () => {
      var xhr = mockXhr();

      //1xx informal
      xhr.status = 100;
      expect(new HttpResponseMessage({}, xhr).isSuccess).toBeFalsy();
      xhr.status = 199;
      expect(new HttpResponseMessage({}, xhr).isSuccess).toBeFalsy();

      //2xx success
      xhr.status = 200;
      expect(new HttpResponseMessage({}, xhr).isSuccess).toBeTruthy();
      xhr.status = 201;
      expect(new HttpResponseMessage({}, xhr).isSuccess).toBeTruthy();

      //3xx redirection
      xhr.status = 300;
      expect(new HttpResponseMessage({}, xhr).isSuccess).toBeTruthy();
      xhr.status = 399;
      expect(new HttpResponseMessage({}, xhr).isSuccess).toBeTruthy();

      //4xx client error
      xhr.status = 400;
      expect(new HttpResponseMessage({}, xhr).isSuccess).toBeFalsy();
      xhr.status = 404;
      expect(new HttpResponseMessage({}, xhr).isSuccess).toBeFalsy();
      
      //5xx server error
      xhr.status = 500;
      expect(new HttpResponseMessage({}, xhr).isSuccess).toBeFalsy();
      xhr.status = 501;
      expect(new HttpResponseMessage({}, xhr).isSuccess).toBeFalsy();
    });
  });
  
  describe('content', () => {
    it('will return _content if defined', () => {
      let httpResponse = new HttpResponseMessage(null, mockXhr());
      let _content = httpResponse._content = {};

      expect(httpResponse.content).toBe(_content);
    });

    it('will return undefined if response is undefined', () => {
      let httpResponse = new HttpResponseMessage(null, mockXhr());
      expect(httpResponse.content).toBeUndefined();
    });

    it('will return null if response is null', () => {
      let httpResponse = new HttpResponseMessage(null, mockXhr({response: null, responseText:null}));
      expect(httpResponse.content).toBeNull();
    });

    it('will JSON.parse if the response type is json', () => {
      let response = {}, reviver = {}, content = {};
      let parseSpy = spyOn(JSON, 'parse').and.returnValue(content);
      let httpResponse = new HttpResponseMessage(null, {response: response}, 'json', reviver);

      expect(httpResponse.content).toBe(content);
      expect(parseSpy).toHaveBeenCalledWith(response, reviver);
    });

    it('will call the reviver if the response type is not json and the reviver is defined', () => {
      let response = {};
      let reviverSpy = jasmine.createSpy('reviver').and.returnValue(response);
      let httpResponse = new HttpResponseMessage(null, {response: response}, 'notJson', reviverSpy);

      expect(httpResponse.content).toBe(response);
      expect(reviverSpy).toHaveBeenCalledWith(response);
    });

    it('will return the response if the reviver is not set and the response type is not json', () => {
      let response = {};
      let httpResponse = new HttpResponseMessage(null, {response: response}, 'notJson');

      expect(httpResponse.content).toBe(response);
    });

    it('will catch expections on content if the response was not successful', () => {
      let reviverSpy = jasmine.createSpy('reviver').and.throwError();
      let httpResponse = new HttpResponseMessage(null, {status : 404, response : {}}, 'notJson', reviverSpy);

      expect(httpResponse.content).toBeNull();
      expect(reviverSpy).toHaveBeenCalled();
    });

    it('will throw on content if the response was successful', () => {
      let reviverSpy = jasmine.createSpy('reviver').and.throwError();
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
 *  contentType:'text/html; charset=utf-8',
 *  mimeType:'text/html',
 *  type:'html',
 *  requestType:'json'
 * },
 *
 *
 * With these settings it will set the Content-Type header to 'text/html; charset=utf-8' in the mock response,
 * and expect it to be resolved to a `mimeType` of 'text/html' and aliased with the responseType 'html'
 *
 * The requestType property is optional and will be set as the `responseType` in the request message.
 */
function runContentTypeExpectations(expectations){
  expectations.map((expectation)=>{
    // use json as the default `responseType` in the request message
    expectation.requestType = expectation.requestType || 'json';

    // set a content-type in the response header
    var responseHeaders = expectation.contentType ? "Content-Type: " + expectation.contentType : "herpes";
    var xhr = mockXhr({
      getAllResponseHeaders: () => { return responseHeaders; }
    });

    var responseMessage = new HttpResponseMessage(null, xhr, expectation.requestType);

    if(mimeTypes[expectation.mimeType]) {
      expect(responseMessage.responseType).toBe(expectation.type);
    }

    // expect original mimetype to be stored in `mimeType`
    expect(responseMessage.mimeType).toBe(expectation.mimeType);
  });
}
