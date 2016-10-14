## 1.0.2

### Bug Fixes

* **headers:** #152 - Made header treatment case insensitive

<a name="1.0.1"></a>
## [1.0.1](https://github.com/aurelia/http-client/compare/1.0.0...v1.0.1) (2016-10-06)


### Bug Fixes

* Add responseType field in HttpResponseMessage ([2c0f437](https://github.com/aurelia/http-client/commit/2c0f437)), closes [#149](https://github.com/aurelia/http-client/issues/149)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/aurelia/http-client/compare/1.0.0-rc.1.0.1...v1.0.0) (2016-07-27)


### Bug Fixes

* **request-message-processor:** do not send undefined message.content ([ede329f](https://github.com/aurelia/http-client/commit/ede329f))



<a name="1.0.0-rc.1.0.1"></a>
# [1.0.0-rc.1.0.1](https://github.com/aurelia/http-client/compare/1.0.0-rc.1.0.0...v1.0.0-rc.1.0.1) (2016-07-12)



<a name="1.0.0-rc.1.0.0"></a>
# [1.0.0-rc.1.0.0](https://github.com/aurelia/http-client/compare/1.0.0-beta.2.0.1...v1.0.0-rc.1.0.0) (2016-06-22)



### 1.0.0-beta.1.2.2 (2016-05-24)


### 1.0.0-beta.1.2.1 (2016-05-10)


### 1.0.0-beta.1.2.0 (2016-03-22)

* Update to Babel 6

### 1.0.0-beta.1.1.2 (2016-03-01)


#### Bug Fixes

* **all:** remove core-js dependency ([9fbd7413](http://github.com/aurelia/http-client/commit/9fbd7413058b53c2b98e51b952e869ca0b1c4b26))
* **http-client:** declare replacer property ([0080eaae](http://github.com/aurelia/http-client/commit/0080eaae426073a065bbf5f3d87b05f225c2a65c))


### 1.0.0-beta.1.1.1 (2016-02-08)


#### Bug Fixes

* **http-response:** status code type ([2afe081e](http://github.com/aurelia/http-client/commit/2afe081e36bfbaedab1541291cfd4ea492b69ca8), closes [#114](http://github.com/aurelia/http-client/issues/114))


## 1.0.0-beta.1.1.0 (2016-01-29)


#### Features

* **package:** update metadata for jspm; core-js; deps ([9b0e4272](http://github.com/aurelia/http-client/commit/9b0e4272ac4b784642d49aba87f206a949023868))


### 1.0.0-beta.1.0.1 (2016-01-08)

#### Bug Fixes

* **http-client:** declare headers property ([e64dba37](http://github.com/aurelia/http-client/commit/e64dba37c9539091fcc0e71a07e49aec60dda53f))


### 1.0.0-beta.1 (2015-11-16)


## 0.13.0 (2015-11-09)


#### Features

* **headers:** case-insensitve has ([494918d5](http://github.com/aurelia/http-client/commit/494918d54784ee0c214e21f60546c17a533f9bcf), closes [#92](http://github.com/aurelia/http-client/issues/92))
* **request-builder:** enable opening xhr with login info ([a9adff68](http://github.com/aurelia/http-client/commit/a9adff68a58813bd24c2f35b465929a2bc469ebc), closes [#52](http://github.com/aurelia/http-client/issues/52))


## 0.12.0 (2015-10-13)


#### Bug Fixes

* ***:** switch http client to use path.join ([6954c4fe](http://github.com/aurelia/http-client/commit/6954c4fe74de49739cdab92e3753f418136d3b7f))
* **all:**
  * add types for promises of send methods ([1911331d](http://github.com/aurelia/http-client/commit/1911331de6ca0325ceedcbff2db7a160110d0595))
  * update compiler and fix core-js references ([c0334447](http://github.com/aurelia/http-client/commit/c0334447b4a2f794b0428a54f5e43eebd663780c))
  * errors should still return HttpResponseMessage ([43f3cf4f](http://github.com/aurelia/http-client/commit/43f3cf4ffdd9690bebb99cffe699eacf3477de94))
* **bower:** correct semver ranges ([892535e1](http://github.com/aurelia/http-client/commit/892535e1ecea50c0cabd6fa9be25ebb1249632fd))
* **build:**
  * update linting, testing and tools ([f808d92c](http://github.com/aurelia/http-client/commit/f808d92c5140e60783f298dac1a8552048bb47dc))
  * correct order of files for concat ([5a6418de](http://github.com/aurelia/http-client/commit/5a6418de752733167dca716bb5aefac682286de4))
  * add missing bower bump ([59e8a734](http://github.com/aurelia/http-client/commit/59e8a734b555440ee26737040778dd18b2189d86))
* **event:** switch from hook to event ([01628f42](http://github.com/aurelia/http-client/commit/01628f42884c899ea5b6cc64ac118e5c8f9413c1))
* **http-client:**
  * Use correct import for core-js We were previously using `import core from core-j ([694fe35c](http://github.com/aurelia/http-client/commit/694fe35cc010623855be565ac550ce2d2dc147bc))
  * abort/cancel  attached to wrong promise instance ([add453c7](http://github.com/aurelia/http-client/commit/add453c79fd7a1fd0e2cb94f6ee49aecac715c64), closes [#32](http://github.com/aurelia/http-client/issues/32))
  * rename withJsonpParameter to asJsonp ([c70eedd8](http://github.com/aurelia/http-client/commit/c70eedd83380a0f5ea474f35b4f32a3bd5c40078))
  * take advantage of fixed path.join behavior ([29ed73a1](http://github.com/aurelia/http-client/commit/29ed73a1f7cc118bc1f9740486081cad270b37c5))
  * handle empty base url with join ([d1968323](http://github.com/aurelia/http-client/commit/d1968323c557e59bdad46e1a7d43e14941a46089))
* **http-client-spec:** call send method ([7689a195](http://github.com/aurelia/http-client/commit/7689a195e344d0762445f0bfe2fb8b64b0e4790c))
* **http-request-message:**
  * reject on onerror and ontimeout ([e0880c39](http://github.com/aurelia/http-client/commit/e0880c39b1447c054cdf5c908b4e991ad3ed28d3))
  * do not reject promise; instead return response with isSuccess as false ([561ca9cb](http://github.com/aurelia/http-client/commit/561ca9cbc7f8a445d76c18b26707442e4a4cdf78))
* **http-response-message:**
  * prevent throws on content with unsuccessful requests ([a8a0c3d7](http://github.com/aurelia/http-client/commit/a8a0c3d7df437783f768771981fa327d9bbbd9cd))
  * account for null or undefined response ([63639cf6](http://github.com/aurelia/http-client/commit/63639cf66d6abee4e44d7bfc02d5d4f8a4f5e44f))
* **package:**
  * update aurelia tools and dts generator ([2704444f](http://github.com/aurelia/http-client/commit/2704444ffe3a0f09db9bd9a1cbc1cad37a4647ec))
  * change jspm directories ([191dde2d](http://github.com/aurelia/http-client/commit/191dde2d3dbff814f6bfb784acee519f99b3984d))
  * update dependencies ([382e877b](http://github.com/aurelia/http-client/commit/382e877bd7e5f71d22863ab97df0f472db32c7ac))
  * update dependencies ([3697fb76](http://github.com/aurelia/http-client/commit/3697fb76f9be018823ad2a46d2c9136debd4d401))
  * update path to the latest version ([0e3eb0a7](http://github.com/aurelia/http-client/commit/0e3eb0a79a63fef5fdafa1d7bb820b25b636eaa9))
  * update dependencies to latest ([562b00ba](http://github.com/aurelia/http-client/commit/562b00bac62bb46e94d7db9df196d04350ee0f42))
  * add es6-shim polyfill ([bd25426f](http://github.com/aurelia/http-client/commit/bd25426f85c98ee6ad0f24abcd6d666e71c43106))
* **processor:** modify processor to apply xhr transformers after running request interceptors ([8b515859](http://github.com/aurelia/http-client/commit/8b51585984190b8d9e625469a87c814b8b80dd49), closes [#60](http://github.com/aurelia/http-client/issues/60))
* **request-builder:**
  * incorrect jsonp callback property name ([267ec3ec](http://github.com/aurelia/http-client/commit/267ec3ecd3721583a493653178689a539c873a5d))
  * rename baseUrl to baseUri for consistency ([1fd381e9](http://github.com/aurelia/http-client/commit/1fd381e957b32d9e69966a5b60ed48f0943dcb99))
* **request-message-processor:** apply transforms after hr.open ([d5893dfd](http://github.com/aurelia/http-client/commit/d5893dfd737b8782bbd2bd7bc9915d01dfe928f2))


#### Features

* **all:**
  * update to use PAL ([f289d14c](http://github.com/aurelia/http-client/commit/f289d14c2afea90f1a7513f446d3a5c2db984dbc))
  * improvements to type info ([bad7bb5b](http://github.com/aurelia/http-client/commit/bad7bb5bf6026046f9b900e4bda9d4c085b783b1))
  * more type info added ([d7775b87](http://github.com/aurelia/http-client/commit/d7775b87704a6f6b188ec14befc2eddc05af37b5))
  * add support for query string building ([3c80d9e0](http://github.com/aurelia/http-client/commit/3c80d9e04ca9cfe56aa48ce53a2616b2fe32f4dc))
  * massive re-design of http client ([f344819f](http://github.com/aurelia/http-client/commit/f344819f9c01ed6a7aba589d5bb56d01b0a832dd))
* **build:** update compile, switch to register modules, switch to core-js ([68f4665e](http://github.com/aurelia/http-client/commit/68f4665ed69c35a9ecb94b4a661fa753eb30f79b))
* **docs:** generate api.json from .d.ts file ([9ef8112d](http://github.com/aurelia/http-client/commit/9ef8112ded6a2a94712d30b296ba84d6832cb95b))
* **http-client:**
  * improve type information on HttpClient.configure ([a7dd0cf6](http://github.com/aurelia/http-client/commit/a7dd0cf6d4accb3c193fb4539d63e0ae3eba606f))
  * ignore baseUrl when using absolute URLs ([ab4d2666](http://github.com/aurelia/http-client/commit/ab4d266647b24a6a61087daa5127ddfb2fb9c71b))
  * automatically set the content type for JSON content ([c2768802](http://github.com/aurelia/http-client/commit/c276880205597ddaa76d3d644e10866b0cd1fd26), closes [#39](http://github.com/aurelia/http-client/issues/39))
  * content-type detection ([c60b4727](http://github.com/aurelia/http-client/commit/c60b4727a56a0226cebe28ed91f183d2bfd5dc78))
  * improve API for creating new requests ([93a6e38a](http://github.com/aurelia/http-client/commit/93a6e38a151b85926d2acf069cfcee0221c6b23b), closes [#27](http://github.com/aurelia/http-client/issues/27))
  * add support for options ([8d10c4a1](http://github.com/aurelia/http-client/commit/8d10c4a115c674222c3b7af4870d9511a368a825))
  * add onRequestsComplete event ([dab95e6f](http://github.com/aurelia/http-client/commit/dab95e6fe89a1fd847b2000eb80b6ac4f4c3237b))
  * new client configuration api ([6c1b0e96](http://github.com/aurelia/http-client/commit/6c1b0e9671fb97286545ab6cdd706127b7ba2159))
  * add HttpBuilder API. ([831c45fa](http://github.com/aurelia/http-client/commit/831c45faa3168e71d7abd2a65c6772a25516865e), closes [#4](http://github.com/aurelia/http-client/issues/4))
  * add http patch method ([77cfc39a](http://github.com/aurelia/http-client/commit/77cfc39a780683d77f29037612bd9d18853a4e98))
* **interceptors:**
  * moved interceptors from client to message ([206d05d7](http://github.com/aurelia/http-client/commit/206d05d7a64b196a46daa14452ca3e017214cc0a))
  * apply all transformers before interceptors ([ee4561c3](http://github.com/aurelia/http-client/commit/ee4561c37b2a6101123aecb4c1ad8490ee05ba59))
  * added support for interceptors ([8ed41762](http://github.com/aurelia/http-client/commit/8ed4176276e604c2334bc4b2d3471ecb8ebfda0f))
* **jsonp:** fail JSONP requests on script load errors ([fc98ecc5](http://github.com/aurelia/http-client/commit/fc98ecc5fcb00c16140b1524ba0a5ba16bb702e7))
* **request-builder:** allow message parameters to be fully specified without sending the message ([06d84947](http://github.com/aurelia/http-client/commit/06d84947dd9e3e19028571ce0134639113ce5410), closes [#29](http://github.com/aurelia/http-client/issues/29))
* **transformers:** handle content via a transformer ([5d3f4c02](http://github.com/aurelia/http-client/commit/5d3f4c02494aafd06418298ba3bf50c2e6307626))
* **type annotation:**
  * added type info ([14eab7fd](http://github.com/aurelia/http-client/commit/14eab7fdc6de5b4a361e1babbfe445636b1e319f))
  * added type info ([7a468549](http://github.com/aurelia/http-client/commit/7a468549f566fdd12fc81d7f12ecee394ac370a6))
  * added type info ([1608675d](http://github.com/aurelia/http-client/commit/1608675d086c069da63e35545ddf1826cc958dbf))
  * added type info ([2c59d7bb](http://github.com/aurelia/http-client/commit/2c59d7bb49cd9f4305b200e019a192250ccf270a))
  * added type info ([496f4003](http://github.com/aurelia/http-client/commit/496f4003da642486e6c74689e0fff390d541ad0d))


#### Breaking Changes

* This is a breaking API change to HttpRequestBuilder and HttpRequestMessage. To update, replace uses of `withUri`, `withBaseUri`, and `uri` with `withUrl`, `withBaseUrl`, and `url`, as appropriate.

 ([150a2f72](http://github.com/aurelia/http-client/commit/150a2f721166516d50699ea5da8a074a5792a238))


## 0.11.0 (2015-09-04)


#### Bug Fixes

* **build:** update linting, testing and tools ([f808d92c](http://github.com/aurelia/http-client/commit/f808d92c5140e60783f298dac1a8552048bb47dc))


#### Features

* **docs:** generate api.json from .d.ts file ([9ef8112d](http://github.com/aurelia/http-client/commit/9ef8112ded6a2a94712d30b296ba84d6832cb95b))
* **type annotation:** added type info ([14eab7fd](http://github.com/aurelia/http-client/commit/14eab7fdc6de5b4a361e1babbfe445636b1e319f))


### 0.10.3 (2015-08-14)


#### Bug Fixes

* **http-client:** Use correct import for core-js We were previously using `import core from core-j ([694fe35c](http://github.com/aurelia/http-client/commit/694fe35cc010623855be565ac550ce2d2dc147bc))


#### Features

* **all:**
  * improvements to type info ([bad7bb5b](http://github.com/aurelia/http-client/commit/bad7bb5bf6026046f9b900e4bda9d4c085b783b1))
  * more type info added ([d7775b87](http://github.com/aurelia/http-client/commit/d7775b87704a6f6b188ec14befc2eddc05af37b5))
* **type annotation:**
  * added type info ([7a468549](http://github.com/aurelia/http-client/commit/7a468549f566fdd12fc81d7f12ecee394ac370a6))
  * added type info ([1608675d](http://github.com/aurelia/http-client/commit/1608675d086c069da63e35545ddf1826cc958dbf))
  * added type info ([2c59d7bb](http://github.com/aurelia/http-client/commit/2c59d7bb49cd9f4305b200e019a192250ccf270a))
  * added type info ([496f4003](http://github.com/aurelia/http-client/commit/496f4003da642486e6c74689e0fff390d541ad0d))


### 0.10.2 (2015-07-29)


#### Bug Fixes

* **build:** correct order of files for concat ([5a6418de](http://github.com/aurelia/http-client/commit/5a6418de752733167dca716bb5aefac682286de4))


### 0.10.1 (2015-07-29)


#### Bug Fixes

* **processor:** modify processor to apply xhr transformers after running request interceptors ([8b515859](http://github.com/aurelia/http-client/commit/8b51585984190b8d9e625469a87c814b8b80dd49), closes [#60](http://github.com/aurelia/http-client/issues/60))


## 0.10.0 (2015-07-01)


#### Bug Fixes

* **package:** update aurelia tools and dts generator ([2704444f](http://github.com/aurelia/http-client/commit/2704444ffe3a0f09db9bd9a1cbc1cad37a4647ec))


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
