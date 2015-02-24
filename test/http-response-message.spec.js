import {HttpResponseMessage} from '../src/http-response-message';
import {Headers} from '../src/headers';

describe("HttpResponseMessage", () => {

  describe("constructor", () => {
    it("should have a isSuccess defined by the xhr.status", () => {
      //1xx informal
      expect(new HttpResponseMessage({}, {status: 100}).isSuccess).toBeFalsy();
      expect(new HttpResponseMessage({}, {status: 199}).isSuccess).toBeFalsy();

      //2xx success
      expect(new HttpResponseMessage({}, {status: 200}).isSuccess).toBeTruthy();
      expect(new HttpResponseMessage({}, {status: 299}).isSuccess).toBeTruthy();

      //3xx redirection
      expect(new HttpResponseMessage({}, {status: 300}).isSuccess).toBeTruthy();
      expect(new HttpResponseMessage({}, {status: 399}).isSuccess).toBeTruthy();

      //4xx client error
      expect(new HttpResponseMessage({}, {status: 400}).isSuccess).toBeFalsy();
      expect(new HttpResponseMessage({}, {status: 499}).isSuccess).toBeFalsy();

      //5xx server error
      expect(new HttpResponseMessage({}, {status: 400}).isSuccess).toBeFalsy();
      expect(new HttpResponseMessage({}, {status: 499}).isSuccess).toBeFalsy();
    });

    //This may seem superfluous but it's surprising how many bugs stem from constructors no longer working as expected
    it("have the xhr.status, xhr.response, xhr.statusText, responseType, reviver and headers as fields", () => {
      //Everything that can be an object is set to one for reference checking
      let xhr = {status: 200, response: {}, statusText: {}};
      let responseType = {}, reviver = {}, requestMessage = {};
      let httpResponse = new HttpResponseMessage(requestMessage, xhr, responseType, reviver);

      expect(httpResponse.requestMessage).toBe(requestMessage);
      expect(httpResponse.statusCode).toBe(xhr.status);
      expect(httpResponse.response).toBe(xhr.response);
      expect(httpResponse.statusText).toBe(xhr.statusText);
      expect(httpResponse.responseType).toBe(responseType);
      expect(httpResponse.reviver).toBe(reviver);
      expect(httpResponse.headers).toEqual(jasmine.any(Headers));
    });

    it("will call the Headers.parse() if xhr.getAllResponseHeaders() is defined", () => {
      let parseSpy = spyOn(Headers, 'parse');
      let xhrMock = jasmine.createSpyObj("xhr", ["getAllResponseHeaders"]);
      xhrMock.getAllResponseHeaders.and.returnValue("");

      let httpResponse = new HttpResponseMessage({}, xhrMock);
      expect(xhrMock.getAllResponseHeaders).toHaveBeenCalled();
      expect(parseSpy).toHaveBeenCalledWith("");
    });
  });

  describe("content", () => {
    it("will return _content if defined", () => {
      let httpResponse = new HttpResponseMessage(null,{});
      let _content = httpResponse._content = {};

      expect(httpResponse.content).toBe(_content);
    });

    it("will return undefined if response is undefined", () => {
      let httpResponse = new HttpResponseMessage(null, {});
      expect(httpResponse.content).toBeUndefined();
    });

    it("will return null if response is null", () => {
      let httpResponse = new HttpResponseMessage(null, {response: null});
      expect(httpResponse.content).toBeNull();
    });

    it("will JSON.parse if the response type is 'json'", () => {
      let response = {}, reviver = {}, content = {};
      let parseSpy = spyOn(JSON, 'parse').and.returnValue(content);
      let httpResponse = new HttpResponseMessage(null, {response: response}, 'json', reviver);

      expect(httpResponse.content).toBe(content);
      expect(parseSpy).toHaveBeenCalledWith(response, reviver);
    });

    it("will call the reviver if the response type is not 'json' and the reviver is defined", () => {
      let response = {};
      let reviverSpy = jasmine.createSpy("reviver").and.returnValue(response);
      let httpResponse = new HttpResponseMessage(null, {response: response}, 'notJson', reviverSpy);

      expect(httpResponse.content).toBe(response);
      expect(reviverSpy).toHaveBeenCalledWith(response);
    });

    it("will return the response if the reviver is not set and the response type is not json", () => {
      let response = {};
      let httpResponse = new HttpResponseMessage(null, {response: response}, 'notJson');

      expect(httpResponse.content).toBe(response);
    });

    it("will catch expections on content if the response was not successful", () => {
      let reviverSpy = jasmine.createSpy("reviver").and.throwError();
      let httpResponse = new HttpResponseMessage(null, {status : 404, response : {}}, 'notJson', reviverSpy);

      expect(httpResponse.content).toBeNull();
      expect(reviverSpy).toHaveBeenCalled();
    });

    it("will throw on content if the response was successful", () => {
      let reviverSpy = jasmine.createSpy("reviver").and.throwError();
      let httpResponse = new HttpResponseMessage(null, {status : 200, response : {}}, 'notJson', reviverSpy);

      expect(() => httpResponse.content).toThrow();
      expect(reviverSpy).toHaveBeenCalled();
    });
  });
});
