import {HttpClient} from '../lib/index';

describe('http client', () => {
  it('should have some tests', () => {
    var client = new HttpClient();
    expect(client).toBe(client);
  });
});