import {HttpRequestMessage} from '../src/http-request-message';
import {HttpClient} from '../src/http-client';

describe('http client', () =>{

  var baseUrl = "http://example.com/";

  beforeEach(() => {
      jasmine.Ajax.install();
    });

    afterEach(() => {
      jasmine.Ajax.uninstall();
    });

  it('should reject on onerror', (done) => {
    var client = new HttpClient();
    var request = new HttpRequestMessage('GET', 'some/cool/url', client);

    request.send(client).then(response => {
    }, error => {
      expect(error instanceof Error).toBe(true);
      done();
    });

    jasmine.Ajax.requests.mostRecent().responseError(); 

  });

  it('should reject on ontimeout', (done) => {
    jasmine.clock().install()
    var client = new HttpClient();
    var request = new HttpRequestMessage('GET', 'some/cool/url', client);

    request.send(client).then(response => {
    }, error => {
      expect(error instanceof Error).toBe(true);
      done();
    });

    jasmine.Ajax.requests.mostRecent().responseTimeout(); 
    jasmine.clock().uninstall()
  });

});
