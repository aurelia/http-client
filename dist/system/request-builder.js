System.register(["aurelia-path", "./http-request-message", "./jsonp-request-message"], function (_export) {
	var join, HttpRequestMessage, JSONPRequestMessage, _prototypeProperties, _classCallCheck, RequestBuilder;

	return {
		setters: [function (_aureliaPath) {
			join = _aureliaPath.join;
		}, function (_httpRequestMessage) {
			HttpRequestMessage = _httpRequestMessage.HttpRequestMessage;
		}, function (_jsonpRequestMessage) {
			JSONPRequestMessage = _jsonpRequestMessage.JSONPRequestMessage;
		}],
		execute: function () {
			"use strict";

			_prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

			_classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

			/**
   * A builder class allowing fluent composition of HTTP requests.
   *
   * @class RequestBuilder
   * @constructor
   */
			RequestBuilder = _export("RequestBuilder", (function () {
				function RequestBuilder(client) {
					_classCallCheck(this, RequestBuilder);

					this.client = client;
					this.transformers = client.requestTransformers.slice(0);
					this.useJsonp = false;
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
					send: {

						/**
      * Sends the request.
      *
      * @method send
      * @return {Promise} A cancellable promise object.
      */

						value: function send() {
							var message = this.useJsonp ? new JSONPRequestMessage() : new HttpRequestMessage();
							return this.client.send(message, this.transformers);
						},
						writable: true,
						configurable: true
					}
				});

				return RequestBuilder;
			})());

			RequestBuilder.addHelper("asDelete", function () {
				return function (client, processor, message) {
					message.method = "DELETE";
				};
			});

			RequestBuilder.addHelper("asGet", function () {
				return function (client, processor, message) {
					message.method = "GET";
				};
			});

			RequestBuilder.addHelper("asHead", function () {
				return function (client, processor, message) {
					message.method = "HEAD";
				};
			});

			RequestBuilder.addHelper("asOptions", function () {
				return function (client, processor, message) {
					message.method = "OPTIONS";
				};
			});

			RequestBuilder.addHelper("asPatch", function () {
				return function (client, processor, message) {
					message.method = "PATCH";
				};
			});

			RequestBuilder.addHelper("asPost", function () {
				return function (client, processor, message) {
					message.method = "POST";
				};
			});

			RequestBuilder.addHelper("asPut", function () {
				return function (client, processor, message) {
					message.method = "PUT";
				};
			});

			RequestBuilder.addHelper("asJsonp", function (callbackParameterName) {
				this.useJsonp = true;
				return function (client, processor, message) {
					message.callbackParameterName = callbackParameterName;
				};
			});

			RequestBuilder.addHelper("withUri", function (uri) {
				return function (client, processor, message) {
					message.uri = uri;
				};
			});

			RequestBuilder.addHelper("withContent", function (content) {
				return function (client, processor, message) {
					message.content = content;
				};
			});

			RequestBuilder.addHelper("withBaseUri", function (baseUri) {
				return function (client, processor, message) {
					message.baseUri = baseUri;
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
		}
	};
});