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
    var xhr;
    beforeEach(() => {
      xhr = mockXhr({
        status: 200,
      });
    });

    it('return the xhr\'s response', () => {
      xhr.response = {};
      var responseMessage = new HttpResponseMessage(null, xhr);
      expect(responseMessage.content).toBe(xhr.response);
    });

    it('returns undefined when response is undefined', () => {
      xhr.response = undefined;
      xhr.responseText = undefined;
      var responseMessage = new HttpResponseMessage(null, xhr);
      expect(responseMessage.content).toBeUndefined();
    });

    it('returns null when response is null', () => {
      xhr.response = null;
      xhr.responseText = null;
      var responseMessage = new HttpResponseMessage(null, xhr);
      expect(responseMessage.content).toBeNull();
    });

    describe('when the response type is json', () => {
      it('calls JSON.parse with response and reviver', () => {
        xhr.response = {};
        var reviver = {}, content = {};
        var parseSpy = spyOn(JSON, 'parse').and.returnValue(content);
        var responseMessage = new HttpResponseMessage(null, xhr, 'json', reviver);

        expect(responseMessage.content).toBe(content);
        expect(parseSpy).toHaveBeenCalledWith(xhr.response, reviver);
      });
    });

    describe('when the response type is not json', () => {
      describe('and reviver is set', () => {
        it('calls reviver and returns what it returns', () => {
          xhr.response = {};
          var reviverSpy = jasmine.createSpy('reviver').and.returnValue(xhr.response);
          var responseMessage = new HttpResponseMessage(null, xhr, 'notJson', reviverSpy);

          expect(responseMessage.content).toBe(xhr.response);
          expect(reviverSpy).toHaveBeenCalledWith(xhr.response);
        });
      });

      describe('and reviver is not set', () => {
        it('returns xhrs\'s response', () => {
          xhr.response = {};
          var responseMessage = new HttpResponseMessage(null, xhr, 'notJson');

          expect(responseMessage.content).toBe(xhr.response);
        });
      });
    });

    describe('when an expection is caught', () => {    
      it('is handled if the response is unsuccessful', () => {
        xhr.status = 404;
        xhr.response = {};
        var reviverSpy = jasmine.createSpy('reviver').and.throwError();
        var responseMessage = new HttpResponseMessage(null, xhr, 'notJson', reviverSpy);

        expect(responseMessage.content).toBeNull();
        expect(reviverSpy).toHaveBeenCalled();
      });

      it('is re-thrown if the response is successful', () => {
        xhr.response = {};
        var reviverSpy = jasmine.createSpy('reviver').and.throwError();
        var responseMessage = new HttpResponseMessage(null, xhr, 'notJson', reviverSpy);

        expect(() => responseMessage.content).toThrow();
        expect(reviverSpy).toHaveBeenCalled();
      });
    })
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
    expectation.requestType = expectation.responseType || 'json';

    // set a content-type in the response header
    var responseHeaders = expectation.contentType ? "Content-Type: " + expectation.contentType : "herpes";
    var xhr = mockXhr({
      getAllResponseHeaders: () => { return responseHeaders; }
    });

    var responseMessage = new HttpResponseMessage(null, xhr, expectation.responseType);

    if(mimeTypes[expectation.mimeType]) {
      expect(responseMessage.responseType).toBe(expectation.type);
    }

    // expect original mimetype to be stored in `mimeType`
    expect(responseMessage.mimeType).toBe(expectation.mimeType);
  });
}
