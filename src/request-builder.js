import {join} from 'aurelia-path';
import {HttpRequestMessage} from './http-request-message';
import {JSONPRequestMessage} from './jsonp-request-message';

/**
* A builder class allowing fluent composition of HTTP requests.
*
* @class RequestBuilder
* @constructor
*/
export class RequestBuilder {
	constructor (client) {
		this.client = client;
		this.transformers = client.requestTransformers.slice(0);
		this.useJsonp = false;
	}

	/**
	* Adds a user-defined request transformer to the RequestBuilder.
	*
	* @method addHelper
	* @param {String} name The name of the helper to add.
	* @param {Function} fn The helper function.
	* @chainable
	*/
	static addHelper(name, fn){
		RequestBuilder.prototype[name] = function(){
			this.transformers.push(fn.apply(this, arguments));
			return this;
		};
	}

	/**
	* Sends the request.
	*
	* @method send
	* @return {Promise} A cancellable promise object.
	*/
	send(){
		let message = this.useJsonp ? new JSONPRequestMessage() : new HttpRequestMessage();
		return this.client.send(message, this.transformers);
	}
}

RequestBuilder.addHelper('asDelete', function(){
	return function(client, processor, message){
		message.method = 'DELETE';
	};
});

RequestBuilder.addHelper('asGet', function(){
	return function(client, processor, message){
		message.method = 'GET';
	};
});

RequestBuilder.addHelper('asHead', function(){
	return function(client, processor, message){
		message.method = 'HEAD';
	};
});

RequestBuilder.addHelper('asOptions', function(){
	return function(client, processor, message){
		message.method = 'OPTIONS';
	};
});

RequestBuilder.addHelper('asPatch', function(){
	return function(client, processor, message){
		message.method = 'PATCH';
	};
});

RequestBuilder.addHelper('asPost', function(){
	return function(client, processor, message){
		message.method = 'POST';
	};
});

RequestBuilder.addHelper('asPut', function(){
	return function(client, processor, message){
		message.method = 'PUT';
	};
});

RequestBuilder.addHelper('withJsonpParameter', function(jsonpParameterName){
	this.useJsonp = true;
	return function(client, processor, message){
		message.jsonpParameterName =  jsonpParameterName;
	};
});

RequestBuilder.addHelper('withUri', function(uri){
	return function(client, processor, message){
		message.uri = uri;
	};
});

RequestBuilder.addHelper('withContent', function(content){
	return function(client, processor, message){
		message.content = content;
	};
});

RequestBuilder.addHelper('withBaseUrl', function(baseUrl){
	return function(client, processor, message){
		message.baseUrl = baseUrl;
	}
});

RequestBuilder.addHelper('withParams', function(params){
	return function(client, processor, message){
		message.params = params;
	}
});

RequestBuilder.addHelper('withResponseType', function(responseType){
	return function(client, processor, message){
		message.responseType = responseType;
	}
});

RequestBuilder.addHelper('withTimeout', function(timeout){
	return function(client, processor, message){
		message.timeout = timeout;
	}
});

RequestBuilder.addHelper('withHeader', function(key, value){
	return function(client, processor, message){
		message.headers.add(key, value);
	}
});

RequestBuilder.addHelper('withCredentials', function(value){
	return function(client, processor, message){
		message.withCredentials = value;
	}
});

RequestBuilder.addHelper('withReviver', function(reviver){
	return function(client, processor, message){
		message.reviver = reviver;
	}
});

RequestBuilder.addHelper('withReplacer', function(replacer){
	return function(client, processor, message){
		message.replacer = replacer;
	}
});

RequestBuilder.addHelper('withProgressCallback', function(progressCallback){
	return function(client, processor, message){
		message.progressCallback = progressCallback;
	}
});

RequestBuilder.addHelper('withCallbackParameterName', function(callbackParameterName){
	return function(client, processor, message){
		message.callbackParameterName = callbackParameterName;
	}
});
