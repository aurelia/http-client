'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaHttpClient = require('./aurelia-http-client');

Object.keys(_aureliaHttpClient).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaHttpClient[key];
    }
  });
});