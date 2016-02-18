import './setup';
import {JSONPRequestMessage, createJSONPRequestMessageProcessor} from '../src/jsonp-request-message';
import {Headers} from '../src/headers';
import {RequestMessageProcessor} from '../src/request-message-processor';
import { timeoutTransformer, callbackParameterNameTransformer } from '../src/xhr-transformers';

describe("JSONPRequestMessage", () => {
  it("should have a constructor that correctly sets the methods and response type", () => {
    let url = {}, callbackName = {};
    let jsonpRequest = new JSONPRequestMessage(url, callbackName);
    expect(jsonpRequest.method).toBe('JSONP');
    expect(jsonpRequest.url).toBe(url);
    expect(jsonpRequest.content).toBeUndefined();
    expect(jsonpRequest.headers).toEqual(jasmine.any(Headers));
    expect(jsonpRequest.responseType).toBe('jsonp');
    expect(jsonpRequest.callbackParameterName).toBe(callbackName);
  });

  describe("createJSONPRequestMessageProcessor",() => {
    it("should create a RequestMessageProcessor with an JSONPXHR and the correct xhrTransformers", () => {
      let httpProcessor = createJSONPRequestMessageProcessor();

      expect(httpProcessor).toEqual(jasmine.any(RequestMessageProcessor));
      expect(httpProcessor.XHRType).toBeDefined();
      expect(httpProcessor.xhrTransformers).toContain(timeoutTransformer);
      expect(httpProcessor.xhrTransformers).toContain(callbackParameterNameTransformer);
    });
  });

  //TODO : Will have to create a jsonp preprocessor for karma to test an actual request
});
