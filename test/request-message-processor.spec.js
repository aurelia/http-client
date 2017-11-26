import './setup';
import {RequestMessageProcessor} from '../src/request-message-processor';
import {HttpResponseMessage} from '../src/http-response-message';
import {RequestMessage} from '../src/request-message';
import {PLATFORM} from 'aurelia-pal';

describe("Request message processor", () => {
  it("constructor() correctly setup the xhrType and the xhrTransformers", () => {
    var xhrType = {};
    var xhrTransformers = {};
    var processor = new RequestMessageProcessor(xhrType, xhrTransformers);

    expect(processor.XHRType).toBe(xhrType);
    expect(processor.xhrTransformers).toBe(xhrTransformers);
  });

  it("abort() tell the request to abort", () => {
    var processor = new RequestMessageProcessor();
    let xhr = processor.xhr = jasmine.createSpyObj('xhr', ['abort']);
    processor.abort();
    expect(xhr.abort).toHaveBeenCalled();
  });

  it("abort() won't throw if the request hasn't started yet", () => {
    var processor = new RequestMessageProcessor();
    expect(() => processor.abort()).not.toThrow();
  });

  describe("process()", () => {
    let openSpy, sendSpy, xhrTransformers, reqProcessor, message, client;

    class MockXhrType {
      constructor() {
        this.open = openSpy = jasmine.createSpy("open");
        this.send = sendSpy = jasmine.createSpy("send");
      }

      fakeResponse(status = 200, statusText, response) {
        this.status = status;
        this.statusText = statusText;
        this.response = response;
        this.onload();
      }
    }


    beforeEach(() => {
      xhrTransformers = [];
      reqProcessor = new RequestMessageProcessor(MockXhrType, xhrTransformers);
      message = new RequestMessage('get', 'some', {});
      message.responseType = "test";
      client = {};
    });

    it("should create a new instance of the XHRType", () => {
      reqProcessor.process(client, message);
      expect(reqProcessor.xhr).toEqual(jasmine.any(MockXhrType));
    });

    // promise only resolves
    it("should call xhr.open with the method, full url and ajax set to true", (done) => {
      reqProcessor.process(client, message).then(() => {
        expect(openSpy).toHaveBeenCalledWith(message.method, message.url, true, undefined, undefined);
        done();
      });
      reqProcessor.xhr.fakeResponse();
    });

    it("should call xhr.send with the message content", (done) => {
      reqProcessor.process(client, message).then(() => {
        expect(sendSpy).toHaveBeenCalledWith(message.content);
        done();
      });
      reqProcessor.xhr.fakeResponse();
    });

    it("should run through all the xhr transformers", (done) => {
      let transformSpy = jasmine.createSpy("transformSpy");
      reqProcessor.xhrTransformers.push(transformSpy);
      reqProcessor.xhrTransformers.push(transformSpy);
      reqProcessor.process(client, message).then(() => {
        expect(transformSpy).toHaveBeenCalledWith(client, reqProcessor, message,  reqProcessor.xhr);
        expect(transformSpy.calls.count()).toBe(2);
        done();
      });
      reqProcessor.xhr.fakeResponse();
    });

    //The next couple of functions are breaking the idea of a unit test and treading
    //into integration tests but spying on the constructor of HttpResponseMessage isn't possible
    it("will resolve if the onload response is successful", (done) => {
      let responseObj = {};

      reqProcessor.process(client, message)
        .then((response) => {
          expect(response).toEqual(jasmine.any(HttpResponseMessage));
          expect(response.requestMessage).toBe(message);
          expect(response.statusCode).toBe(200);
          expect(response.response).toBe(responseObj);
          expect(response.responseType).toBe("test");
          expect(response.statusText).toBe("status test");
          expect(response.reviver).toBe(message.reviver);
        })
        .catch(() => expect(false).toBeTruthy("Should have failed"))
        .then(done);

      reqProcessor.xhr.fakeResponse(200, "status test", responseObj)
    });

    it("will reject if the onload response has failed", (done) => {
      let responseObj = {};

      reqProcessor.process(client, message)
        .then((response) => expect(false).toBeTruthy("This should have failed"))
        .catch((response) => {
          expect(response).toEqual(jasmine.any(HttpResponseMessage));
          expect(response.requestMessage).toBe(message);
          expect(response.statusCode).toBe(401);
          expect(response.response).toBe(responseObj);
          expect(response.responseType).toBe("test");
          expect(response.statusText).toBe("status test");
          expect(response.reviver).toBe(message.reviver);
        })
        .then(done);

      reqProcessor.xhr.fakeResponse(401, "status test", responseObj);
    });

    it("will reject if the ontimeout was called", (done) => {
      let errorResponse = {};
      reqProcessor.process(client, message)
        .then((response) => expect(false).toBeTruthy("This should have failed"))
        .catch((response) => {
          expect(response).toEqual(jasmine.any(HttpResponseMessage));
          expect(response.requestMessage).toBe(message);
          expect(response.response).toBe(errorResponse);
          expect(response.responseType).toBe("timeout");
        })
        .then(done);

      let xhr = reqProcessor.xhr;
      xhr.ontimeout(errorResponse);
    });

    it("will reject if the onerror was called", (done) => {
      let errorResponse = {};
      reqProcessor.process(client, message)
        .then((response) => expect(false).toBeTruthy("This should have failed"))
        .catch((response) => {
          expect(response).toEqual(jasmine.any(HttpResponseMessage));
          expect(response.requestMessage).toBe(message);
          expect(response.response).toBe(errorResponse);
          expect(response.responseType).toBe("error");
        })
        .then(done);

      let xhr = reqProcessor.xhr;
      xhr.onerror(errorResponse);
    });

    it("will reject if the onabort was called", (done) => {
      let errorResponse = {};
      reqProcessor.process(client, message)
        .then((response) => expect(false).toBeTruthy("This should have failed"))
        .catch((response) => {
          expect(response).toEqual(jasmine.any(HttpResponseMessage));
          expect(response.requestMessage).toBe(message);
          expect(response.response).toBe(errorResponse);
          expect(response.responseType).toBe("abort");
        })
        .then(done);

      let xhr = reqProcessor.xhr;
      xhr.status = 200;
      xhr.onabort(errorResponse);
    });

    it('applies xhr transformers after calling request interceptors', (done) => {
      class RequestInterceptor {
        request(message) {
          return message;
        }
      }

      var interceptor = new RequestInterceptor();
      spyOn(interceptor, 'request').and.callThrough();

      function mockTransformer() {
        expect(interceptor.request).toHaveBeenCalled();
      }

      message.interceptors = [interceptor]
      reqProcessor.xhrTransformers.push(mockTransformer);
      reqProcessor.process(client, message).then((response) => { done() } );
      reqProcessor.xhr.fakeResponse();
    });
  });
});
