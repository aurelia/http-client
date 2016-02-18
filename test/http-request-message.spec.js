import './setup';
import {HttpRequestMessage, createHttpRequestMessageProcessor} from '../src/http-request-message';
import {Headers} from '../src/headers';
import {RequestMessageProcessor} from '../src/request-message-processor';
import {
  timeoutTransformer,
  credentialsTransformer,
  progressTransformer,
  responseTypeTransformer,
  headerTransformer,
  contentTransformer
  } from '../src/xhr-transformers';

describe("http-request-message", () => {
  it("should have a constructor that takes in the method, url, content and headers", () => {
    let method = {}, url = {}, content = {}, headers = {};
    let httpRequestMessage = new HttpRequestMessage(method, url, content, headers);

    expect(httpRequestMessage.method).toBe(method);
    expect(httpRequestMessage.url).toBe(url);
    expect(httpRequestMessage.content).toBe(content);
    expect(httpRequestMessage.headers).toBe(headers);
    expect(httpRequestMessage.responseType).toBe('json');
  });

  it("have a constructor should default the headers if not provided", () => {
    let method = {}, url = {}, content = {};
    let httpRequestMessage = new HttpRequestMessage(method, url, content);
    expect(httpRequestMessage.headers).toEqual(jasmine.any(Headers));
  });

  describe("createHttpRequestMessageProcessor",() => {
    it("should create a RequestMessageProcessor with an XMLHttpRequest and the correct xhrTransformers", () => {
      let httpProcessor = createHttpRequestMessageProcessor();

      expect(httpProcessor).toEqual(jasmine.any(RequestMessageProcessor));
      expect(httpProcessor.XHRType).toBe(XMLHttpRequest);
      expect(httpProcessor.xhrTransformers).toContain(timeoutTransformer);
      expect(httpProcessor.xhrTransformers).toContain(credentialsTransformer);
      expect(httpProcessor.xhrTransformers).toContain(progressTransformer);
      expect(httpProcessor.xhrTransformers).toContain(responseTypeTransformer);
      expect(httpProcessor.xhrTransformers).toContain(headerTransformer);
      expect(httpProcessor.xhrTransformers).toContain(contentTransformer);
    });
  });

});
