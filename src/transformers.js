import {join, buildQueryString} from 'aurelia-path';

export function uriTransformer(client, processor, message, xhr){
  var uri = join(message.baseUrl || client.baseUrl, message.uri),
      qs;

  if(message.params){
    qs = buildQueryString(message.params);
    uri = qs ? `${uri}?${qs}` : uri;
  }

  message.fullUri = uri;
}

export function timeoutTransformer(client, processor, message, xhr){
  var timeout = message.timeout || client.timeout;
  if(timeout !== undefined){
    xhr.timeout = timeout;
  }
}

export function callbackParameterNameTransformer(client, processor, message, xhr){
  var callbackParameterName = message.callbackParameterName || client.callbackParameterName;
  if(callbackParameterName !== undefined){
    xhr.callbackParameterName = callbackParameterName;
  }
}

export function credentialsTransformer(client, processor, message, xhr){
  var withCredentials = message.withCredentials || client.withCredentials;
  if(withCredentials !== undefined){
    xhr.withCredentials = withCredentials;
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
