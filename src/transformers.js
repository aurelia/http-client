import {join, buildQueryString} from 'aurelia-path';

export function uriTransformer(client, processor, message, xhr){
  var uri = join(message.baseUrl, message.uri),
      qs;

  if(message.params){
    qs = buildQueryString(message.params);
    uri = qs ? `${uri}?${qs}` : uri;
  }

  message.fullUri = uri;
}

export function timeoutTransformer(client, processor, message, xhr){
  if(message.timeout !== undefined){
    xhr.timeout = message.timeout;
  }
}

export function callbackParameterNameTransformer(client, processor, message, xhr){
  if(message.callbackParameterName !== undefined){
    xhr.callbackParameterName = message.callbackParameterName;
  }
}

export function credentialsTransformer(client, processor, message, xhr){
  if(message.withCredentials !== undefined){
    xhr.withCredentials = message.withCredentials;
  }
}

export function progressTransformer(client, processor, message, xhr){
  if(message.progressCallback){
    xhr.upload.onprogress = message.progressCallback;
  }
}

export function responseTypeTransformer(client, processor, message, xhr){
  var responseType = message.responseType;

  if(responseType === 'json'){
    responseType = 'text'; //IE does not support json
  }

  xhr.responseType = responseType;
}

export function headerTransformer(client, processor, message, xhr){
  message.headers.configureXHR(xhr);
}
