import './setup';
import {RequestBuilder} from '../src/request-builder';
import {HttpClient} from '../src/http-client';

describe('request builder', () => {
  var requestBuilder;

  beforeEach(() => {
    var client = new HttpClient();
    requestBuilder = new RequestBuilder(client);
  });

  describe('add helper', () => {
    it('adds a function prototype to the request builder class', () => {
      RequestBuilder.addHelper('helper1', () => { });
      expect(typeof requestBuilder.helper1).toBe('function');
    });
  });

  describe('helper method', () => {
    it('is called with the given argument', () => {
      var helper2 = jasmine.createSpy('helper2');
      RequestBuilder.addHelper('helper2', helper2);
      requestBuilder.helper2('testarg');
      expect(helper2).toHaveBeenCalledWith('testarg');
    });

    it('has it\'s return value appended to transformers', () => {
      var transformerFunction = new Function();
      RequestBuilder.addHelper('helper3', () => { return transformerFunction });
      requestBuilder.helper3();
      expect(requestBuilder.transformers).toContain(transformerFunction);
    });
  });
});
