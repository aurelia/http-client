System.config({
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "es7.decorators"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "aurelia-http-client/*": "dist/system/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "aurelia-pal": "github:aurelia/pal@0.1.7",
    "aurelia-pal-browser": "github:aurelia/pal-browser@0.1.11",
    "aurelia-path": "github:aurelia/path@0.9.0",
    "babel": "npm:babel-core@5.1.13",
    "babel-runtime": "npm:babel-runtime@5.1.13",
    "core-js": "npm:core-js@1.1.3",
    "github:aurelia/pal-browser@0.1.11": {
      "aurelia-pal": "github:aurelia/pal@0.1.7"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:core-js@1.1.3": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    }
  }
});
