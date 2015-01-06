"use strict";

var Headers = require("./headers").Headers;
var HttpResponseMessage = require("./http-response-message").HttpResponseMessage;
var HttpRequestMessage = function HttpRequestMessage(method, uri, content, replacer) {
  this.method = method;
  this.uri = uri;
  this.content = content;
  this.headers = new Headers();
  this.responseType = "json";
  this.replacer = replacer;
};

HttpRequestMessage.prototype.withHeaders = function (headers) {
  this.headers = headers;
  return this;
};

HttpRequestMessage.prototype.configureXHR = function (xhr) {
  xhr.open(this.method, this.uri, true);
  xhr.responseType = this.responseType;
  this.headers.configureXHR(xhr);
};

HttpRequestMessage.prototype.formatContent = function () {
  var content = this.content;

  if (window.FormData && content instanceof FormData) {
    return content;
  }

  if (window.Blob && content instanceof Blob) {
    return content;
  }

  if (window.ArrayBufferView && content instanceof ArrayBufferView) {
    return content;
  }

  if (content instanceof Document) {
    return content;
  }

  if (typeof content === "string") {
    return content;
  }

  return JSON.stringify(content, this.replacer);
};

HttpRequestMessage.prototype.send = function (client, progressCallback) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest(), responseType = _this.responseType;

    if (responseType === "json") {
      _this.responseType = "text";
    }

    if (client.timeout !== undefined) {
      xhr.timeout = client.timeout;
    }

    _this.configureXHR(xhr);

    xhr.onload = function (e) {
      resolve(new HttpResponseMessage(_this, xhr, responseType, client.reviver));
    };

    xhr.ontimeout = function (e) {
      resolve(new HttpResponseMessage(this, xhr, responseType));
    };

    xhr.onerror = function (e) {
      resolve(new HttpResponseMessage(this, xhr, responseType));
    };

    if (progressCallback) {
      xhr.upload.onprogress = progressCallback;
    }

    xhr.send(_this.formatContent());
  });
};

exports.HttpRequestMessage = HttpRequestMessage;