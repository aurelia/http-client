import './setup';
import * as XhrTransforms from '../src/xhr-transformers';
import {Headers} from '../src/headers';

describe('transformers', () => {
  it("timeout should set the xhr timeout to the message timeout if defined in the message", () => {
    let xhr = {};

    XhrTransforms.timeoutTransformer(null, null, {}, xhr);
    expect(xhr.timeout).toBeUndefined();

    XhrTransforms.timeoutTransformer(null, null, {timeout: 200}, xhr);
    expect(xhr.timeout).toBe(200);
  });

  it("callbackParameterNameTransformer should set the xhr.callbackParameterName if defined in the message", () => {
    let xhr = {};

    XhrTransforms.callbackParameterNameTransformer(null, null, {}, xhr);
    expect(xhr.callbackParameterName).toBeUndefined();

    XhrTransforms.callbackParameterNameTransformer(null, null, {callbackParameterName: 'foo'}, xhr);
    expect(xhr.callbackParameterName).toBe('foo');
  });

  it("credentialsTransformer should set the xhr.withCredentials if defined in the message", () => {
    let xhr = {}, credentials = {};

    XhrTransforms.credentialsTransformer(null, null, {}, xhr);
    expect(xhr.withCredentials).toBeUndefined();

    XhrTransforms.credentialsTransformer(null, null, {withCredentials: credentials}, xhr);
    expect(xhr.withCredentials).toBe(credentials);
  });


  it("responseTypeTransformer should change the responseType to text when it's json", () => {
    let xhr = {upload: {}},
        progressCallback = {};

    XhrTransforms.progressTransformer(null, null, {}, xhr);
    expect(xhr.upload.onprogress).toBeUndefined();

    XhrTransforms.progressTransformer(null, null, {progressCallback: progressCallback}, xhr);
    expect(xhr.upload.onprogress).toBe(progressCallback);
  });

  it("contentTransformer should set the Content-Type header to application/json when it serializes the content to JSON", () => {
    let message = {headers: new Headers()};

    XhrTransforms.contentTransformer(null, null, message, {});
    expect(message.headers.get("Content-Type")).toBeUndefined();

    message.content = "test";
    XhrTransforms.contentTransformer(null, null, message, {});
    expect(message.headers.get("Content-Type")).toBeUndefined();

    message.content = {test:"content"};
    message.headers.add("Content-Type", "text/test");
    XhrTransforms.contentTransformer(null, null, message, {});
    expect(message.headers.get("Content-Type")).toBe("text/test");

    message.headers.clear();
    message.content = {test:"content"};
    XhrTransforms.contentTransformer(null, null, message, {});
    expect(message.headers.get("Content-Type")).toBe("application/json");
  });
});
