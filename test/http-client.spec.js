import {HttpClient} from '../src/index';
import {HttpRequestMessage, HttpResponseMessage} from '../src/index';
import {Headers} from '../src/index';

describe('http client', () => {

  var baseUrl = "http://example.com/";

  beforeEach(() => {
    jasmine.Ajax.install();

    jasmine.Ajax
      .stubRequest('http://example.com/some/cool/path')
      .andReturn({ status: 200 });
  });

  afterEach(() => {
    jasmine.Ajax.uninstall();
  });

  describe('get', () => {

    describe('request', () => {

      it('should make expected request', (done) => {
        var client = new HttpClient()
          .configure(x => x.withBaseUrl(baseUrl));

        client.get('some/cool/path').then(() => {
          var request = jasmine.Ajax.requests.mostRecent();

          expect(request.url).toBe(`${baseUrl}some/cool/path`);
          expect(request.method).toBe('GET');
          expect(request.data()).toEqual({});

          done();
        });

      });

      it('should provide expected request headers', (done) => {
        var client = new HttpClient()
          .configure(x => {
            x.withBaseUrl(baseUrl);
            x.withHeader('Authorization', 'bearer 123');
          });

        client.get('some/cool/path').then(() => {
          var request = jasmine.Ajax.requests.mostRecent();

          expect(request.requestHeaders['Authorization']).toBe('bearer 123');

          done();
        });
      });

    });

    describe('response', () => {

      it('should succeed on 200 response', (done) => {
        var client = new HttpClient()
          .configure(x => x.withBaseUrl(baseUrl));

        client.get('some/cool/path').then(response => {
          expect(response.isSuccess).toBe(true);
          done();
        });

      });

      it('should retrieve correct content', (done) => {
        var client = new HttpClient()
          .configure(x => x.withBaseUrl(baseUrl));

        jasmine.Ajax
          .stubRequest('http://example.com/some/cool/path')
          .andReturn({ status: 200, responseText: '{"name":"Martin"}' });

        client.get('some/cool/path').then(response => {
          expect(response.content.name).toBe('Martin');
          done();
        });

      });

      it('should not succeed on 500 response', (done) => {
        var client = new HttpClient()
          .configure(x => x.withBaseUrl(baseUrl));

        jasmine.Ajax
          .stubRequest('http://example.com/some/cool/path')
          .andReturn({ status: 500 });

        client.get('some/cool/path').catch(response => {
          expect(response.isSuccess).toBe(false);
          done();
        });

      });

    });

  });

  describe('put', () => {

    describe('request', () => {

      it('should make expected request', (done) => {
        var content = { firstName: "John", lastName: "Doe" };
        var client = new HttpClient()
          .configure(x => {
            x.withBaseUrl(baseUrl);
            x.withHeader('Content-Type', 'application/json');
          });

        client.put('some/cool/path', content).then(() => {
          var request = jasmine.Ajax.requests.mostRecent();

          expect(request.url).toBe(`${baseUrl}some/cool/path`);
          expect(request.method).toBe('PUT');
          expect(request.data()).toEqual(content);
          done();
        });

      });

      it('should only include content properties specified in the replacer array', (done) => {
        var content = { firstName: "John", lastName: "Doe" };
        var client = new HttpClient()
          .configure(x => {
            x.withBaseUrl(baseUrl);
            x.withHeader('Content-Type', 'application/json');
          });

        client.createRequest('some/cool/path')
          .asPut()
          .withContent(content)
          .withReplacer(['firstName'])
          .send()
          .then(() => {
            var request = jasmine.Ajax.requests.mostRecent();

            expect(request.data()).not.toEqual(content);
            expect(request.data()).toEqual({ firstName: "John" });
            done();
          });
      });

      it('should provide expected request headers', (done) => {
        var client = new HttpClient()
          .configure(x => {
            x.withBaseUrl(baseUrl);
            x.withHeader('Authorization', 'bearer 123');
          });

        client.put('some/cool/path').then(() => {
          var request = jasmine.Ajax.requests.mostRecent();

          expect(request.requestHeaders['Authorization']).toBe('bearer 123');
          done();
        });
      });

    });

    describe('response', () => {

      it('should succeed on 200 response', (done) => {
        var client = new HttpClient()
          .configure(x => x.withBaseUrl(baseUrl));

        client.get('some/cool/path').then(response => {
          expect(response.isSuccess).toBe(true);
          done();
        });
      });

      it('should retrieve correct content', (done) => {
        var client = new HttpClient()
          .configure(x => x.withBaseUrl(baseUrl));

        jasmine.Ajax
          .stubRequest('http://example.com/some/cool/path')
          .andReturn({ status: 200, responseText: '{"name":"Martin"}' });

        client.put('some/cool/path').then(response => {
          expect(response.content.name).toBe('Martin');
          done();
        });
      });

      it('should not succeed on 500 response', (done) => {
        var client = new HttpClient()
          .configure(x => x.withBaseUrl(baseUrl));

        jasmine.Ajax
          .stubRequest('http://example.com/some/cool/path')
          .andReturn({ status: 500 });

        client.put('some/cool/path').catch(response => {
          expect(response.isSuccess).toBe(false);
          done();
        });

      });

    });

  });

  describe('patch', () => {

    describe('request', () => {

      it('should make expected request', (done) => {
        var content = { firstName: "John", lastName: "Doe" };
        var client = new HttpClient()
          .configure(x => {
            x.withBaseUrl(baseUrl);
            x.withHeader('Content-Type', 'application/json');
          });

        client.patch('some/cool/path', content).then(() => {
          var request = jasmine.Ajax.requests.mostRecent();

          expect(request.url).toBe(`${baseUrl}some/cool/path`);
          expect(request.method).toBe('PATCH');
          expect(request.data()).toEqual(content);
          done();
        });

      });

      it('should only include content properties specified in the replacer array', (done) => {
        var content = { firstName: "John", lastName: "Doe" };
        var client = new HttpClient()
          .configure(x => {
            x.withBaseUrl(baseUrl);
            x.withHeader('Content-Type', 'application/json');
          });

        client.createRequest('some/cool/path')
          .asPatch()
          .withContent(content)
          .withReplacer(['firstName'])
          .send()
          .then(() => {
            var request = jasmine.Ajax.requests.mostRecent();

            expect(request.data()).not.toEqual(content);
            expect(request.data()).toEqual({ firstName: "John" });
            done();
          });
      });

      it('should provide expected request headers', (done) => {
        var client = new HttpClient()
          .configure(x => {
            x.withBaseUrl(baseUrl);
            x.withHeader('Authorization', 'bearer 123');
          });

        client.patch('some/cool/path').then(() => {
          var request = jasmine.Ajax.requests.mostRecent();

          expect(request.requestHeaders['Authorization']).toBe('bearer 123');
          done();
        });

      });

    });

    describe('response', () => {

      it('should succeed on 200 response', (done) => {
        var client = new HttpClient()
          .configure(x => x.withBaseUrl(baseUrl));

        client.put('some/cool/path').then(response => {
          expect(response.isSuccess).toBe(true);
          done();
        });
      });

      it('should retrieve correct content', (done) => {
        var client = new HttpClient()
          .configure(x => x.withBaseUrl(baseUrl));

        jasmine.Ajax
          .stubRequest('http://example.com/some/cool/path')
          .andReturn({ status: 200, responseText: '{"name":"Martin"}' });

        client.patch('some/cool/path').then(response => {
          expect(response.content.name).toBe('Martin');
          done();
        });
      });

      it('should not succeed on 500 response', (done) => {
        var client = new HttpClient()
          .configure(x => x.withBaseUrl(baseUrl));

        jasmine.Ajax
          .stubRequest('http://example.com/some/cool/path')
          .andReturn({ status: 500 });

        client.patch('some/cool/path').catch(response => {
          expect(response.isSuccess).toBe(false);
          done();
        });

      });

    });

  });

  describe('post', () => {

    describe('request', () => {

      it('should make expected request', (done) => {
        var content = { firstName: "John", lastName: "Doe" };
        var client = new HttpClient()
          .configure(x => {
            x.withBaseUrl(baseUrl);
            x.withHeader('Content-Type', 'application/json');
          });

        client.post('some/cool/path', content).then(() => {
          var request = jasmine.Ajax.requests.mostRecent();

          expect(request.url).toBe(`${baseUrl}some/cool/path`);
          expect(request.method).toBe('POST');
          expect(request.data()).toEqual(content);
          done();
        });

      });

      it('should only include content properties specified in the replacer array', (done) => {
        var content = { firstName: "John", lastName: "Doe" };
        var client = new HttpClient()
          .configure(x => {
            x.withBaseUrl(baseUrl);
            x.withHeader('Content-Type', 'application/json');
          });

        client.createRequest('some/cool/path')
          .asPost()
          .withContent(content)
          .withReplacer(['firstName'])
          .send()
          .then(() => {
            var request = jasmine.Ajax.requests.mostRecent();

            expect(request.data()).not.toEqual(content);
            expect(request.data()).toEqual({ firstName: "John" });
            done();
          });
      });

      it('should provide expected request headers', (done) => {
        var client = new HttpClient()
          .configure(x => {
            x.withBaseUrl(baseUrl);
            x.withHeader('Authorization', 'bearer 123');
          });

        client.post('some/cool/path').then(() => {
          var request = jasmine.Ajax.requests.mostRecent();

          expect(request.requestHeaders['Authorization']).toBe('bearer 123');
          done();
        });

      });

    });

    describe('response', () => {

      it('should succeed on 201 response', (done) => {
        var client = new HttpClient()
          .configure(x => x.withBaseUrl(baseUrl));

        jasmine.Ajax
          .stubRequest('http://example.com/some/cool/path')
          .andReturn({ status: 201 });

        client.post('some/cool/path').then(response => {
          expect(response.isSuccess).toBe(true);
          done();
        });
      });

      it('should retrieve correct content', (done) => {
        var client = new HttpClient()
          .configure(x => x.withBaseUrl(baseUrl));

        jasmine.Ajax
          .stubRequest('http://example.com/some/cool/path')
          .andReturn({ status: 200, responseText: '{"name":"Martin"}' });

        client.post('some/cool/path').then(response => {
          expect(response.content.name).toBe('Martin');
          done();
        });
      });

      it('should not succeed on 500 response', (done) => {
        var client = new HttpClient()
          .configure(x => x.withBaseUrl(baseUrl));

        jasmine.Ajax
          .stubRequest('http://example.com/some/cool/path')
          .andReturn({ status: 500 });

        client.post('some/cool/path').catch(response => {
          expect(response.isSuccess).toBe(false);
          done();
        });

      });

    });
  });

  describe('delete', () => {

    describe('request', () => {

      it('should make expected request', (done) => {
        var client = new HttpClient()
          .configure(x => x.withBaseUrl(baseUrl));

        client.delete('some/cool/path').then(() => {
          var request = jasmine.Ajax.requests.mostRecent();

          expect(request.url).toBe(`${baseUrl}some/cool/path`);
          expect(request.method).toBe('DELETE');
          expect(request.data()).toEqual({});
          done();
        });

      });

      it('should provide expected request headers', (done) => {
        var client = new HttpClient()
          .configure(x => {
            x.withBaseUrl(baseUrl);
            x.withHeader('Authorization', 'bearer 123');
          });

        client.delete('some/cool/path').then(() => {
          var request = jasmine.Ajax.requests.mostRecent();

          expect(request.requestHeaders['Authorization']).toBe('bearer 123');
          done();
        });

      });

    });

    describe('response', () => {

      it('should succeed on 200 response', (done) => {
        var client = new HttpClient()
          .configure(x => x.withBaseUrl(baseUrl));

        client.delete('some/cool/path').then(response => {
          expect(response.isSuccess).toBe(true);
          done();
        });

      });

      it('should not succeed on 500 response', (done) => {
        var client = new HttpClient()
          .configure(x => x.withBaseUrl(baseUrl));

        jasmine.Ajax
          .stubRequest('http://example.com/some/cool/path')
          .andReturn({ status: 500 });

        client.delete('some/cool/path').catch(response => {
          expect(response.isSuccess).toBe(false);
          done();
        });
      });

    });

  });

  describe('send', () => {

    xit('should reject on onerror', (done) => {
      // TODO: Enable and fix this test when
      // https://github.com/jasmine/jasmine-ajax/issues/111
      // will be fixed
      var client = new HttpClient()
        .configure(x => x.withBaseUrl(baseUrl));

      client.send(new HttpRequestMessage('GET', 'some/cool/path')).catch(response => {
        expect(response instanceof HttpResponseMessage).toBe(true);
        expect(response.responseType).toBe('error');
        done();
      });

      jasmine.Ajax.requests.mostRecent().responseError();

    });

    xit('should reject on ontimeout', (done) => {
      // TODO: Enable and fix this test when
      // https://github.com/jasmine/jasmine-ajax/issues/111
      // will be fixed
      jasmine.clock().install();
      var client = new HttpClient()
        .configure(x => x.withBaseUrl(baseUrl));

      client.send(new HttpRequestMessage('GET', 'some/cool/path')).catch(response => {
        expect(response instanceof HttpResponseMessage).toBe(true);
        expect(response.responseType).toBe('timeout');
        done();
      });

      jasmine.Ajax.requests.mostRecent().responseTimeout();
      jasmine.clock().uninstall();
    });

    xit('should reject when aborted', (done) => {
      // TODO: Enable and fix this test when
      // https://github.com/jasmine/jasmine-ajax/issues/111
      // will be fixed
      var client = new HttpClient()
        .configure(x => x.withBaseUrl(baseUrl));

      var promise = client.send(new HttpRequestMessage('GET', 'some/cool/path'));
      promise.catch((response, reason) => {
        expect(response instanceof HttpResponseMessage).toBe(true);
        expect(response.responseType).toBe('abort');
        done();
      });

      // This have to be called in the nextTick because when we reach this code, XHR isn't sent yet
      promise.abort();
    });

    it('can parse request headers', (done) => {
      var client = new HttpClient()
        .configure(x => x.withBaseUrl(baseUrl));

      jasmine.Ajax
        .stubRequest('http://example.com/some/cool/path')
        .andReturn({
          status: 200,
          responseHeaders: [{ name: 'Access-Control-Allow-Origin', value: 'http://www.example.com'}]
        });

      client.send(new HttpRequestMessage('GET', 'some/cool/path')).then(response => {
        expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://www.example.com');
        done();
      }).catch(e => {
        console.log(e);
        done();
      });

    });

    it('can parse multiple request headers', (done) => {
      var client = new HttpClient()
        .configure(x => x.withBaseUrl(baseUrl));

      jasmine.Ajax
        .stubRequest('http://example.com/some/cool/path')
        .andReturn({
          status: 200,
          responseHeaders: [
            { name: 'Access-Control-Allow-Origin', value: 'http://www.example.com'},
            { name: 'Content-Type', value: 'application/json'}
          ]
        });

      client.send(new HttpRequestMessage('GET', 'some/cool/path')).then(response => {
        expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://www.example.com');
        expect(response.headers.get('Content-Type')).toBe('application/json');
        done();
      });

    });

    it('can parse header values containing :', (done) => {
      var client = new HttpClient()
        .configure(x => x.withBaseUrl(baseUrl));

      jasmine.Ajax
        .stubRequest('http://example.com/some/cool/path')
        .andReturn({
          status: 200,
          responseHeaders: [{ name: 'Some-Cosy-Header', value: 'foo:bar'}]
        });

      client.send(new HttpRequestMessage('GET', 'some/cool/path')).then(response => {
        expect(response.headers.get('Some-Cosy-Header')).toBe('foo:bar');
        done();
      });

    });

    it('should set callback on upload progress', (done) => {
      var client = new HttpClient()
        .configure(x => x.withBaseUrl(baseUrl));
      var callback = function(){};

      client.createRequest('some/cool/path')
        .asGet()
        .withProgressCallback(callback)
        .send()
        .then(() => {
          var response = jasmine.Ajax.requests.mostRecent();
          expect(response.upload.onprogress).toBe(callback);
          done();
        });
    });

  });

  describe('interceptor', () => {

    it('should intercept request messages', (done) => {
      class RequestInterceptor {

        constructor() {
          this.called = false;
        }

        request(message) {
          this.called = true;
          return message;
        }
      }

      var interceptor = new RequestInterceptor();

      var client = new HttpClient()
        .configure(x => x.withBaseUrl(baseUrl))
        .addInterceptor(interceptor);

      client.get('some/cool/path')
        .then((response) => {
          expect(response.isSuccess).toBe(true);
          expect(interceptor.called).toBe(true);
          done();
        })
    });

    it('should intercept response message', (done) => {
      class ResponseInterceptor {
        constructor() {
          this.called = false;
        }

        response(message) {
          this.called = true;
          return message;
        }
      }

      var interceptor = new ResponseInterceptor();

      var client = new HttpClient()
        .configure(x => x.withBaseUrl(baseUrl))
        .addInterceptor(interceptor);

      client.get('some/cool/path')
        .then((response) => {
          expect(response.isSuccess).toBe(true);
          expect(interceptor.called).toBe(true);
          done();
        })
    });

    it('should intercept request errors', (done) => {
      class RequestErrorInvokerInterceptor {
        request(message) {
          throw new Error('error');
        }
      }

      class RequestErrorInterceptor {

        constructor() {
          this.called = false;
        }

        requestError(error) {
          this.called = true;
          // Re-throw
          throw error;
        }

      }

      var interceptor = new RequestErrorInterceptor();

      var client = new HttpClient()
        .configure(x => x.withBaseUrl(baseUrl))
        .addInterceptor(new RequestErrorInvokerInterceptor()) // Simulate requestError
        .addInterceptor(interceptor);

      client.get('some/cool/path')
        .catch((error) => {
          expect(error.message).toBe('error');
          expect(interceptor.called).toBe(true);
          done();
        })
    });

    it('should intercept response errors', (done) => {
      jasmine.Ajax
        .stubRequest('http://example.com/some/cool/path')
        .andReturn({ status: 500 });

      class ResponseErrorInterceptor {

        constructor() {
          this.called = false;
        }

        responseError(response) {
          this.called = true;
          // Re-throw
          throw response;
        }

      }

      var interceptor = new ResponseErrorInterceptor();

      var client = new HttpClient()
        .configure(x => x.withBaseUrl(baseUrl))
        .addInterceptor(interceptor);

      client.get('some/cool/path')
        .catch((response) => {
          expect(response.isSuccess).toBe(false);
          expect(interceptor.called).toBe(true);
          done();
        })
    });

  });

});
