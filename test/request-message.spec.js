import './setup';
import {RequestMessage} from '../src/request-message';

describe('RequestMessage', () => {
  describe('buildFullUrl', () => {
    var message;
    beforeEach(() => {
      message = new RequestMessage('get', '/anotherurl');
      message.baseUrl = 'example.com';
    });

    it('combines baseUrl and url', () => {
      expect(message.buildFullUrl()).toBe('example.com/anotherurl');
    });

    it('appends query parameters', () => {
      message.params = { 'a': 'this', 'b': 'that' };
      expect(message.buildFullUrl()).toBe('example.com/anotherurl?a=this&b=that');
    });
  });
});
