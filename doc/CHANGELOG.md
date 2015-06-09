### 0.9.1 (2015-06-08)


#### Features

* **http-client:** automatically set the content type for JSON content ([c2768802](http://github.com/aurelia/http-client/commit/c276880205597ddaa76d3d644e10866b0cd1fd26), closes [#39](http://github.com/aurelia/http-client/issues/39))


## 0.9.0 (2015-06-08)


#### Features

* **interceptors:**
  * moved interceptors from client to message ([206d05d7](http://github.com/aurelia/http-client/commit/206d05d7a64b196a46daa14452ca3e017214cc0a))
  * apply all transformers before interceptors ([ee4561c3](http://github.com/aurelia/http-client/commit/ee4561c37b2a6101123aecb4c1ad8490ee05ba59))
  * added support for interceptors ([8ed41762](http://github.com/aurelia/http-client/commit/8ed4176276e604c2334bc4b2d3471ecb8ebfda0f))
* **jsonp:** fail JSONP requests on script load errors ([fc98ecc5](http://github.com/aurelia/http-client/commit/fc98ecc5fcb00c16140b1524ba0a5ba16bb702e7))


### 0.8.1 (2015-05-09)

#### Bug Fixes

* **http-response-message**: fix issue with IE9 not supporting the response property  ([6a2acfe4](http://github.com/aurelia/http-client/commit/6a2acfe44a96ba49557d70b37920f34224980784


## 0.8.0 (2015-04-30)


#### Breaking Changes

* This is a breaking API change to HttpRequestBuilder and HttpRequestMessage. To update, replace uses of `withUri`, `withBaseUri`, and `uri` with `withUrl`, `withBaseUrl`, and `url`, as appropriate.

 ([150a2f72](http://github.com/aurelia/http-client/commit/150a2f721166516d50699ea5da8a074a5792a238))


## 0.7.0 (2015-04-09)


#### Bug Fixes

* **all:** update compiler and fix core-js references ([c0334447](http://github.com/aurelia/http-client/commit/c0334447b4a2f794b0428a54f5e43eebd663780c))


#### Features

* **http-client:** content-type detection ([c60b4727](http://github.com/aurelia/http-client/commit/c60b4727a56a0226cebe28ed91f183d2bfd5dc78))


### 0.6.1 (2015-03-27)


#### Bug Fixes

* **http-client:** abort/cancel  attached to wrong promise instance ([add453c7](http://github.com/aurelia/http-client/commit/add453c79fd7a1fd0e2cb94f6ee49aecac715c64), closes [#32](http://github.com/aurelia/http-client/issues/32))


## 0.6.0 (2015-03-24)


#### Bug Fixes

* **http-client:** rename withJsonpParameter to asJsonp ([c70eedd8](http://github.com/aurelia/http-client/commit/c70eedd83380a0f5ea474f35b4f32a3bd5c40078))
* **request-builder:**
  * incorrect jsonp callback property name ([267ec3ec](http://github.com/aurelia/http-client/commit/267ec3ecd3721583a493653178689a539c873a5d))
  * rename baseUrl to baseUri for consistency ([1fd381e9](http://github.com/aurelia/http-client/commit/1fd381e957b32d9e69966a5b60ed48f0943dcb99))


#### Features

* **http-client:** improve API for creating new requests ([93a6e38a](http://github.com/aurelia/http-client/commit/93a6e38a151b85926d2acf069cfcee0221c6b23b), closes [#27](http://github.com/aurelia/http-client/issues/27))
* **request-builder:** allow message parameters to be fully specified without sending the message ([06d84947](http://github.com/aurelia/http-client/commit/06d84947dd9e3e19028571ce0134639113ce5410), closes [#29](http://github.com/aurelia/http-client/issues/29))


### 0.5.5 (2015-02-28)


#### Bug Fixes

* **package:** change jspm directories ([191dde2d](http://github.com/aurelia/http-client/commit/191dde2d3dbff814f6bfb784acee519f99b3984d))


### 0.5.4 (2015-02-27)


#### Bug Fixes

* **package:** update dependencies ([382e877b](http://github.com/aurelia/http-client/commit/382e877bd7e5f71d22863ab97df0f472db32c7ac))


### 0.5.3 (2015-02-18)


### 0.5.2 (2015-02-12)


#### Bug Fixes

* **event:** switch from hook to event ([01628f42](http://github.com/aurelia/http-client/commit/01628f42884c899ea5b6cc64ac118e5c8f9413c1))


### 0.5.1 (2015-02-12)


#### Bug Fixes

* **http-response-message:** prevent throws on content with unsuccessful requests ([a8a0c3d7](http://github.com/aurelia/http-client/commit/a8a0c3d7df437783f768771981fa327d9bbbd9cd))


## 0.5.0 (2015-02-12)


#### Bug Fixes

* **build:** add missing bower bump ([59e8a734](http://github.com/aurelia/http-client/commit/59e8a734b555440ee26737040778dd18b2189d86))
* **http-response-message:** account for null or undefined response ([63639cf6](http://github.com/aurelia/http-client/commit/63639cf66d6abee4e44d7bfc02d5d4f8a4f5e44f))
* **request-message-processor:** apply transforms after hr.open ([d5893dfd](http://github.com/aurelia/http-client/commit/d5893dfd737b8782bbd2bd7bc9915d01dfe928f2))


#### Features

* **all:**
  * add support for query string building ([3c80d9e0](http://github.com/aurelia/http-client/commit/3c80d9e04ca9cfe56aa48ce53a2616b2fe32f4dc))
  * massive re-design of http client ([f344819f](http://github.com/aurelia/http-client/commit/f344819f9c01ed6a7aba589d5bb56d01b0a832dd))
* **http-client:**
  * add support for options ([8d10c4a1](http://github.com/aurelia/http-client/commit/8d10c4a115c674222c3b7af4870d9511a368a825))
  * add onRequestsComplete event ([dab95e6f](http://github.com/aurelia/http-client/commit/dab95e6fe89a1fd847b2000eb80b6ac4f4c3237b))
  * new client configuration api ([6c1b0e96](http://github.com/aurelia/http-client/commit/6c1b0e9671fb97286545ab6cdd706127b7ba2159))
  * add HttpBuilder API. ([831c45fa](http://github.com/aurelia/http-client/commit/831c45faa3168e71d7abd2a65c6772a25516865e), closes [#4](http://github.com/aurelia/http-client/issues/4))
* **transformers:** handle content via a transformer ([5d3f4c02](http://github.com/aurelia/http-client/commit/5d3f4c02494aafd06418298ba3bf50c2e6307626))


### 0.4.4 (2015-02-03)


#### Bug Fixes

* **all:** errors should still return HttpResponseMessage ([43f3cf4f](http://github.com/aurelia/http-client/commit/43f3cf4ffdd9690bebb99cffe699eacf3477de94))


### 0.4.3 (2015-01-24)


#### Bug Fixes

* **bower:** correct semver ranges ([892535e1](http://github.com/aurelia/http-client/commit/892535e1ecea50c0cabd6fa9be25ebb1249632fd))


### 0.4.2 (2015-01-22)


#### Bug Fixes

* **http-client-spec:** call send method ([7689a195](http://github.com/aurelia/http-client/commit/7689a195e344d0762445f0bfe2fb8b64b0e4790c))
* **http-request-message:** reject on onerror and ontimeout ([e0880c39](http://github.com/aurelia/http-client/commit/e0880c39b1447c054cdf5c908b4e991ad3ed28d3))
* **package:** update dependencies ([3697fb76](http://github.com/aurelia/http-client/commit/3697fb76f9be018823ad2a46d2c9136debd4d401))


### 0.4.1 (2015-01-12)


#### Features

* **http-client:** add http patch method ([77cfc39a](http://github.com/aurelia/http-client/commit/77cfc39a780683d77f29037612bd9d18853a4e98))


## 0.4.0 (2015-01-06)


#### Bug Fixes

* **http-request-message:** do not reject promise; instead return response with isSuccess as false ([561ca9cb](http://github.com/aurelia/http-client/commit/561ca9cbc7f8a445d76c18b26707442e4a4cdf78))


#### Features

* **build:** update compile, switch to register modules, switch to core-js ([68f4665e](http://github.com/aurelia/http-client/commit/68f4665ed69c35a9ecb94b4a661fa753eb30f79b))


### 0.3.2 (2015-01-06)


#### Bug Fixes

* **http-request-message:** do not reject promise; instead return response with isSuccess as false ([561ca9cb](http://github.com/aurelia/http-client/commit/561ca9cbc7f8a445d76c18b26707442e4a4cdf78))


#### Features

* **build:** update compile, switch to register modules, switch to core-js ([68f4665e](http://github.com/aurelia/http-client/commit/68f4665ed69c35a9ecb94b4a661fa753eb30f79b))


### 0.3.1 (2014-12-18)


#### Bug Fixes

* **http-client:** take advantage of fixed path.join behavior ([29ed73a1](http://github.com/aurelia/http-client/commit/29ed73a1f7cc118bc1f9740486081cad270b37c5))
* **package:** update path to the latest version ([0e3eb0a7](http://github.com/aurelia/http-client/commit/0e3eb0a79a63fef5fdafa1d7bb820b25b636eaa9))


## 0.3.0 (2014-12-17)


#### Bug Fixes

* **http-client:** handle empty base url with join ([d1968323](http://github.com/aurelia/http-client/commit/d1968323c557e59bdad46e1a7d43e14941a46089))


## 0.2.0 (2014-12-17)


#### Bug Fixes

* **http-client:** switch http client to use path.join ([6954c4fe](http://github.com/aurelia/http-client/commit/6954c4fe74de49739cdab92e3753f418136d3b7f))
* **package:** update dependencies to latest ([562b00ba](http://github.com/aurelia/http-client/commit/562b00bac62bb46e94d7db9df196d04350ee0f42))


## 0.1.0 (2014-12-11)


#### Bug Fixes

* **package:** add es6-shim polyfill ([bd25426f](http://github.com/aurelia/http-client/commit/bd25426f85c98ee6ad0f24abcd6d666e71c43106))
