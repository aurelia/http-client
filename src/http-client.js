import {Headers} from './headers';
import {HttpBuilder} from './http-builder';

export class HttpClient {
  constructor(baseUrl = null, defaultRequestHeaders = new Headers()){
    this.request = () => new HttpBuilder(baseUrl, defaultRequestHeaders);
    
    this.send = (...args) => {
        var builder = this.request();
        return builder.send.call(builder, ...args);
    };

    
    this.get = (...args) => {
        var builder = this.request();
        return builder.get.call(builder, ...args);
    };
    
    this.put = (...args) => {
        var builder = this.request();
        return builder.put.call(builder, ...args);
    };
   
    this.patch = (...args) => {
        var builder = this.request();
        return builder.patch.call(builder, ...args);
    };
    
    this.post = (...args) => {
        var builder = this.request();
        return builder.post.call(builder, ...args);
    };
    
    this.delete = (...args) => {
        var builder = this.request();
        return builder.delete.call(builder, ...args);
    };
    
    this.jsonp = (...args) => {
        var builder = this.request();
        return builder.jsonp.call(builder, ...args);
    };
  }
}