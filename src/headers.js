export class Headers {
  constructor(headers={}){
    this.headers = headers;
  }

  add(key, value){
    this.headers[key] = value;
  }

  get(key){
    return this.headers[key];
  }

  clear(){
    this.headers = {};
  }

  clone(){
    var headers = {};

    for(var key in this.headers) {
      headers[key] = this.headers[key];
    }

    return new Headers(headers);
  }

  configureXHR(xhr){
    var headers = this.headers, key;

    for(key in headers){
      xhr.setRequestHeader(key, headers[key]);
    }
  }
}
