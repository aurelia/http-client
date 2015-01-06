System.register(["./http-response-message"], function (_export) {
  "use strict";

  var HttpResponseMessage, JSONPRequestMessage;
  return {
    setters: [function (_httpResponseMessage) {
      HttpResponseMessage = _httpResponseMessage.HttpResponseMessage;
    }],
    execute: function () {
      JSONPRequestMessage = function JSONPRequestMessage(uri, callbackParameterName) {
        this.uri = uri;
        this.callbackParameterName = callbackParameterName;
      };

      JSONPRequestMessage.prototype.send = function (client) {
        var _this = this;
        return new Promise(function (resolve, reject) {
          var callbackName = "jsonp_callback_" + Math.round(100000 * Math.random());
          var uri = _this.uri + (_this.uri.indexOf("?") >= 0 ? "&" : "?") + _this.callbackParameterName + "=" + callbackName;

          window[callbackName] = function (data) {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve(new HttpResponseMessage(_this, {
              response: data,
              status: 200,
              statusText: "OK"
            }, "jsonp"));
          };

          var script = document.createElement("script");
          script.src = uri;
          document.body.appendChild(script);
        });
      };

      _export("JSONPRequestMessage", JSONPRequestMessage);
    }
  };
});