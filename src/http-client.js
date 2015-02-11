import {Headers} from './headers';
import {RequestBuilder} from './request-builder';
import {HttpRequestMessage,HttpRequestMessageProcessor} from './http-request-message';
import {JSONPRequestMessage,JSONPRequestMessageProcessor} from './jsonp-request-message';

function trackRequestStart(client, processor){
  client.requests.push(processor);
  client.isRequesting = true;
}

function trackRequestEnd(client, processor){
  var index = client.requests.indexOf(processor);

  client.requests.splice(index, 1);
  client.isRequesting = client.requests.length > 0;

  if(!client.isRequesting){
    //TODO: raise an event indicating all requests are done
  }
}

export class HttpClient {
  constructor(){
    this.requestTransformers = [];
    this.requestProcessors = new Map();
    this.requestProcessors.set(HttpRequestMessage, HttpRequestMessageProcessor);
    this.requestProcessors.set(JSONPRequestMessage, JSONPRequestMessageProcessor);
    this.requests = [];
    this.isRequesting = false;
  }

  get request(){
    return new RequestBuilder(this);
  }

  configure(fn){
    var builder = new RequestBuilder(this);
    fn(builder);
    this.requestTransformers = builder.transformers;
    return this;
  }

  send(message, transformers){
    var ProcessorType = this.requestProcessors.get(message.constructor),
        processor, promise;

    if(!ProcessorType){
        throw new Error(`No request message processor for ${message.constructor}.`);
    }

    processor = new ProcessorType();
    trackRequestStart(this, processor);
    (transformers || this.requestTransformers).forEach(x => x(this, processor, message));
    promise = processor.process(this, message);

    promise.abort = promise.cancel = function() {
      processor.abort();
    };

    return promise.then(response => {
      trackRequestEnd(this, processor);
      return response;
    }).catch(response => {
      trackRequestEnd(this, processor);
      throw response;
    });
  }

  delete(uri){
    return this.request.delete(uri);
  }

  get(uri){
    return this.request.get(uri);
  }

  head(uri){
    return this.request.head(uri);
  }

  put(uri, content){
    return this.request.put(uri, content);
  }

  patch(uri, content){
    return this.request.patch(uri, content);
  }

  post(uri, content){
    return this.request.post(uri, content);
  }

  jsonp(uri, callbackParameterName='jsoncallback'){
    return this.request.jsonp(uri, callbackParameterName);
  }
}
