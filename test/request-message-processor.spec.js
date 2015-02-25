import {RequestMessageProcessor} from '../src/request-message-processor';
import {HttpResponseMessage} from '../src/http-response-message';

describe("Request message processor", () => {
  it("constructor() correctly setup the xhrType and the transformers", () => {
    var xhrType = {};
    var transformers = {};
    var processor = new RequestMessageProcessor(xhrType, transformers);

    expect(processor.XHRType).toBe(xhrType);
    expect(processor.transformers).toBe(transformers);
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
    let openSpy, sendSpy, transformers, reqProcessor, message, client;

    class MockXhrType {
      constructor() {
        this.open = openSpy = jasmine.createSpy("open");
        this.send = sendSpy = jasmine.createSpy("send");
      }
    }

    beforeEach(() => {
      transformers = [];
      reqProcessor = new RequestMessageProcessor(MockXhrType, transformers);
      message = {
        method: 'get',
        params: [],
        baseUrl: '',
        uri: 'some/uri',
        content: {},
        responseType: "test",
        reviver: (obj) => obj
      };
      client = {};
    });

    it("should create a new instance of the XHRType", () => {
      reqProcessor.process(client, message);
      expect(reqProcessor.xhr).toEqual(jasmine.any(MockXhrType));
    });

    it("should call xhr.open with the method, full uri and ajax set to true", () => {
      reqProcessor.process(client, message);
      expect(openSpy).toHaveBeenCalledWith(message.method, message.uri, true);
    });

    it("should call xhr.send with the message content", () => {
      reqProcessor.process(client, message);
      expect(sendSpy).toHaveBeenCalledWith(message.content);
    });

    it("will combine the message baseUrl and message uri and set it to the fullUri", () => {
      message.baseUrl = "/the/base";
      message.uri = "and/the/path";

      reqProcessor.process(client, message);
      expect(message.fullUri).toBe("/the/base/and/the/path");
    });

    it("should run through all the transformers", () => {
      let transformSpy = jasmine.createSpy("transformSpy");
      reqProcessor.transformers.push(transformSpy);
      reqProcessor.transformers.push(transformSpy);
      reqProcessor.process(client, message);

      expect(transformSpy).toHaveBeenCalledWith(client, reqProcessor, message, reqProcessor.xhr);
      expect(transformSpy.calls.count()).toBe(2);
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

      let xhr = reqProcessor.xhr;
      xhr.status = 200;
      xhr.statusText = "status test";
      xhr.response = responseObj;
      xhr.onload();
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

      let xhr = reqProcessor.xhr;
      xhr.status = 401;
      xhr.statusText = "status test";
      xhr.response = responseObj;
      xhr.onload();
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
  });
});
