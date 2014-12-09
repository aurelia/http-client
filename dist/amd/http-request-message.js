define(["exports", "./headers", "./http-response-message"], function (exports, _headers, _httpResponseMessage) {
  "use strict";

  var Headers = _headers.Headers;
  var HttpResponseMessage = _httpResponseMessage.HttpResponseMessage;
  var HttpRequestMessage = (function () {
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
          var responseMessage = new HttpResponseMessage(_this, xhr, responseType, client.reviver);

          if (responseMessage.isSuccess) {
            resolve(responseMessage);
          } else {
            reject(responseMessage);
          }
        };

        xhr.ontimeout = function (e) {
          reject(new HttpResponseMessage(this, xhr, responseType));
        };

        xhr.onerror = function (e) {
          reject(new HttpResponseMessage(this, xhr, responseType));
        };

        if (progressCallback) {
          xhr.upload.onprogress = progressCallback;
        }

        xhr.send(_this.formatContent());
      });
    };

    return HttpRequestMessage;
  })();

  exports.HttpRequestMessage = HttpRequestMessage;
});