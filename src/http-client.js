import {join} from 'aurelia-path';
import {HttpRequestMessage} from './http-request-message';
import {HttpResponseMessage} from './http-response-message';
import {JSONPRequestMessage} from './jsonp-request-message';
import {Headers} from './headers';

export class HttpClient {
  constructor(baseUrl = null, defaultRequestHeaders = new Headers()){
    this.baseUrl = baseUrl;
    this.defaultRequestHeaders = defaultRequestHeaders;
  }

  send(requestMessage, progressCallback){
    return requestMessage.send(this, progressCallback);
  }

  get(uri, params){
    let req = new HttpRequestMessage('GET', join(this.baseUrl, uri)).withParams(params).withHeaders(this.defaultRequestHeaders);
    return this.send(req);
  }

  put(uri, opts = {}, replacer = undefined){
    let req = new HttpRequestMessage('PUT', join(this.baseUrl, uri), replacer || this.replacer).withHeaders(this.defaultRequestHeaders);
    if (opts.params) req.withParams(opts.params);
    if (opts.content) req.withContent(opts.content);
    return this.send(req);
  }

  patch(uri, opts = {}, replacer = undefined){
    let req = new HttpRequestMessage('PATCH', join(this.baseUrl, uri), replacer || this.replacer).withHeaders(this.defaultRequestHeaders);
    if (opts.params) req.withParams(opts.params);
    if (opts.content) req.withContent(opts.content);
    return this.send(req);
  }

  post(uri, opts = {}, replacer = undefined){
    let req = new HttpRequestMessage('POST', join(this.baseUrl, uri), replacer || this.replacer).withHeaders(this.defaultRequestHeaders)
    if (opts.params) req.withParams(opts.params);
    if (opts.content) req.withContent(opts.content);
    return this.send(req);
  }

  delete(uri, params){
    return this.send(new HttpRequestMessage('DELETE', join(this.baseUrl, uri)).withParams(params).withHeaders(this.defaultRequestHeaders));
  }

  jsonp(uri, callbackParameterName='jsoncallback'){
    return this.send(new JSONPRequestMessage(join(this.baseUrl, uri), {callbackParameterName, params}));
  }
}