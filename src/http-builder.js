import {join} from 'aurelia-path';
import {HttpRequestMessage} from './http-request-message';
import {HttpResponseMessage} from './http-response-message';
import {JSONPRequestMessage} from './jsonp-request-message';
import {Headers} from './headers';

export class HttpBuilder {
	constructor (baseUrl, requestHeaders = new Headers()) {
		this.baseUrl = baseUrl;
		this.requestHeaders = requestHeaders;
	}

	send(requestMessage, progressCallback){
		return requestMessage.send(this, progressCallback);
	}

	get(uri){
		return this.send(new HttpRequestMessage('GET', join(this.baseUrl, uri)).withHeaders(this.requestHeaders));
	}

	put(uri, content, replacer){
		return this.send(new HttpRequestMessage('PUT', join(this.baseUrl, uri), content, replacer || this.replacer).withHeaders(this.requestHeaders));
	}

	patch(uri, content, replacer){
		return this.send(new HttpRequestMessage('PATCH', join(this.baseUrl, uri), content, replacer || this.replacer).withHeaders(this.requestHeaders));
	}

	post(uri, content, replacer){
		return this.send(new HttpRequestMessage('POST', join(this.baseUrl, uri), content, replacer || this.replacer).withHeaders(this.requestHeaders));
	}

	delete(uri){
		return this.send(new HttpRequestMessage('DELETE', join(this.baseUrl, uri)).withHeaders(this.requestHeaders));
	}

	jsonp(uri, callbackParameterName='jsoncallback'){
		return this.send(new JSONPRequestMessage(join(this.baseUrl, uri), callbackParameterName).withHeaders(this.requestHeaders));
	}
}

export class HttpAction {
	static register(name, handler) {
		HttpBulder.prototype[name] = handler;
	}
}