import {Headers} from '../src/index';

describe('headers', () => {

	it('can add header value', () => {
	  var headers = new Headers();
		headers.add('Authorization', '123');

		expect(headers.headers['Authorization']).toBe('123');
	});

	it('can get header value', () => {
		var headers = new Headers();
		headers.add('Authorization', '123');

		expect(headers.get('Authorization')).toBe('123');
	});
		
	it('will clear headers on clear', () => {
		var headers = new Headers();
		headers.add('Authorization', '123');

		expect(headers.get('Authorization')).toBe('123');

		headers.clear();

		expect(headers.get('Authorization')).toBeUndefined();
		expect(headers.headers).toEqual({});
	});

	it('configureXHR should add the headers', () =>{
		var headers = new Headers();
		headers.add('Authorization', '123');
		headers.add('Content-Type', 'application/json');

		jasmine.Ajax.withMock(() => {
			var xhr = new XMLHttpRequest();

			headers.configureXHR(xhr);

			expect(xhr.requestHeaders['Authorization']).toBe('123');
			expect(xhr.requestHeaders['Content-Type']).toBe('application/json');
		});
	});

});