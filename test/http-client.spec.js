import {HttpClient} from '../src/index';
import {HttpRequestMessage} from '../src/index';
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

      it('should retrieve correct content', (done) => {
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

  describe('put', () => {

    describe('request', () => { 

      it('should make expected request', () => {    
        var content = { firstName: "John", lastName: "Doe" };
        var headers = new Headers();
        headers.add('Content-Type', 'application/json');    
        var client = new HttpClient(baseUrl, headers);

        client.put('some/cool/path', content);

        var request = jasmine.Ajax.requests.mostRecent();

        expect(request.url).toBe(`${baseUrl}some/cool/path`);      
        expect(request.method).toBe('PUT');
        expect(request.data()).toEqual(content);     
      });  

      it('should only include content properties specified in the replacer array', () => {    
        var content = { firstName: "John", lastName: "Doe" };
        var headers = new Headers();
        headers.add('Content-Type', 'application/json');    
        var client = new HttpClient(baseUrl, headers);

        client.put('some/cool/path', content, ['firstName']);

        var request = jasmine.Ajax.requests.mostRecent();

        expect(request.data()).not.toEqual(content); 
        expect(request.data()).toEqual({ firstName: "John" });    
      });  

      it('should provide expected request headers', () => {      
        var headers = new Headers();
        headers.add('Authorization', 'bearer 123');
        var client = new HttpClient(undefined, headers);

        client.put('some/cool/path');

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

      it('should retrieve correct content', (done) => {
        var client = new HttpClient(baseUrl);

        client.put('some/cool/path').then(response => {
          expect(response.content.name).toBe('Martin');
          done();
        });

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({ status: 200, responseText: '{"name":"Martin"}' });
      });

      it('should not succeed on 500 response', (done) => {
        var client = new HttpClient(baseUrl);

        client.put('some/cool/path').then(response => {
          expect(response.isSuccess).toBe(false);
          done();
        });

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({ status: 500 });

      }); 

    }); 

  });

  describe('patch', () => {

    describe('request', () => { 

      it('should make expected request', () => {    
        var content = { firstName: "John", lastName: "Doe" };
        var headers = new Headers();
        headers.add('Content-Type', 'application/json');    
        var client = new HttpClient(baseUrl, headers);

        client.patch('some/cool/path', content);

        var request = jasmine.Ajax.requests.mostRecent();

        expect(request.url).toBe(`${baseUrl}some/cool/path`);      
        expect(request.method).toBe('PATCH');
        expect(request.data()).toEqual(content);     
      });  

      it('should only include content properties specified in the replacer array', () => {    
        var content = { firstName: "John", lastName: "Doe" };
        var headers = new Headers();
        headers.add('Content-Type', 'application/json');    
        var client = new HttpClient(baseUrl, headers);

        client.patch('some/cool/path', content, ['firstName']);

        var request = jasmine.Ajax.requests.mostRecent();
    
        expect(request.data()).not.toEqual(content); 
        expect(request.data()).toEqual({ firstName: "John" });    
      });  

      it('should provide expected request headers', () => {      
        var headers = new Headers();
        headers.add('Authorization', 'bearer 123');
        var client = new HttpClient(undefined, headers);

        client.patch('some/cool/path');

        var request = jasmine.Ajax.requests.mostRecent();    

        expect(request.requestHeaders['Authorization']).toBe('bearer 123');
      });    

    });

    describe('response', () => {

      it('should succeed on 200 response', (done) => {
        var client = new HttpClient(baseUrl);

        client.put('some/cool/path').then(response => {
          expect(response.isSuccess).toBe(true);
          done();
        });

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({ status: 200 });
      });

      it('should retrieve correct content', (done) => {
        var client = new HttpClient(baseUrl);

        client.patch('some/cool/path').then(response => {
          expect(response.content.name).toBe('Martin');
          done();
        });

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({ status: 200, responseText: '{"name":"Martin"}' });
      });

      it('should not succeed on 500 response', (done) => {
        var client = new HttpClient(baseUrl);

        client.patch('some/cool/path').then(response => {
          expect(response.isSuccess).toBe(false);
          done();
        });

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({ status: 500 });

      }); 

    }); 

  });

  describe('post', () => {

    describe('request', () => { 

      it('should make expected request', () => {    
        var content = { firstName: "John", lastName: "Doe" };
        var headers = new Headers();
        headers.add('Content-Type', 'application/json');    
        var client = new HttpClient(baseUrl, headers);

        client.post('some/cool/path', content);

        var request = jasmine.Ajax.requests.mostRecent();

        expect(request.url).toBe(`${baseUrl}some/cool/path`);      
        expect(request.method).toBe('POST');
        expect(request.data()).toEqual(content);     
      });  

      it('should only include content properties specified in the replacer array', () => {    
        var content = { firstName: "John", lastName: "Doe" };
        var headers = new Headers();
        headers.add('Content-Type', 'application/json');    
        var client = new HttpClient(baseUrl, headers);

        client.post('some/cool/path', content, ['firstName']);

        var request = jasmine.Ajax.requests.mostRecent();
    
        expect(request.data()).not.toEqual(content); 
        expect(request.data()).toEqual({ firstName: "John" });    
      });  

      it('should provide expected request headers', () => {      
        var headers = new Headers();
        headers.add('Authorization', 'bearer 123');
        var client = new HttpClient(undefined, headers);

        client.post('some/cool/path');

        var request = jasmine.Ajax.requests.mostRecent();    

        expect(request.requestHeaders['Authorization']).toBe('bearer 123');
      });    

    });

    describe('response', () => {

      it('should succeed on 201 response', (done) => {
        var client = new HttpClient(baseUrl);

        client.post('some/cool/path').then(response => {
          expect(response.isSuccess).toBe(true);
          done();
        });

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({ status: 201 });
      });

      it('should retrieve correct content', (done) => {
        var client = new HttpClient(baseUrl);

        client.post('some/cool/path').then(response => {
          expect(response.content.name).toBe('Martin');
          done();
        });

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({ status: 201, responseText: '{"name":"Martin"}' });
      });

      it('should not succeed on 500 response', (done) => {
        var client = new HttpClient(baseUrl);

        client.post('some/cool/path').then(response => {
          expect(response.isSuccess).toBe(false);
          done();
        });

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({ status: 500 });

      }); 

    }); 

    describe('delete', () => {   

      describe('request', () => { 

        it('should make expected request', () => {      
          var client = new HttpClient(baseUrl);

          client.delete('some/cool/path');

          var request = jasmine.Ajax.requests.mostRecent();

          expect(request.url).toBe(`${baseUrl}some/cool/path`);
          expect(request.method).toBe('DELETE');
          expect(request.data()).toEqual({});
        });

        it('should provide expected request headers', () => {      
          var headers = new Headers();
          headers.add('Authorization', 'bearer 123');
          var client = new HttpClient(undefined, headers);

          client.delete('some/cool/path');

          var request = jasmine.Ajax.requests.mostRecent();    

          expect(request.requestHeaders['Authorization']).toBe('bearer 123');
        });

      });

      describe('response', () => {

        it('should succeed on 200 response', (done) => {
          var client = new HttpClient(baseUrl);

          client.delete('some/cool/path').then(response => {
            expect(response.isSuccess).toBe(true);
            done();
          });

          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({ status: 200 });
        });

        it('should not succeed on 500 response', (done) => {
          var client = new HttpClient(baseUrl);

          client.delete('some/cool/path').then(response => {
            expect(response.isSuccess).toBe(false);
            done();
          });

          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({ status: 500 });

        }); 

      }); 

    });

  });

  describe('send', () => {

    it('should reject on onerror', (done) => {
      var client = new HttpClient();

      client.send(new HttpRequestMessage('GET', 'some/cool/url')).then(response => {

      }, error => {
        expect(error instanceof Error).toBe(true);
        done();
      });

      jasmine.Ajax.requests.mostRecent().responseError(); 

    });

    it('should reject on ontimeout', (done) => {
        jasmine.clock().install()
        var client = new HttpClient();

        client.send(new HttpRequestMessage('GET', 'some/cool/url')).then(response => {
        }, error => {
          expect(error instanceof Error).toBe(true);
          done();
        });

        jasmine.Ajax.requests.mostRecent().responseTimeout(); 
        jasmine.clock().uninstall();
    });

    it('can parse request headers', (done) => {
      var client = new HttpClient();

      client.send(new HttpRequestMessage('GET', 'some/cool/url')).then(response => {
        expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://www.example.com');
        done();
      });

      var request = jasmine.Ajax.requests.mostRecent();
      request.respondWith({         
        responseHeaders: [{ name: 'Access-Control-Allow-Origin', value: 'http://www.example.com'}] 
      });

    });

    it('can parse multiple request headers', (done) => {
      var client = new HttpClient();

      client.send(new HttpRequestMessage('GET', 'some/cool/url')).then(response => {
        expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://www.example.com');
        expect(response.headers.get('Content-Type')).toBe('application/json');
        done();
      });

      var request = jasmine.Ajax.requests.mostRecent();
      request.respondWith({         
        responseHeaders: [
          { name: 'Access-Control-Allow-Origin', value: 'http://www.example.com'},
          { name: 'Content-Type', value: 'application/json'}
        ] 
      });
      
    });

    it('can parse header values containing :', (done) => {
      var client = new HttpClient();

      client.send(new HttpRequestMessage('GET', 'some/cool/url')).then(response => {
        expect(response.headers.get('Some-Cosy-Header')).toBe('foo:bar');
        done();
      });

      var request = jasmine.Ajax.requests.mostRecent();
      request.respondWith({         
        responseHeaders: [{ name: 'Some-Cosy-Header', value: 'foo:bar'}] 
      });
    });     

  });

});