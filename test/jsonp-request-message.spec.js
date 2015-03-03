import {JSONPRequestMessage, createJSONPRequestMessageProcessor} from '../src/jsonp-request-message';
import {Headers} from '../src/headers';
import {RequestMessageProcessor} from '../src/request-message-processor';
import { timeoutTransformer, callbackParameterNameTransformer } from '../src/transformers';

describe("JSONPRequestMessage", () => {
  it("should have a constructor that correctly sets the methods and response type", () => {
    let uri = {}, callbackName = {};
    let jsonpRequest = new JSONPRequestMessage(uri, callbackName);
    expect(jsonpRequest.method).toBe('JSONP');
    expect(jsonpRequest.uri).toBe(uri);
    expect(jsonpRequest.content).toBeUndefined();
    expect(jsonpRequest.headers).toEqual(jasmine.any(Headers));
    expect(jsonpRequest.responseType).toBe('jsonp');
    expect(jsonpRequest.callbackParameterName).toBe(callbackName);
  });

  describe("createJSONPRequestMessageProcessor",() => {
    it("should create a RequestMessageProcessor with an JSONPXHR and the correct transformers", () => {
      let httpProcessor = createJSONPRequestMessageProcessor();

      expect(httpProcessor).toEqual(jasmine.any(RequestMessageProcessor));
      expect(httpProcessor.XHRType).toBeDefined();
      expect(httpProcessor.transformers).toContain(timeoutTransformer);
      expect(httpProcessor.transformers).toContain(callbackParameterNameTransformer);
    });
  });

  //TODO : Will have to create a jsonp preprocessor for karma to test an actual request
});
