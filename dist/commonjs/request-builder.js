"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var join = require("aurelia-path").join;

var HttpRequestMessage = require("./http-request-message").HttpRequestMessage;

var JSONPRequestMessage = require("./jsonp-request-message").JSONPRequestMessage;

/**
* A builder class allowing fluent composition of HTTP requests.
*
* @class RequestBuilder
* @constructor
*/

var RequestBuilder = exports.RequestBuilder = (function () {
	function RequestBuilder(client) {
		_classCallCheck(this, RequestBuilder);

		this.client = client;
		this.transformers = client.requestTransformers.slice(0);
	}

	_prototypeProperties(RequestBuilder, {
		addHelper: {

			/**
   * Adds a user-defined request transformer to the RequestBuilder.
   *
   * @method addHelper
   * @param {String} name The name of the helper to add.
   * @param {Function} fn The helper function.
   * @chainable
   */

			value: function addHelper(name, fn) {
				RequestBuilder.prototype[name] = function () {
					this.transformers.push(fn.apply(this, arguments));
					return this;
				};
			},
			writable: true,
			configurable: true
		}
	}, {
		"delete": {

			/**
   * Sends an HTTP DELETE request.
   *
   * @method delete
   * @param {String} uri The target URI.
   * @return {Promise} A cancellable promise object.
   */

			value: function _delete(uri) {
				var message = new HttpRequestMessage("DELETE", uri);
				return this.client.send(message, this.transformers);
			},
			writable: true,
			configurable: true
		},
		get: {

			/**
   * Sends an HTTP GET request.
   *
   * @method get
   * @param {String} uri The target URI.
   * @return {Promise} A cancellable promise object.
   */

			value: function get(uri) {
				var message = new HttpRequestMessage("GET", uri);
				return this.client.send(message, this.transformers);
			},
			writable: true,
			configurable: true
		},
		head: {

			/**
   * Sends an HTTP HEAD request.
   *
   * @method head
   * @param {String} uri The target URI.
   * @return {Promise} A cancellable promise object.
   */

			value: function head(uri) {
				var message = new HttpRequestMessage("HEAD", uri);
				return this.client.send(message, this.transformers);
			},
			writable: true,
			configurable: true
		},
		jsonp: {

			/**
   * Sends a JSONP request.
   *
   * @method jsonp
   * @param {String} uri The target URI.
   * @param {String} [callbackParameterName=jsoncallback] The target Javascript expression to invoke.
   * @return {Promise} A cancellable promise object.
   */

			value: function jsonp(uri) {
				var callbackParameterName = arguments[1] === undefined ? "jsoncallback" : arguments[1];

				var message = new JSONPRequestMessage(uri, callbackParameterName);
				return this.client.send(message, this.transformers);
			},
			writable: true,
			configurable: true
		},
		options: {

			/**
   * Sends an HTTP OPTIONS request.
   *
   * @method options
   * @param {String} uri The target URI.
   * @return {Promise} A cancellable promise object.
   */

			value: function options(uri) {
				var message = new HttpRequestMessage("OPTIONS", uri);
				return this.client.send(message, this.transformers);
			},
			writable: true,
			configurable: true
		},
		put: {

			/**
   * Sends an HTTP PUT request.
   *
   * @method put
   * @param {String} uri The target URI.
   * @param {Object} uri The request payload.
   * @return {Promise} A cancellable promise object.
   */

			value: function put(uri, content) {
				var message = new HttpRequestMessage("PUT", uri, content);
				return this.client.send(message, this.transformers);
			},
			writable: true,
			configurable: true
		},
		patch: {

			/**
   * Sends an HTTP PATCH request.
   *
   * @method patch
   * @param {String} uri The target URI.
   * @param {Object} uri The request payload.
   * @return {Promise} A cancellable promise object.
   */

			value: function patch(uri, content) {
				var message = new HttpRequestMessage("PATCH", uri, content);
				return this.client.send(message, this.transformers);
			},
			writable: true,
			configurable: true
		},
		post: {

			/**
   * Sends an HTTP POST request.
   *
   * @method post
   * @param {String} uri The target URI.
   * @param {Object} uri The request payload.
   * @return {Promise} A cancellable promise object.
   */

			value: function post(uri, content) {
				var message = new HttpRequestMessage("POST", uri, content);
				return this.client.send(message, this.transformers);
			},
			writable: true,
			configurable: true
		}
	});

	return RequestBuilder;
})();

RequestBuilder.addHelper("withBaseUrl", function (baseUrl) {
	return function (client, processor, message) {
		message.baseUrl = baseUrl;
	};
});

RequestBuilder.addHelper("withParams", function (params) {
	return function (client, processor, message) {
		message.params = params;
	};
});

RequestBuilder.addHelper("withResponseType", function (responseType) {
	return function (client, processor, message) {
		message.responseType = responseType;
	};
});

RequestBuilder.addHelper("withTimeout", function (timeout) {
	return function (client, processor, message) {
		message.timeout = timeout;
	};
});

RequestBuilder.addHelper("withHeader", function (key, value) {
	return function (client, processor, message) {
		message.headers.add(key, value);
	};
});

RequestBuilder.addHelper("withCredentials", function (value) {
	return function (client, processor, message) {
		message.withCredentials = value;
	};
});

RequestBuilder.addHelper("withReviver", function (reviver) {
	return function (client, processor, message) {
		message.reviver = reviver;
	};
});

RequestBuilder.addHelper("withReplacer", function (replacer) {
	return function (client, processor, message) {
		message.replacer = replacer;
	};
});

RequestBuilder.addHelper("withProgressCallback", function (progressCallback) {
	return function (client, processor, message) {
		message.progressCallback = progressCallback;
	};
});

RequestBuilder.addHelper("withCallbackParameterName", function (callbackParameterName) {
	return function (client, processor, message) {
		message.callbackParameterName = callbackParameterName;
	};
});
Object.defineProperty(exports, "__esModule", {
	value: true
});