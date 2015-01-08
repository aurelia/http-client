import {HttpClient} from '../src/index';
import {Headers} from '../src/index';

describe('http client', () => {

  var baseUrl = "http://example.com/";

  beforeEach(() => {
      jasmine.Ajax.install();
    });

    afterEach(() => {
      jasmine.Ajax.uninstall();
    });

  describe('get', () => {   

    describe('request', () => { 

      it('should make expected request', () => {      
        var client = new HttpClient(baseUrl);

        client.get('some/cool/path');

        var request = jasmine.Ajax.requests.mostRecent();

        expect(request.url).toBe(`${baseUrl}some/cool/path`);
        expect(request.method).toBe('GET');
        expect(request.data()).toEqual({});
      });

      it('should provide expected request headers', () => {      
        var headers = new Headers();
        headers.add('Authorization', 'bearer 123');
        var client = new HttpClient(undefined, headers);

        client.get('some/cool/path');

        var request = jasmine.Ajax.requests.mostRecent();    

        expect(request.requestHeaders['Authorization']).toBe('bearer 123');
      });

    });

    describe('response', () => {

      it('should succeed on 200 response', (done) => {
        var client = new HttpClient(baseUrl);

        client.get('some/cool/path').then(response => {
          expect(response.isSuccess).toBe(true);
          done();
        });

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({ status: 200 });
      });

      it('should retrive correct content', (done) => {
        var client = new HttpClient(baseUrl);

        client.get('some/cool/path').then(response => {
          expect(response.content.name).toBe('Martin');
          done();
        });

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({ status: 200, responseText: '{"name":"Martin"}' });
      });

      it('should not succeed on 500 response', (done) => {
        var client = new HttpClient(baseUrl);

        client.get('some/cool/path').then(response => {
          expect(response.isSuccess).toBe(false);
          done();
        });

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({ status: 500 });

      }); 

    }); 

  });

});