# aurelia-http-client

[![npm Version](https://img.shields.io/npm/v/aurelia-http-client.svg)](https://www.npmjs.com/package/aurelia-http-client)
[![ZenHub](https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png)](https://zenhub.io)
[![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![CircleCI](https://circleci.com/gh/aurelia/http-client.svg?style=shield)](https://circleci.com/gh/aurelia/http-client)

This library is part of the [Aurelia](http://www.aurelia.io/) platform and contains a simple, restful, message-based wrapper around XMLHttpRequest.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.aurelia.io/) and [our email list](http://eepurl.com/ces50j). We also invite you to [follow us on twitter](https://twitter.com/aureliaeffect). If you have questions, please [join our community on Gitter](https://gitter.im/aurelia/discuss) or use [stack overflow](http://stackoverflow.com/search?q=aurelia). Documentation can be found [in our developer hub](http://aurelia.io/hub.html). If you would like to have deeper insight into our development process, please install the [ZenHub](https://zenhub.io) Chrome or Firefox Extension and visit any of our repository's boards.

## Documentation

If possible, prefer to use the `aurelia-fetch-client` instead of this library. You can read documentation on the fetch client [here](http://aurelia.io/hub.html#/doc/article/aurelia/fetch-client/latest/http-services/3) along with documentation on this library. If you would like to help improve this documentation, the source for these docs can be found in the `aurelia-fetch-client` repo's doc folder.

## Platform Support

This library can be used in the **browser** only.

## Documentaion

[English](https://github.com/aurelia/documentation/blob/master/English/docs.md#http-client), [Japanese](https://github.com/aurelia/documentation/blob/master/Japanese/docs.md#http-client), [Spanish](https://github.com/aurelia/documentation/blob/master/Spanish/docs.md#http-client)

## Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
4. To build the code, you can now run:

  ```shell
  gulp build
  ```
5. You will find the compiled code in the `dist` folder, available in three module formats: AMD, CommonJS and ES6.

6. See `gulpfile.js` for other tasks related to generating the docs and linting.

## Running The Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:

  ```shell
  npm install -g karma-cli
  ```
2. Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following commnand:

  ```shell
  npm install -g jspm
  ```
3. Install the client-side dependencies with jspm:

  ```shell
  jspm install
  ```

4. You can now run the tests with this command:

  ```shell
  karma start
  ```
