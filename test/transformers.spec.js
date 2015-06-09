import * as Transforms from '../src/transformers';
import {Headers} from '../src/headers';

describe('transformers', () => {

  it("timeout should set the xhr timeout to the message timeout if defined in the message", () => {
    let xhr = {};

    Transforms.timeoutTransformer(null, null, {}, xhr);
    expect(xhr.timeout).toBeUndefined();

    Transforms.timeoutTransformer(null, null, {timeout: 200}, xhr);
    expect(xhr.timeout).toBe(200);
  });

  it("callbackParameterNameTransformer should set the xhr.callbackParameterName if defined in the message", () => {
    let xhr = {};

    Transforms.callbackParameterNameTransformer(null, null, {}, xhr);
    expect(xhr.callbackParameterName).toBeUndefined();

    Transforms.callbackParameterNameTransformer(null, null, {callbackParameterName: 'foo'}, xhr);
    expect(xhr.callbackParameterName).toBe('foo');
  });

  it("credentialsTransformer should set the xhr.withCredentials if defined in the message", () => {
    let xhr = {}, credentials = {};

    Transforms.credentialsTransformer(null, null, {}, xhr);
    expect(xhr.withCredentials).toBeUndefined();

    Transforms.credentialsTransformer(null, null, {withCredentials: credentials}, xhr);
    expect(xhr.withCredentials).toBe(credentials);
  });


  it("responseTypeTransformer should change the responseType to text when it's json", () => {
    let xhr = {upload: {}},
        progressCallback = {};

    Transforms.progressTransformer(null, null, {}, xhr);
    expect(xhr.upload.onprogress).toBeUndefined();

    Transforms.progressTransformer(null, null, {progressCallback: progressCallback}, xhr);
    expect(xhr.upload.onprogress).toBe(progressCallback);
  });

  it("contentTransformer should set the Content-Type header to application/json when it serializes the content to JSON", () => {
    let message = {headers: new Headers()};

    Transforms.contentTransformer(null, null, message, {});
    expect(message.headers.get("Content-Type")).toBeUndefined();

    message.content = "test";
    Transforms.contentTransformer(null, null, message, {});
    expect(message.headers.get("Content-Type")).toBeUndefined();

    message.content = {test:"content"};
    message.headers.add("Content-Type", "text/test");
    Transforms.contentTransformer(null, null, message, {});
    expect(message.headers.get("Content-Type")).toBe("text/test");

    message.headers.clear();
    message.content = {test:"content"};
    Transforms.contentTransformer(null, null, message, {});
    expect(message.headers.get("Content-Type")).toBe("application/json");
  });
});
